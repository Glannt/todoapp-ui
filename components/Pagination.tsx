"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  page: number;
  totalPages: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

export default function Pagination({
  page,
  totalPages,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const options = [5, 10, 20, 50];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (totalPages === 0) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 border-t border-slate-100 mt-6">
      {/* Custom Page Size Selector */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-600 transition hover:bg-slate-50 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-500/20"
        >
          <span>
            Hiển thị: <span className="font-semibold text-slate-800">{pageSize}</span> / trang
          </span>
          <svg
            className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isOpen && (
          <div className="absolute bottom-full mb-1.5 left-0 z-50 w-32 rounded-lg border border-slate-150 bg-white py-1 shadow-lg ring-1 ring-black/5 animate-in fade-in slide-in-from-bottom-2 duration-150">
            {options.map((opt) => (
              <button
                key={opt}
                onClick={() => {
                  onPageSizeChange(opt);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm transition-colors hover:bg-slate-50 ${
                  pageSize === opt
                    ? "font-semibold text-indigo-600 bg-indigo-50/40"
                    : "text-slate-700"
                }`}
              >
                {opt} / trang
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      {totalPages > 1 && (
        <div className="flex items-center gap-3">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page === 0}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-600 transition hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white"
          >
            ‹ Trước
          </button>
          <span className="text-sm text-slate-500">
            Trang <span className="font-medium text-slate-700">{page + 1}</span> / {totalPages}
          </span>
          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page + 1 >= totalPages}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-600 transition hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white"
          >
            Sau ›
          </button>
        </div>
      )}
    </div>
  );
}

