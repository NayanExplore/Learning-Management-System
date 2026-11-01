import React, { useEffect, useState, useMemo } from 'react';
import { api } from '../api/client';
import { CourseSummary } from '../types';
import { CourseCard } from '../components/CourseCard';
import { Search, X, SlidersHorizontal, BookOpen, ArrowUpDown } from 'lucide-react';
import { CourseCardSkeleton } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/EmptyState';

export const CourseCatalogPage: React.FC = () => {
  const [courses, setCourses] = useState<CourseSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('default');

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const params: any = { size: 100 };
      if (searchTerm.trim()) params.q = searchTerm.trim();
      if (selectedLevel) params.level = selectedLevel;

      const res = await api.get('/v1/courses', { params });
      if (res.data?.success && res.data.data?.content) {
        setCourses(res.data.data.content);
      }
    } catch (err) {
      console.error('Failed to load courses for catalog', err);
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

  // Client-side sorting for responsiveness
  const sortedCourses = useMemo(() => {
    const list = [...courses];
    if (sortBy === 'price-low') {
      return list.sort((a, b) => a.price - b.price);
    }
    if (sortBy === 'price-high') {
      return list.sort((a, b) => b.price - a.price);
    }
    if (sortBy === 'duration') {
      return list.sort((a, b) => (b.durationHours || 0) - (a.durationHours || 0));
    }
    return list;
  }, [courses, sortBy]);

  const levels = [
    { id: '', label: 'All Levels' },
    { id: 'BEGINNER', label: 'Beginner' },
    { id: 'INTERMEDIATE', label: 'Intermediate' },
    { id: 'ADVANCED', label: 'Advanced' },
  ];

  return (
    <div className="flex-1 bg-[#FAFAF8] dark:bg-slate-950 py-10 lg:py-14 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#287C78] dark:text-teal-400">
            Curriculum Catalog
          </p>
          <h1 className="text-2xl sm:text-4xl font-bold text-[#20252B] dark:text-white tracking-tight">
            Explore All Courses
          </h1>
          <p className="text-sm text-[#697386] dark:text-slate-400 max-w-2xl">
            Choose from comprehensive development bootcamps and specialized technical tracks. Every course includes lifetime access and verifiable certification.
          </p>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-[#E5E7EB] dark:border-slate-800 shadow-xs flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by title, technology, or topic..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-9 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-[#E5E7EB] dark:border-slate-700 rounded-lg text-[#20252B] dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#172B4D]/15 dark:focus:ring-teal-500/20 focus:border-[#172B4D] dark:focus:border-teal-500 focus:bg-white dark:focus:bg-slate-800 transition-colors"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Level Filters & Sort */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Level Pills */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
              {levels.map((lvl) => (
                <button
                  key={lvl.id}
                  onClick={() => setSelectedLevel(lvl.id)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                    selectedLevel === lvl.id
                      ? 'bg-[#172B4D] dark:bg-teal-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[#20252B] dark:text-slate-300'
                  }`}
                >
                  {lvl.label}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-xs font-medium bg-white dark:bg-slate-800 border border-[#E5E7EB] dark:border-slate-700 text-[#20252B] dark:text-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#172B4D]/15 dark:focus:ring-teal-500/20 pr-8 cursor-pointer"
              >
                <option value="default">Default Order</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="duration">Longest Duration</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Metadata */}
        {!loading && (
          <div className="flex items-center justify-between text-xs text-[#697386] dark:text-slate-400">
            <span>
              Showing <strong className="text-[#20252B] dark:text-white font-semibold">{sortedCourses.length}</strong>{' '}
              {sortedCourses.length === 1 ? 'course' : 'courses'}
              {selectedLevel && <span> in <strong>{selectedLevel}</strong></span>}
              {searchTerm && <span> matching "<strong>{searchTerm}</strong>"</span>}
            </span>

            {(selectedLevel || searchTerm) && (
              <button
                onClick={() => {
                  setSelectedLevel('');
                  setSearchTerm('');
                }}
                className="text-[#172B4D] dark:text-teal-400 font-medium hover:underline"
              >
                Clear all filters
              </button>
            )}
          </div>
        )}

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <CourseCardSkeleton key={i} />
            ))}
          </div>
        ) : sortedCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<BookOpen className="w-6 h-6" />}
            title="No matching courses found"
            description="We couldn't find any courses matching your selected search or filter criteria. Try clearing the filters or searching for another term."
            actionLabel="Reset Filters"
            onAction={() => {
              setSearchTerm('');
              setSelectedLevel('');
            }}
          />
        )}
      </div>
    </div>
  );
};
