import React, { useEffect, useState } from 'react';
import { api } from '../api/client';
import { CourseSummary } from '../types';
import { CourseCard } from '../components/CourseCard';
import { Search, Filter, BookOpen, X, Sparkles, SlidersHorizontal } from 'lucide-react';

export const CourseCatalogPage: React.FC = () => {
  const [courses, setCourses] = useState<CourseSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('');

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (searchTerm) params.q = searchTerm;
      if (selectedLevel) params.level = selectedLevel;

      const res = await api.get('/v1/courses', { params });
      if (res.data?.success) {
        setCourses(res.data.data.content);
      }
    } catch (err) {
      console.error('Failed to load courses', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCourses();
    }, 250);
    return () => clearTimeout(timer);
  }, [searchTerm, selectedLevel]);

  return (
    <div className="flex-1 bg-slate-50/70 py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Banner */}
        <div className="mb-10 text-center sm:text-left">
          <div className="inline-flex items-center space-x-2 text-indigo-600 font-bold text-xs uppercase tracking-widest mb-3 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Comprehensive Learning Catalog</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-slate-900 tracking-tight">
            Explore Bootcamps & Specializations
          </h1>
          <p className="text-slate-600 mt-3 text-sm sm:text-base max-w-3xl leading-relaxed">
            Acquire production-grade software engineering, cloud architecture, and artificial intelligence competencies with verifiable certification.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-sm mb-10 flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search Box with Clear Button */}
          <div className="relative w-full md:w-96">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by title, topic, or keyword..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-10 py-2.5 bg-slate-50 border border-slate-200/90 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Level Filter Chips */}
          <div className="flex items-center space-x-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider shrink-0 mr-1 flex items-center">
              <SlidersHorizontal className="w-3.5 h-3.5 mr-1 text-slate-400" /> Level:
            </span>
            {[
              { id: '', label: 'All Levels' },
              { id: 'BEGINNER', label: 'Beginner' },
              { id: 'INTERMEDIATE', label: 'Intermediate' },
              { id: 'ADVANCED', label: 'Advanced' },
            ].map((lvl) => (
              <button
                key={lvl.id}
                onClick={() => setSelectedLevel(lvl.id)}
                className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all shrink-0 ${
                  selectedLevel === lvl.id
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                {lvl.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results Metadata */}
        {!loading && (
          <div className="flex items-center justify-between text-xs text-slate-500 mb-6 px-1">
            <span className="font-semibold">
              Showing <span className="text-slate-900 font-bold">{courses.length}</span> programs
              {selectedLevel && <span> in <strong className="text-indigo-600">{selectedLevel}</strong></span>}
              {searchTerm && <span> matching "<strong>{searchTerm}</strong>"</span>}
            </span>
            {(selectedLevel || searchTerm) && (
              <button
                onClick={() => {
                  setSelectedLevel('');
                  setSearchTerm('');
                }}
                className="text-indigo-600 hover:text-indigo-700 font-bold underline"
              >
                Clear all filters
              </button>
            )}
          </div>
        )}

        {/* Course Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-96 rounded-2xl bg-slate-200/70 animate-pulse border border-slate-200"></div>
            ))}
          </div>
        ) : courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200/90 p-12 sm:p-16 text-center max-w-lg mx-auto shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center mx-auto mb-4 border border-indigo-100">
              <BookOpen className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-display font-bold text-slate-900 mb-2">No matching curricula found</h3>
            <p className="text-slate-500 text-sm mb-6 leading-relaxed">
              We couldn't find any courses matching your exact criteria. Try broadening your keyword or clearing level filters.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedLevel('');
              }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition shadow-md shadow-indigo-600/20"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
