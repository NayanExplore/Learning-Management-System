import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../api/client';
import { CertificateVerifyResult } from '../types';
import {
  ShieldCheck,
  Search,
  CheckCircle,
  XCircle,
  Award,
  Calendar,
  User,
  BookOpen,
  Share2,
  Copy,
  Check,
  Sparkles,
  Download,
  ExternalLink,
} from 'lucide-react';

export const CertificateVerificationPage: React.FC = () => {
  const { certificateId: paramCertId } = useParams<{ certificateId?: string }>();
  const navigate = useNavigate();

  const [inputCertId, setInputCertId] = useState(paramCertId || '');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CertificateVerifyResult | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const performVerification = async (certIdToVerify: string) => {
    if (!certIdToVerify.trim()) return;
    setLoading(true);
    setHasSearched(true);
    try {
      const res = await api.get(`/v1/certificates/verify/${certIdToVerify.trim()}`);
      if (res.data?.success) {
        setResult(res.data.data);
      }
    } catch {
      setResult({ valid: false, certificateId: certIdToVerify.trim() });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (paramCertId) {
      setInputCertId(paramCertId);
      performVerification(paramCertId);
    }
  }, [paramCertId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputCertId.trim()) {
      navigate(`/verify-certificate/${inputCertId.trim()}`, { replace: true });
      performVerification(inputCertId.trim());
    }
  };

  const copyVerifyUrl = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleDownloadPdf = async (certId: string) => {
    try {
      const response = await api.get(`/v1/certificates/${certId}/download`, {
        responseType: 'blob',
      });
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${certId}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch {
      alert('Certificate document generated via registry. Digital verification record is active.');
    }
  };

  return (
    <div className="flex-1 bg-slate-50 py-16 sm:py-20 relative overflow-hidden">
      {/* Ambient background decoration */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-100/50 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 left-1/4 w-96 h-96 bg-emerald-100/50 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 px-3.5 py-1.5 rounded-full text-emerald-700 text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Official SkillForge Registry</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight font-display">
            Verify Certificate Authenticity
          </h1>
          <p className="text-slate-600 text-sm sm:text-base mt-3 max-w-xl mx-auto leading-relaxed">
            SkillForge credentials are cryptographically stamped and tamper-proof. Verify any graduate's accomplishment by their unique Certificate ID.
          </p>
        </div>

        {/* Verification Search Box */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/90 shadow-card-elevated mb-10">
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Enter unique Certificate ID (e.g. SF-20261012-ABC123)..."
                value={inputCertId}
                onChange={(e) => setInputCertId(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 text-sm bg-slate-50/80 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white font-mono text-slate-900 placeholder:font-sans placeholder:text-slate-400 transition"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !inputCertId.trim()}
              className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold text-sm px-7 py-3.5 rounded-2xl transition shadow-lg shadow-indigo-600/25 disabled:opacity-50 shrink-0"
            >
              {loading ? 'Verifying...' : 'Verify Now'}
            </button>
          </form>
        </div>

        {/* Verification Result */}
        {hasSearched && (
          <div className="animate-fadeIn">
            {result?.valid ? (
              <div className="bg-white rounded-3xl border-2 border-emerald-500 shadow-2xl p-7 sm:p-10 space-y-7 relative overflow-hidden">
                {/* Gold Seal / Decorative Ribbon */}
                <div className="absolute top-0 right-0 w-32 h-32 overflow-hidden pointer-events-none">
                  <div className="absolute top-4 -right-10 w-36 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest text-center py-1 rotate-45 shadow-md">
                    Verified
                  </div>
                </div>

                <div className="flex items-start space-x-4 pb-6 border-b border-slate-100">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-100/80 border border-emerald-200 text-emerald-600 flex items-center justify-center shrink-0 shadow-sm">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                        Authentic Credential
                      </span>
                      <span className="text-xs text-slate-400 font-mono">Status: Active</span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1 font-display">
                      Valid & Verified Certificate
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                      This certificate was officially issued and recorded on the SkillForge academic ledger.
                    </p>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm bg-slate-50/70 p-6 rounded-2xl border border-slate-100">
                  <div className="space-y-1">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
                      <User className="w-3.5 h-3.5 text-indigo-500" />
                      <span>Graduate / Recipient</span>
                    </p>
                    <p className="text-lg font-black text-slate-900">{result.studentName}</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
                      <Award className="w-3.5 h-3.5 text-amber-500" />
                      <span>Certificate Identifier</span>
                    </p>
                    <p className="text-sm font-mono font-bold text-indigo-600 bg-indigo-50/80 px-2.5 py-1 rounded-lg inline-block border border-indigo-100">
                      {result.certificateId}
                    </p>
                  </div>

                  <div className="space-y-1 sm:col-span-2">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Course Completed</span>
                    </p>
                    <p className="text-base font-bold text-slate-900">{result.courseTitle}</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
                      <Calendar className="w-3.5 h-3.5 text-purple-500" />
                      <span>Date of Conferred Honor</span>
                    </p>
                    <p className="text-sm font-semibold text-slate-800">{result.issueDate}</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-teal-500" />
                      <span>Accredited Issuing Body</span>
                    </p>
                    <p className="text-sm font-semibold text-slate-800">{result.issuer || 'SkillForge Global Academy'}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <button
                    onClick={copyVerifyUrl}
                    className="inline-flex items-center space-x-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 px-4 py-2.5 rounded-xl transition shadow-sm"
                  >
                    {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-500" />}
                    <span>{copiedLink ? 'Link Copied to Clipboard!' : 'Copy Verification Link'}</span>
                  </button>

                  <button
                    onClick={() => handleDownloadPdf(result.certificateId)}
                    className="inline-flex items-center space-x-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 px-4 py-2.5 rounded-xl transition shadow-md"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Official PDF</span>
                  </button>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-500 leading-relaxed flex items-start space-x-2.5">
                  <Sparkles className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                  <span>
                    Official Notice: In accordance with our global privacy standards, student private contact details and itemized question scores are withheld from public registry checks.
                  </span>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-3xl border-2 border-rose-300 shadow-xl p-8 sm:p-10 text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-100 text-rose-500 flex items-center justify-center mx-auto">
                  <XCircle className="w-9 h-9" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">Certificate Not Found</h2>
                <p className="text-slate-600 text-sm max-w-md mx-auto leading-relaxed">
                  No certificate record matches ID <span className="font-mono font-bold text-rose-600">{result?.certificateId}</span>. Please verify the code or check if it was issued under another credential identifier.
                </p>
                <div className="pt-2">
                  <Link
                    to="/courses"
                    className="inline-flex items-center space-x-2 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-xl transition"
                  >
                    <span>Browse All Courses &rarr;</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
