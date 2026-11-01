import React, { useState } from 'react';
import { api } from '../api/client';
import { Mail, Phone, MapPin, CheckCircle, AlertCircle, Send } from 'lucide-react';
import { Button } from '../components/ui/Button';

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
    <div className="flex-1 bg-slate-950 py-12 lg:py-16 text-slate-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-wider text-teal-400 mb-1">
            Get in touch
          </p>
          <h1 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
            Contact Support & Admissions
          </h1>
          <p className="text-sm text-slate-400 mt-2">
            Have questions about course syllabi, corporate training, or billing inquiries? Our team is here to assist you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Details */}
          <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-xs space-y-6">
            <div>
              <h2 className="text-sm font-semibold text-white">SkillForge Office</h2>
              <p className="text-xs text-slate-400 mt-1">We respond to student requests within 24 business hours.</p>
            </div>

            <div className="space-y-4 text-xs text-slate-400">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">Headquarters</p>
                  <p className="mt-0.5">Koramangala 4th Block, Bengaluru, Karnataka 560034, India</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">Telephone</p>
                  <p className="mt-0.5">+91 98765 43210</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">Email</p>
                  <p className="mt-0.5">support@skillforge.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Inquiry Form */}
          <div className="lg:col-span-2 bg-slate-900 p-6 sm:p-8 rounded-xl border border-slate-800 shadow-xs">
            {success ? (
              <div className="text-center py-8 space-y-3">
                <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto" />
                <h3 className="text-base font-semibold text-white">Inquiry Received</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Thank you for reaching out. A SkillForge coordinator will review your request and reply shortly.
                </p>
                <Button variant="outline" size="sm" onClick={() => setSuccess(false)} className="border-slate-700 text-slate-200">
                  Send Another Message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                {error && (
                  <div className="p-3 bg-rose-950/40 border border-rose-900 rounded-lg text-rose-300 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-200 mb-1.5">Your Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Jane Doe"
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-200 mb-1.5">Email Address</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@company.com"
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-200 mb-1.5">Topic</label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  >
                    <option value="Course Inquiry">Course Curriculum & Admission Inquiry</option>
                    <option value="Payment / Invoice Question">Payment & Invoice Questions</option>
                    <option value="Certificate Verification">Certificate Verification Inquiry</option>
                    <option value="Corporate / Team Training">Enterprise / Team Training</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-200 mb-1.5">Message</label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us what you would like to discuss..."
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  />
                </div>

                <Button type="submit" variant="teal" size="md" loading={loading} icon={<Send className="w-4 h-4" />}>
                  Submit Inquiry
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
