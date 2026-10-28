import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, ShieldCheck, Mail, Phone, MapPin, CheckCircle, ArrowRight, Lock, Award, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail('');
  };

  return (
    <footer className="bg-slate-950 text-slate-400 mt-auto border-t border-slate-800/80">
      {/* Trust & Accreditations Strip */}
      <div className="border-b border-slate-800/80 bg-slate-900/60 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start space-x-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-white text-sm font-bold">Verifiable Credentials</p>
                <p className="text-xs text-slate-400">Cryptographically signed certificates for LinkedIn</p>
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-start space-x-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20 shrink-0">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-white text-sm font-bold">Secure Razorpay Gateway</p>
                <p className="text-xs text-slate-400">256-bit encrypted checkout with UPI & Cards</p>
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-start space-x-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20 shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <p className="text-white text-sm font-bold">Industry Curriculum</p>
                <p className="text-xs text-slate-400">Reviewed by Staff Engineers & Cloud Architects</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Brand Column */}
          <div className="md:col-span-4 space-y-4">
            <Link to="/" className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="font-display font-extrabold text-xl text-white tracking-tight">
                SkillForge<span className="text-indigo-400">.</span>
              </span>
            </Link>

            <p className="text-sm leading-relaxed text-slate-400">
              SkillForge Academy is the premier next-generation learning platform dedicated to preparing software engineers and technology leaders for high-impact industry careers.
            </p>

            {/* Newsletter Box */}
            <div className="pt-2">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">Subscribe to Tech Digest</p>
              {subscribed ? (
                <div className="flex items-center space-x-2 text-xs text-emerald-400 bg-emerald-500/10 px-3 py-2 rounded-xl border border-emerald-500/20">
                  <CheckCircle className="w-4 h-4" />
                  <span>Thank you! You are subscribed to our monthly engineering digest.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex space-x-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email..."
                    className="flex-1 bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition shadow-xs"
                  >
                    Join
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-2 md:col-start-6">
            <h3 className="text-white font-display font-bold text-sm tracking-wider uppercase mb-4">Curricula</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/courses" className="hover:text-white transition">All Bootcamps</Link>
              </li>
              <li>
                <Link to="/courses?level=BEGINNER" className="hover:text-white transition">Beginner Tracks</Link>
              </li>
              <li>
                <Link to="/courses?level=ADVANCED" className="hover:text-white transition">Advanced Bootcamps</Link>
              </li>
              <li>
                <Link to="/verify-certificate" className="hover:text-emerald-400 transition flex items-center space-x-1">
                  <span>Verify Credential</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="md:col-span-2">
            <h3 className="text-white font-display font-bold text-sm tracking-wider uppercase mb-4">Company</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/about" className="hover:text-white transition">About Us</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition">Contact Support</Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-white transition">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-white transition">Terms of Service</Link>
              </li>
              <li>
                <Link to="/refund" className="hover:text-white transition">Refund Policy</Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="md:col-span-3">
            <h3 className="text-white font-display font-bold text-sm tracking-wider uppercase mb-4">Headquarters</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                <span>Koramangala 4th Block, Bangalore, Karnataka 560034</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>support@skillforge.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-900 mt-14 pt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 space-y-4 sm:space-y-0">
          <p>&copy; {new Date().getFullYear()} SkillForge Academy Pvt Ltd. All rights reserved.</p>
          <div className="flex space-x-6">
            <Link to="/privacy" className="hover:text-slate-300 transition">Privacy</Link>
            <Link to="/terms" className="hover:text-slate-300 transition">Terms</Link>
            <Link to="/refund" className="hover:text-slate-300 transition">Refunds</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
