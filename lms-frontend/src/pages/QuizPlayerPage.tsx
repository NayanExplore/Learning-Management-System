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
      <div className="flex-1 flex flex-col items-center justify-center py-32 bg-slate-50">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin"></div>
          <Sparkles className="w-6 h-6 text-indigo-600 absolute inset-0 m-auto animate-pulse" />
        </div>
        <p className="mt-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Preparing Knowledge Assessment...</p>
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="flex-1 flex items-center justify-center py-24 p-4 bg-slate-50">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center max-w-md shadow-xl">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center mx-auto mb-4 text-rose-500">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold mb-2 text-slate-900">Quiz Unavailable</h2>
          <p className="text-slate-600 text-sm mb-6 leading-relaxed">{error || 'Could not load quiz questions.'}</p>
          <Link to="/dashboard" className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-6 py-3 rounded-xl text-sm font-bold shadow-lg shadow-indigo-600/25">
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-slate-50 py-12 relative overflow-hidden">
      {/* Subtle ambient light */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-100/40 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6">
        {/* Header Breadcrumb */}
        <div className="flex items-center justify-between mb-6">
          <Link
            to={`/learn/${quiz.courseId}`}
            className="inline-flex items-center space-x-2 text-xs font-bold text-slate-500 hover:text-slate-900 transition group"
          >
            <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center group-hover:bg-slate-100 transition shadow-sm">
              <ChevronLeft className="w-4 h-4" />
            </div>
            <span>Back to Classroom Theater</span>
          </Link>

          <div className="flex items-center space-x-2 text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-3.5 py-1.5 rounded-full shadow-sm">
            <span>Passing Mark: {quiz.passingScore}%</span>
          </div>
        </div>

        {/* Title Card */}
        <div className="bg-white p-7 sm:p-9 rounded-3xl border border-slate-200/90 shadow-card-elevated mb-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-indigo-600 to-purple-600"></div>
          <div className="flex items-center space-x-2 text-indigo-600 mb-2">
            <HelpCircle className="w-5 h-5" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-indigo-600">Graded Knowledge Evaluation</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-display mb-2">{quiz.title}</h1>
          <p className="text-slate-600 text-sm leading-relaxed">{quiz.description}</p>
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
                className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-card-elevated space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <span className="text-indigo-600 font-black">Question {qIndex + 1}</span>
                    <span>&bull;</span>
                    <span>of {quiz.questions.length}</span>
                    <span>&bull;</span>
                    <span>{q.points} point{q.points > 1 ? 's' : ''}</span>
                  </div>

                  {feedback && (
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full flex items-center space-x-1.5 ${
                        feedback.correct
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : 'bg-rose-100 text-rose-800 border border-rose-200'
                      }`}
                    >
                      {feedback.correct ? (
                        <>
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Correct</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3.5 h-3.5 text-rose-600" />
                          <span>Incorrect</span>
                        </>
                      )}
                    </span>
                  )}
                </div>

                <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">{q.questionText}</h3>
                {isMultiple && (
                  <p className="text-xs text-indigo-600 font-bold bg-indigo-50 inline-block px-2.5 py-0.5 rounded-md">
                    Select all options that apply
                  </p>
                )}

                {/* Answer Options */}
                <div className="space-y-3 pt-2">
                  {q.options.map((opt) => {
                    const isSelected = (selectedAnswers[q.id] || []).includes(opt.id);
                    const isAnswerCorrect = feedback?.correctOptionIds.includes(opt.id);

                    let optionBorder = 'border-slate-200 hover:border-indigo-400 bg-slate-50/60';
                    if (isSelected && !result) {
                      optionBorder = 'border-indigo-600 bg-indigo-50/50 text-indigo-950 font-bold shadow-sm';
                    } else if (result) {
                      if (isAnswerCorrect) {
                        optionBorder = 'border-emerald-500 bg-emerald-50/60 text-emerald-950 font-bold shadow-sm';
                      } else if (isSelected && !isAnswerCorrect) {
                        optionBorder = 'border-rose-400 bg-rose-50/60 text-rose-950';
                      }
                    }

                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => handleOptionSelect(q.id, opt.id, isMultiple)}
                        disabled={!!result}
                        className={`w-full text-left p-4 rounded-2xl border text-sm transition flex items-center justify-between ${optionBorder}`}
                      >
                        <span className="pr-4 leading-relaxed font-medium">{opt.optionText}</span>
                        <div
                          className={`w-5 h-5 rounded-${
                            isMultiple ? 'md' : 'full'
                          } border flex items-center justify-center shrink-0 transition ${
                            isSelected ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300'
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
                  <div className="mt-4 p-4.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-700 leading-relaxed">
                    <span className="font-bold text-slate-900">Explanation: </span>
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
                  className="inline-flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold text-xs px-6 py-3.5 rounded-2xl transition shadow-lg shadow-indigo-600/25"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Retake Assessment</span>
                </button>
              )}
              <Link
                to={`/learn/${quiz.courseId}`}
                className="bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs px-6 py-3.5 rounded-2xl border border-slate-200 transition shadow-sm"
              >
                Back to Classroom Theater
              </Link>
            </div>
          ) : (
            <button
              onClick={handleSubmitQuiz}
              disabled={submitting}
              className="bg-gradient-to-r from-indigo-600 via-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-sm px-9 py-4 rounded-2xl transition shadow-lg shadow-indigo-600/30 disabled:opacity-50"
            >
              {submitting ? 'Evaluating Assessment Answers...' : 'Submit Assessment Answers'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
