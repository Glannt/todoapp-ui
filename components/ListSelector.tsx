"use client";

import { useState } from "react";
import { TodoListView } from "@/types";

interface Props {
  lists: TodoListView[];
  activeListId: string | null;
  onSelect: (id: string) => void;
  onCreate: (name: string) => Promise<void>;
}

export default function ListSelector({ lists, activeListId, onSelect, onCreate }: Props) {
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
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap gap-2">
        {lists.map((list) => {
          const isActive = list.id === activeListId;
          return (
            <button
              key={list.id}
              onClick={() => onSelect(list.id)}
              className={[
                "rounded-full px-4 py-1.5 text-sm font-medium transition",
                isActive
                  ? "bg-brand-600 text-white shadow-sm"
                  : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50",
              ].join(" ")}
            >
              {list.name}
            </button>
          );
        })}
      </div>

      <div className="flex gap-2">
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
