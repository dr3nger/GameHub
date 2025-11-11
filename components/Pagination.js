"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';

export default function Pagination({ currentPage, totalPages, t, lang }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isRTL = lang === 'ar';

  if (totalPages <= 1) return null;

  const onPageChange = (page) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    router.push(`?${params.toString()}`);
  };

  // ... (نفس دالة getPageNumbers من الملف القديم) ...
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    const delta = 2;
    if (totalPages <= maxPagesToShow + 2) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      if (currentPage > delta + 2) {
        pages.push('...');
      }
      let start = Math.max(2, currentPage - delta);
      let end = Math.min(totalPages - 1, currentPage + delta);
      if (currentPage <= delta + 1) {
        end = 1 + maxPagesToShow - 1;
      }
      if (currentPage >= totalPages - delta) {
        start = totalPages - maxPagesToShow + 2;
      }
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      if (currentPage < totalPages - delta - 1) {
        pages.push('...');
      }
      pages.push(totalPages);
    }
    return pages;
  };
  
  const pageNumbers = getPageNumbers();

  return (
    <nav className="flex items-center justify-center gap-1 flex-wrap mt-8">
      <span className="text-gray-400 bg-gray-800/50 rounded-lg px-4 py-2 text-sm font-semibold">
        {t.page} {currentPage} {t.of} {totalPages}
      </span>

      <button
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        title={t.first}
        className="px-3 py-2 bg-gray-800/50 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-600"
      >
        <ChevronsLeft className="w-5 h-5" />
      </button>

      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        title={t.back}
        className="px-3 py-2 bg-gray-800/50 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-600"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {pageNumbers.map((num, index) =>
        num === '...' ? (
          <span key={`ellipsis-${index}`} className="px-2 py-2 text-gray-400">
            ...
          </span>
        ) : (
          <button
            key={num}
            onClick={() => onPageChange(num)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold ${
              currentPage === num
                ? 'bg-purple-600 text-white'
                : 'bg-gray-800/50 text-white hover:bg-purple-600'
            }`}
          >
            {num}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        title="Next" // (تحتاج إضافة "Next" للترجمة)
        className="px-3 py-2 bg-gray-800/50 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-600"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      <button
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        title={t.last}
        className="px-3 py-2 bg-gray-800/50 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-600"
      >
        <ChevronsRight className="w-5 h-5" />
      </button>
    </nav>
  );
}