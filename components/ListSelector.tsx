"use client";

import { useState } from "react";
import { TodoListView } from "@/types";

interface Props {
  lists: TodoListView[];
  activeListId: string | null;
  onSelect: (id: string) => void;
  onCreate: (name: string) => Promise<void>;
  onDelete: (id: string) => void;
}

export default function ListSelector({ lists, activeListId, onSelect, onCreate, onDelete }: Props) {
  const [newName, setNewName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleCreate() {
    const trimmed = newName.trim();
    if (!trimmed || submitting) return;
    setSubmitting(true);
    try {
      await onCreate(trimmed);
      setNewName("");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between w-full overflow-hidden">
      <div className="flex flex-1 flex-row items-center gap-2 overflow-x-auto pb-2 scrollbar-thin max-w-full">
        {lists.map((list) => {
          const isActive = list.id === activeListId;
          return (
            <div
              key={list.id}
              onClick={() => onSelect(list.id)}
              className={[
                "flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition cursor-pointer select-none whitespace-nowrap",
                isActive
                  ? "bg-brand-600 text-white shadow-sm"
                  : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50",
              ].join(" ")}
            >
              <span>{list.name}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(list.id);
                }}
                title="Xóa danh sách"
                aria-label="Xóa danh sách"
                className={[
                  "flex h-4 w-4 items-center justify-center rounded-full transition-colors",
                  isActive
                    ? "text-brand-200 hover:bg-brand-700 hover:text-white"
                    : "text-slate-400 hover:bg-slate-100 hover:text-slate-600",
                ].join(" ")}
              >
                <svg viewBox="0 0 12 12" className="h-2.5 w-2.5" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M2.5 2.5L9.5 9.5M9.5 2.5L2.5 9.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          );
        })}
      </div>

      <div className="flex gap-2 shrink-0">
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleCreate()}
          placeholder="Danh sách mới..."
          className="w-40 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 sm:w-48"
        />
        <button
          onClick={handleCreate}
          disabled={submitting || !newName.trim()}
          className="whitespace-nowrap rounded-lg bg-slate-800 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-slate-700 disabled:opacity-40"
        >
          + Tạo
        </button>
      </div>
    </div>
  );
}
