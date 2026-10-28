import React, { useState } from 'react';
import { api } from '../api/client';
import { Mail, Phone, MapPin, CheckCircle, AlertCircle, Send, Sparkles, MessageSquare, Clock } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Course Inquiry');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await api.post('/v1/public/contact', {
        name,
        email,
        subject,
        message,
      });
      setSuccess(true);
      setName('');
      setEmail('');
      setMessage('');
    } catch (err: any) {
      setError(err.message || 'Failed to submit inquiry.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 bg-slate-50 py-16 sm:py-24 relative overflow-hidden">
      {/* Ambient background decoration */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-100/50 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 left-1/4 w-96 h-96 bg-purple-100/50 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 px-3.5 py-1.5 rounded-full text-indigo-700 text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
            <MessageSquare className="w-4 h-4 text-indigo-600" />
            <span>Admissions & Support Concierge</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight font-display">
            Get in Touch With Us
          </h1>
          <p className="text-slate-600 text-sm sm:text-base mt-3 leading-relaxed">
            Have questions about course syllabi, corporate team subscriptions, or payment arrangements? Our mentorship coordinators are standing by.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {/* Contact Details Card */}
          <div className="bg-slate-950 text-white p-8 sm:p-10 rounded-3xl border border-slate-800 space-y-8 flex flex-col justify-between shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative">
              <h2 className="text-xl font-bold font-display mb-3">SkillForge Office</h2>
              <p className="text-slate-400 text-xs leading-relaxed mb-8">
                Our team responds to all student, recruiter, and corporate requests within 24 business hours.
              </p>

              <div className="space-y-6 text-sm">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0 text-indigo-400">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-white text-sm">Academy Headquarters</p>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      Koramangala 4th Block, 100 Feet Road, Bangalore, Karnataka 560034, India
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0 text-emerald-400">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-white text-sm">Student Support Hotline</p>
                    <p className="text-xs text-slate-400 mt-0.5">+91 98765 43210</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0 text-purple-400">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-white text-sm">Email Inquiries</p>
                    <p className="text-xs text-slate-400 mt-0.5">support@skillforge.com</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs text-slate-400 flex items-center space-x-2.5">
              <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Dedicated student portal available 24/7/365</span>
            </div>
          </div>

          {/* Form Card */}
          <div className="lg:col-span-2 bg-white p-8 sm:p-12 rounded-3xl border border-slate-200/90 shadow-card-elevated">
            {success ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle className="w-9 h-9" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 font-display">Inquiry Received!</h3>
                <p className="text-slate-600 text-sm max-w-md mx-auto leading-relaxed">
                  Thank you for connecting. An academic counselor will review your inquiry and reply via email within 24 hours.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => setSuccess(false)}
                    className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs px-6 py-3 rounded-xl transition"
                  >
                    Send Another Message
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700 flex items-center space-x-2.5">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Priya Sharma"
                      className="w-full px-4 py-3 text-sm bg-slate-50/80 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="priya@example.com"
                      className="w-full px-4 py-3 text-sm bg-slate-50/80 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Inquiry Topic
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-4 py-3 text-sm bg-slate-50/80 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900 transition"
                  >
                    <option value="Course Inquiry">Course Curriculum & Admission Inquiry</option>
                    <option value="Payment / Invoice Question">Razorpay Payment / GST Invoice Query</option>
                    <option value="Certificate Verification">Certificate & Academic Ledger Verification</option>
                    <option value="Corporate / Team Training">Enterprise / Corporate Cohort Upskilling</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Message Details
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us what you'd like to discuss or learn..."
                    className="w-full px-4 py-3 text-sm bg-slate-50/80 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900 transition"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-extrabold text-sm px-8 py-3.5 rounded-2xl shadow-lg shadow-indigo-600/30 transition disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    <span>{loading ? 'Transmitting Message...' : 'Send Inquiry Message'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
