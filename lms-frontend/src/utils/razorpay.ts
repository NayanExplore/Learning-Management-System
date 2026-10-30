import { api } from '../api/client';
import { OrderResponse, User } from '../types';

declare global {
  interface Window {
    Razorpay?: any;
  }
}

interface CheckoutOptions {
  courseId: number;
  courseTitle: string;
  user: User;
  onSuccess: (orderNumber: string) => void;
  onError: (errorMsg: string) => void;
  onShowcaseModal?: (order: OrderResponse) => void;
}

export const initiateRazorpayCheckout = async ({
  courseId,
  courseTitle,
  user,
  onSuccess,
  onError,
  onShowcaseModal,
}: CheckoutOptions) => {
  try {
    // 1. Create order on backend (authoritative server price!)
    const orderRes = await api.post('/v1/orders', { courseId });
    if (!orderRes.data?.success) {
      throw new Error(orderRes.data?.message || 'Failed to initiate order.');
    }

    const order: OrderResponse = orderRes.data.data;

    // 2. If order is already completed (e.g. free course or instant fulfillment)
    if (order.status === 'PAID') {
      onSuccess(order.orderNumber);
      return;
    }

    // 3. Check if running in sandbox/development mode
    // (i.e. no live Razorpay key provided, key contains placeholder, order is a sandbox order, or SDK missing)
    const isSandbox =
      !order.razorpayKeyId ||
      order.razorpayKeyId === 'rzp_test_placeholder' ||
      order.razorpayKeyId.includes('placeholder') ||
      order.razorpayOrderId?.startsWith('order_sandbox_') ||
      order.razorpayOrderId?.startsWith('free_') ||
      typeof window.Razorpay !== 'function';

    if (isSandbox) {
      if (onShowcaseModal) {
        // Open interactive Razorpay Showcase Modal for digital payment showcase
        onShowcaseModal(order);
        return;
      }

      console.info('Sandbox / Test payment mode active. Completing sandbox verification for order:', order.orderNumber);
      // Direct sandbox completion call for development/testing
      const verifyRes = await api.post('/v1/payments/verify', {
        razorpayOrderId: order.razorpayOrderId,
        razorpayPaymentId: 'pay_sandbox_' + Date.now(),
        razorpaySignature: 'mock_signature_sandbox',
      });
      if (verifyRes.data?.success) {
        onSuccess(order.orderNumber);
        return;
      } else {
        throw new Error(verifyRes.data?.message || 'Sandbox payment verification failed.');
      }
    }

    // 4. Initialize real Razorpay Checkout
    const options = {
      key: order.razorpayKeyId,
      amount: Math.round(order.amount * 100), // in paise
      currency: order.currency || 'INR',
      name: 'SkillForge Academy',
      description: `Enrollment: ${courseTitle}`,
      order_id: order.razorpayOrderId,
      prefill: {
        name: user.fullName,
        email: user.email,
        contact: user.phone || '',
      },
      theme: {
        color: '#4F46E5',
      },
      handler: async function (response: {
        razorpay_payment_id: string;
        razorpay_order_id: string;
        razorpay_signature: string;
      }) {
        try {
          // Send payment details to backend for cryptographic signature verification
          const verifyRes = await api.post('/v1/payments/verify', {
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
          });

          if (verifyRes.data?.success) {
            onSuccess(order.orderNumber);
          } else {
            onError(verifyRes.data?.message || 'Payment signature verification failed.');
          }
        } catch (err: any) {
          const errMsg = err.response?.data?.message || err.message || 'Error communicating with server during payment verification.';
          onError(errMsg);
        }
      },
      modal: {
        ondismiss: function () {
          onError('Payment window was closed before completion.');
        },
      },
    };

    const rzpInstance = new window.Razorpay(options);
    rzpInstance.on('payment.failed', function (resp: any) {
      onError(resp.error?.description || resp.error?.reason || 'Payment failed.');
    });
    rzpInstance.open();
  } catch (err: any) {
    // err is the payload from the Axios response interceptor: { message, status }
    const status = err?.status;
    let errorMsg: string;
    if (status === 401 || status === 403) {
      errorMsg = 'Your session has expired. Please log in again to enroll.';
    } else if (status === 400 && err?.message?.toLowerCase().includes('already enrolled')) {
      errorMsg = 'You are already enrolled in this course!';
    } else {
      errorMsg = err?.message || 'Unable to initiate checkout.';
    }
    onError(errorMsg);
  }
};
