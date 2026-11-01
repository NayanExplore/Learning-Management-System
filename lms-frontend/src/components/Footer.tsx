import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, ShieldCheck, Mail, Phone, MapPin, Check } from 'lucide-react';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail('');
  };

  return (
    <footer className="bg-white border-t border-[#E5E7EB] text-[#697386] mt-auto">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#172B4D] flex items-center justify-center text-white">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="text-base font-bold text-[#20252B]">SkillForge</span>
            </Link>

            <p className="text-sm leading-relaxed text-[#697386] max-w-sm">
              SkillForge provides structured, industry-aligned technical curricula designed to help developers and technology professionals build practical skills and verify their competencies.
            </p>

            <div className="pt-2">
              <p className="text-xs font-semibold text-[#20252B] mb-2">Subscribe to course updates</p>
              {subscribed ? (
                <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 px-3 py-2 rounded-lg border border-emerald-200">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>Thank you. You will receive updates on new curricula.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2 max-w-sm">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="flex-1 bg-white border border-[#E5E7EB] rounded-lg px-3 py-1.5 text-xs text-[#20252B] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#172B4D]/20 focus:border-[#172B4D]"
                  />
                  <button
                    type="submit"
                    className="bg-[#172B4D] hover:bg-[#0E1E38] text-white font-medium text-xs px-3.5 py-1.5 rounded-lg transition-colors"
                  >
                    Subscribe
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Programs */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#20252B] mb-3.5">
              Curricula
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/courses" className="hover:text-[#20252B] transition-colors">
                  All Courses
                </Link>
              </li>
              <li>
                <Link to="/courses" className="hover:text-[#20252B] transition-colors">
                  Web Engineering
                </Link>
              </li>
              <li>
                <Link to="/courses" className="hover:text-[#20252B] transition-colors">
                  Cloud & Backend
                </Link>
              </li>
              <li>
                <Link to="/verify-certificate" className="hover:text-[#20252B] transition-colors flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#287C78]" />
                  <span>Verify Credential</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#20252B] mb-3.5">
              Platform
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/about" className="hover:text-[#20252B] transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#20252B] transition-colors">
                  Support & Contact
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-[#20252B] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-[#20252B] transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/refund" className="hover:text-[#20252B] transition-colors">
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#20252B] mb-3.5">
              Contact
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <span>Koramangala 4th Block, Bengaluru, Karnataka 560034</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <span>support@skillforge.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#E5E7EB] mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#697386] gap-3">
          <p>© {new Date().getFullYear()} SkillForge Learning. All rights reserved.</p>
          <div className="flex gap-4">
            <Link to="/privacy" className="hover:text-[#20252B] transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-[#20252B] transition-colors">Terms</Link>
            <Link to="/refund" className="hover:text-[#20252B] transition-colors">Refund Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
