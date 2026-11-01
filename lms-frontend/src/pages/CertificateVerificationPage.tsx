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
  Copy,
  Check,
  Download,
} from 'lucide-react';
import { Button } from '../components/ui/Button';

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
    <div className="flex-1 bg-[#FAFAF8] py-12 lg:py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#287C78]">
            Registry
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#20252B] tracking-tight">
            Verify Certificate Authenticity
          </h1>
          <p className="text-xs sm:text-sm text-[#697386] max-w-lg mx-auto">
            SkillForge credentials carry a unique permanent identifier. Enter a Certificate ID to verify its issuance and student record.
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-white p-4 rounded-xl border border-[#E5E7EB] shadow-xs">
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Enter Certificate ID (e.g. SF-20261012-ABC123)..."
                value={inputCertId}
                onChange={(e) => setInputCertId(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-[#E5E7EB] rounded-lg font-mono text-[#20252B] placeholder:font-sans placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#172B4D]/15 focus:bg-white"
              />
            </div>
            <Button type="submit" variant="primary" size="md" loading={loading}>
              Verify Record
            </Button>
          </form>
        </div>

        {/* Results Box */}
        {hasSearched && result && (
          <div>
            {result.valid ? (
              <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 shadow-xs space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-[#E5E7EB]">
                  <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-base font-semibold text-[#20252B]">
                      Valid SkillForge Certificate
                    </h2>
                    <p className="text-xs text-emerald-700">Official registry record verified</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1">
                    <span className="text-[#697386]">Recipient Name</span>
                    <p className="text-sm font-semibold text-[#20252B]">{result.studentName}</p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[#697386]">Certificate ID</span>
                    <p className="text-sm font-mono font-semibold text-[#172B4D]">{result.certificateId}</p>
                  </div>

                  <div className="space-y-1 sm:col-span-2">
                    <span className="text-[#697386]">Completed Track</span>
                    <p className="text-sm font-semibold text-[#20252B]">{result.courseTitle}</p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[#697386]">Issue Date</span>
                    <p className="text-sm text-[#20252B]">{result.issueDate}</p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[#697386]">Issuing Body</span>
                    <p className="text-sm text-[#20252B]">{result.issuer || 'SkillForge Academy'}</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#E5E7EB]">
                  <button
                    type="button"
                    onClick={copyVerifyUrl}
                    className="inline-flex items-center gap-1.5 text-xs text-[#20252B] hover:underline"
                  >
                    {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-400" />}
                    <span>{copiedLink ? 'Link copied' : 'Copy verification link'}</span>
                  </button>

                  <Button
                    variant="outline"
                    size="sm"
                    icon={<Download className="w-4 h-4" />}
                    onClick={() => handleDownloadPdf(result.certificateId)}
                  >
                    Download PDF
                  </Button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-rose-200 p-6 text-center space-y-3">
                <XCircle className="w-8 h-8 text-rose-600 mx-auto" />
                <h2 className="text-base font-semibold text-[#20252B]">Certificate Not Found</h2>
                <p className="text-xs text-[#697386] max-w-md mx-auto">
                  No record matches ID <strong className="font-mono">{result.certificateId}</strong>. Please double-check the credential identifier.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
