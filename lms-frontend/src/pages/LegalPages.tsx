import React from 'react';

export const PrivacyPolicyPage: React.FC = () => (
  <div className="flex-1 bg-slate-50 py-16">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 bg-white p-8 sm:p-12 rounded-2xl border border-slate-200 shadow-sm space-y-6">
      <h1 className="text-3xl font-extrabold text-slate-900">Privacy Policy</h1>
      <p className="text-xs text-slate-400">Last Updated: October 2026</p>
      <div className="prose prose-slate text-sm leading-relaxed text-slate-700 space-y-4">
        <p>
          SkillForge Academy ("we", "our", or "us") is dedicated to safeguarding the privacy and integrity of your personal information.
        </p>
        <h3 className="font-bold text-slate-900 text-base">1. Information We Collect</h3>
        <p>
          We only collect essential information required to create accounts, process course enrollments via Razorpay, deliver notifications (via email, SMS OTP, and official WhatsApp Business templates), and issue verifiable certificates.
        </p>
        <h3 className="font-bold text-slate-900 text-base">2. Public Certificate Verification</h3>
        <p>
          When you complete a course, an official certificate is generated with a unique verification code. Our public verification tool displays only your name, course title, issue date, and issuing academy to protect your sensitive personal data.
        </p>
        <h3 className="font-bold text-slate-900 text-base">3. Security</h3>
        <p>
          Passwords are cryptographically hashed using BCrypt. Authentication sessions are managed using secure HttpOnly cookies with CSRF defenses. Payment transactions are processed directly through Razorpay with HMAC-SHA256 signature verification.
        </p>
      </div>
    </div>
  </div>
);

export const TermsPage: React.FC = () => (
  <div className="flex-1 bg-slate-50 py-16">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 bg-white p-8 sm:p-12 rounded-2xl border border-slate-200 shadow-sm space-y-6">
      <h1 className="text-3xl font-extrabold text-slate-900">Terms and Conditions</h1>
      <p className="text-xs text-slate-400">Last Updated: October 2026</p>
      <div className="prose prose-slate text-sm leading-relaxed text-slate-700 space-y-4">
        <h3 className="font-bold text-slate-900 text-base">1. Acceptance of Terms</h3>
        <p>
          By creating an account or purchasing access to any SkillForge course, you agree to comply with and be bound by these Terms and Conditions.
        </p>
        <h3 className="font-bold text-slate-900 text-base">2. Course Access & Intellectual Property</h3>
        <p>
          Enrollment grants a personal, non-transferable license to access the recorded lectures, resources, and assessments. Downloading, screen recording, or unauthorized redistribution of proprietary curriculum materials is strictly prohibited.
        </p>
        <h3 className="font-bold text-slate-900 text-base">3. Academic Integrity & Certificates</h3>
        <p>
          Certificates are earned through individual merit. Students must complete all mandatory lessons and achieve a passing score on course assessments. Any attempt to tamper with assessment evaluations will result in account suspension and revocation of credentials.
        </p>
      </div>
    </div>
  </div>
);

export const RefundPolicyPage: React.FC = () => (
  <div className="flex-1 bg-slate-50 py-16">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 bg-white p-8 sm:p-12 rounded-2xl border border-slate-200 shadow-sm space-y-6">
      <h1 className="text-3xl font-extrabold text-slate-900">Refund Policy</h1>
      <p className="text-xs text-slate-400">Last Updated: October 2026</p>
      <div className="prose prose-slate text-sm leading-relaxed text-slate-700 space-y-4">
        <h3 className="font-bold text-slate-900 text-base">1. 7-Day Money-Back Guarantee</h3>
        <p>
          We want you to be fully satisfied with your learning experience. If you are not satisfied with a self-paced course, you may request a 100% refund within 7 days of initial purchase, provided you have watched less than 25% of the course lectures and have not completed any graded assessment.
        </p>
        <h3 className="font-bold text-slate-900 text-base">2. Refund Processing</h3>
        <p>
          Approved refunds are processed back to the original payment source (Card, UPI, or Net Banking) through Razorpay within 5 to 7 business days.
        </p>
      </div>
    </div>
  </div>
);
