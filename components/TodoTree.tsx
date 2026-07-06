"use client";

import { useState } from "react";
import { TodoView } from "@/types";
import TodoItem from "./TodoItem";

interface Props {
  todos: TodoView[];
  listId: string;
  loading: boolean;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, content: string) => void;
  onAddChild: (parentId: string, content: string) => void;
  onAddRoot: (content: string) => void;
}

export default function TodoTree({
  todos,
  loading,
  onToggle,
  onDelete,
  onUpdate,
  onAddChild,
  onAddRoot,
}: Props) {
  const [newRoot, setNewRoot] = useState("");

  function submitRoot() {
    const trimmed = newRoot.trim();
    if (!trimmed) return;
    onAddRoot(trimmed);
    setNewRoot("");
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex gap-2">
        <input
          value={newRoot}
          onChange={(e) => setNewRoot(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submitRoot()}
          placeholder="Thêm công việc mới..."
          className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
        />
        <button
          onClick={submitRoot}
          className="rounded-lg bg-brand-600 px-4 text-sm font-medium text-white transition hover:bg-brand-700"
        >
          Thêm
        </button>
      </div>

      {loading ? (
        <div className="py-10 text-center text-sm text-slate-400">Đang tải...</div>
      ) : todos.length === 0 ? (
        <div className="py-10 text-center text-sm text-slate-400">
          Chưa có công việc nào. Thêm việc đầu tiên ở trên.
        </div>
      ) : (
        <div className="flex flex-col">
          {todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              depth={0}
              onToggle={onToggle}
              onDelete={onDelete}
              onUpdate={onUpdate}
              onAddChild={onAddChild}
            />
          ))}
        </div>
      )}
    </div>
  );
}
