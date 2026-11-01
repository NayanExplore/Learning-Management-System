import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { Quiz, QuizResult } from '../types';
import {
  HelpCircle,
  Award,
  CheckCircle,
  XCircle,
  Download,
  ArrowRight,
  ChevronLeft,
  AlertCircle,
  Clock,
  Sparkles,
  RotateCcw,
  BookOpen,
} from 'lucide-react';

export const QuizPlayerPage: React.FC = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number[]>>({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/v1/quizzes/${quizId}`);
        if (res.data?.success) {
          setQuiz(res.data.data);
        } else {
          setError('Quiz not found');
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load assessment questions.');
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [quizId]);

  const handleOptionSelect = (questionId: number, optionId: number, isMultiple: boolean) => {
    if (result) return;

    setSelectedAnswers((prev) => {
      const current = prev[questionId] || [];
      if (isMultiple) {
        if (current.includes(optionId)) {
          return { ...prev, [questionId]: current.filter((id) => id !== optionId) };
        } else {
          return { ...prev, [questionId]: [...current, optionId] };
        }
      } else {
        return { ...prev, [questionId]: [optionId] };
      }
    });
  };

  const handleSubmitQuiz = async () => {
    if (!quiz) return;
    setSubmitting(true);
    try {
      const payload = {
        answers: quiz.questions.map((q) => ({
          questionId: q.id,
          selectedOptionIds: selectedAnswers[q.id] || [],
        })),
      };

      const res = await api.post(`/v1/quizzes/${quiz.id}/submit`, payload);
      if (res.data?.success) {
        setResult(res.data.data);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (err: any) {
      alert(err.message || 'Failed to submit quiz.');
    } finally {
      setSubmitting(false);
    }
  };

  const downloadCertificate = async (certId: string) => {
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
      alert('Failed to download certificate.');
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-32 bg-slate-950 text-slate-100">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-4 border-slate-800 border-t-teal-500 animate-spin"></div>
          <Sparkles className="w-6 h-6 text-teal-400 absolute inset-0 m-auto animate-pulse" />
        </div>
        <p className="mt-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Preparing Knowledge Assessment...</p>
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="flex-1 flex items-center justify-center py-24 p-4 bg-slate-950 text-slate-100">
        <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 text-center max-w-md shadow-xl">
          <div className="w-14 h-14 rounded-2xl bg-rose-950/40 border border-rose-900 flex items-center justify-center mx-auto mb-4 text-rose-400">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold mb-2 text-white">Quiz Unavailable</h2>
          <p className="text-slate-400 text-sm mb-6 leading-relaxed">{error || 'Could not load quiz questions.'}</p>
          <Link to="/dashboard" className="bg-teal-600 hover:bg-teal-500 text-white px-6 py-3 rounded-xl text-sm font-bold shadow-lg transition">
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-slate-950 py-12 relative overflow-hidden text-slate-100">
      <div className="relative max-w-3xl mx-auto px-4 sm:px-6">
        {/* Header Breadcrumb */}
        <div className="flex items-center justify-between mb-6">
          <Link
            to={`/learn/${quiz.courseId}`}
            className="inline-flex items-center space-x-2 text-xs font-bold text-slate-400 hover:text-white transition group"
          >
            <div className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center group-hover:bg-slate-800 transition shadow-sm text-slate-300">
              <ChevronLeft className="w-4 h-4" />
            </div>
            <span>Back to Classroom</span>
          </Link>

          <div className="flex items-center space-x-2 text-xs font-bold text-teal-400 bg-teal-950/40 border border-teal-900 px-3.5 py-1.5 rounded-full shadow-sm">
            <span>Passing Mark: {quiz.passingScore}%</span>
          </div>
        </div>

        {/* Title Card */}
        <div className="bg-slate-900 p-7 sm:p-9 rounded-2xl border border-slate-800 shadow-sm mb-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-2 h-full bg-teal-500"></div>
          <div className="flex items-center space-x-2 text-teal-400 mb-2">
            <HelpCircle className="w-5 h-5" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-teal-400">Graded Knowledge Evaluation</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-2">{quiz.title}</h1>
          <p className="text-slate-400 text-sm leading-relaxed">{quiz.description}</p>
        </div>

        {/* Result Banner (if submitted) */}
        {result && (
          <div
            className={`p-7 rounded-3xl border-2 mb-8 shadow-xl animate-fadeIn ${
              result.passed
                ? 'bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-400 text-emerald-950'
                : 'bg-gradient-to-br from-rose-50 to-orange-50 border-rose-300 text-rose-950'
            }`}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
              <div>
                <div className="flex items-center space-x-2.5">
                  {result.passed ? (
                    <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-md">
                      <CheckCircle className="w-6 h-6" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-2xl bg-rose-500 text-white flex items-center justify-center shadow-md">
                      <XCircle className="w-6 h-6" />
                    </div>
                  )}
                  <div>
                    <h3 className="text-xl font-black tracking-tight font-display">
                      {result.passed ? 'Assessment Passed! Congratulations' : 'Assessment Incomplete'}
                    </h3>
                    <p className="text-xs font-semibold opacity-80">
                      Score: <span className="font-bold text-sm">{result.score}%</span> &bull; Earned {result.earnedPoints} of {result.totalPoints} points
                    </p>
                  </div>
                </div>
                <p className="text-xs sm:text-sm mt-3 leading-relaxed">
                  {result.passed
                    ? 'You have successfully satisfied this curriculum requirement. Your achievement is recorded in your profile.'
                    : `A minimum passing score of ${result.passingScore}% is required. Review the lecture notes and try again.`}
                </p>
              </div>

              {result.certificateId ? (
                <div className="shrink-0 space-y-2">
                  <button
                    onClick={() => downloadCertificate(result.certificateId!)}
                    className="inline-flex items-center space-x-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs px-5 py-3 rounded-xl shadow-lg shadow-emerald-600/30 transition"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Certificate</span>
                  </button>
                  <p className="text-[11px] text-emerald-800 font-bold text-center">
                    Certificate unlocked & active!
                  </p>
                </div>
              ) : (
                result.passed && (
                  <Link
                    to={`/learn/${quiz.courseId}`}
                    className="inline-flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold text-xs px-5 py-3 rounded-xl shadow-lg shadow-indigo-600/25 transition shrink-0"
                  >
                    <span>Back to Classroom</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                )
              )}
            </div>
          </div>
        )}

        {/* Question Cards */}
        <div className="space-y-6">
          {quiz.questions.map((q, qIndex) => {
            const feedback = result?.feedback.find((f) => f.questionId === q.id);
            const isMultiple = q.questionType === 'MULTIPLE_CHOICE';

            return (
              <div
                key={q.id}
                className="bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-sm space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <span className="text-teal-400 font-bold">Question {qIndex + 1}</span>
                    <span>&bull;</span>
                    <span>of {quiz.questions.length}</span>
                    <span>&bull;</span>
                    <span>{q.points} point{q.points > 1 ? 's' : ''}</span>
                  </div>

                  {feedback && (
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full flex items-center space-x-1.5 ${
                        feedback.correct
                          ? 'bg-emerald-950/50 text-emerald-300 border border-emerald-800'
                          : 'bg-rose-950/50 text-rose-300 border border-rose-800'
                      }`}
                    >
                      {feedback.correct ? (
                        <>
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Correct</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3.5 h-3.5 text-rose-400" />
                          <span>Incorrect</span>
                        </>
                      )}
                    </span>
                  )}
                </div>

                <h3 className="text-base sm:text-lg font-bold text-white leading-snug">{q.questionText}</h3>
                {isMultiple && (
                  <p className="text-xs text-teal-400 font-bold bg-teal-950/40 inline-block px-2.5 py-0.5 rounded-md border border-teal-900">
                    Select all options that apply
                  </p>
                )}

                {/* Answer Options */}
                <div className="space-y-3 pt-2">
                  {q.options.map((opt) => {
                    const isSelected = (selectedAnswers[q.id] || []).includes(opt.id);
                    const isAnswerCorrect = feedback?.correctOptionIds.includes(opt.id);

                    let optionBorder = 'border-slate-800 hover:border-teal-500/60 bg-slate-850 text-slate-200';
                    if (isSelected && !result) {
                      optionBorder = 'border-teal-500 bg-teal-950/40 text-white font-bold ring-1 ring-teal-500';
                    } else if (result) {
                      if (isAnswerCorrect) {
                        optionBorder = 'border-emerald-500 bg-emerald-950/50 text-emerald-200 font-bold';
                      } else if (isSelected && !isAnswerCorrect) {
                        optionBorder = 'border-rose-500 bg-rose-950/50 text-rose-200';
                      }
                    }

                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => handleOptionSelect(q.id, opt.id, isMultiple)}
                        disabled={!!result}
                        className={`w-full text-left p-4 rounded-xl border text-sm transition flex items-center justify-between ${optionBorder}`}
                      >
                        <span className="pr-4 leading-relaxed font-medium">{opt.optionText}</span>
                        <div
                          className={`w-5 h-5 rounded-${
                            isMultiple ? 'md' : 'full'
                          } border flex items-center justify-center shrink-0 transition ${
                            isSelected ? 'bg-teal-600 border-teal-600 text-white' : 'border-slate-600'
                          }`}
                        >
                          {isSelected && (
                            <span className="text-xs font-bold leading-none">{isMultiple ? '✓' : '•'}</span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Explanation feedback */}
                {feedback && feedback.explanation && (
                  <div className="mt-4 p-4.5 bg-slate-800/80 rounded-xl border border-slate-700 text-xs text-slate-300 leading-relaxed">
                    <span className="font-bold text-white">Explanation: </span>
                    {feedback.explanation}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Submit Actions */}
        <div className="mt-10 flex justify-end">
          {result ? (
            <div className="flex space-x-3.5">
              {!result.passed && (
                <button
                  onClick={() => {
                    setResult(null);
                    setSelectedAnswers({});
                  }}
                  className="inline-flex items-center space-x-2 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs px-6 py-3.5 rounded-xl transition shadow-lg"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Retake Assessment</span>
                </button>
              )}
              <Link
                to={`/learn/${quiz.courseId}`}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs px-6 py-3.5 rounded-xl border border-slate-700 transition"
              >
                Back to Classroom
              </Link>
            </div>
          ) : (
            <button
              onClick={handleSubmitQuiz}
              disabled={submitting}
              className="bg-teal-600 hover:bg-teal-500 text-white font-bold text-sm px-9 py-4 rounded-xl transition shadow-lg disabled:opacity-50"
            >
              {submitting ? 'Evaluating Assessment Answers...' : 'Submit Assessment Answers'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
