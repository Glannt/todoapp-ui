"use client";

import { useState } from "react";
import { TodoView } from "@/types";

interface Props {
  todo: TodoView;
  depth: number;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, content: string) => void;
  onAddChild: (parentId: string, content: string) => void;
}

export default function TodoItem({
  todo,
  depth,
  onToggle,
  onDelete,
  onUpdate,
  onAddChild,
}: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(todo.content);
  const [isAddingChild, setIsAddingChild] = useState(false);
  const [childValue, setChildValue] = useState("");
  const isDone = todo.status === "COMPLETED";

  function submitEdit() {
    const trimmed = editValue.trim();
    if (trimmed && trimmed !== todo.content) {
      onUpdate(todo.id, trimmed);
    }
    setIsEditing(false);
  }

  function submitChild() {
    const trimmed = childValue.trim();
    if (trimmed) {
      onAddChild(todo.id, trimmed);
      setChildValue("");
      setIsAddingChild(false);
    }
  }

  return (
    <div className={depth > 0 ? "thread-line pl-4" : ""}>
      <div className="group flex items-start gap-2 rounded-lg px-2 py-1.5 hover:bg-slate-50">
        <button
          onClick={() => onToggle(todo.id)}
          aria-label={isDone ? "Đánh dấu chưa hoàn thành" : "Đánh dấu hoàn thành"}
          className={[
            "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition",
            isDone
              ? "border-emerald-500 bg-emerald-500 text-white"
              : "border-slate-300 hover:border-brand-500",
          ].join(" ")}
        >
          {isDone && (
            <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none">
              <path
                d="M2 6L4.5 8.5L10 3"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </button>

        {isEditing ? (
          <input
            autoFocus
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={submitEdit}
            onKeyDown={(e) => {
              if (e.key === "Enter") submitEdit();
              if (e.key === "Escape") {
                setEditValue(todo.content);
                setIsEditing(false);
              }
            }}
            className="flex-1 rounded border border-brand-300 px-2 py-0.5 text-sm outline-none"
          />
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className={[
              "flex-1 text-left text-sm leading-6",
              isDone ? "text-slate-400 line-through" : "text-slate-700",
            ].join(" ")}
          >
            {todo.content}
          </button>
        )}

        <div className="flex shrink-0 gap-1 opacity-0 transition group-hover:opacity-100">
          <button
            onClick={() => setIsAddingChild((v) => !v)}
            title="Thêm công việc con"
            className="rounded px-1.5 py-0.5 text-xs text-slate-500 hover:bg-slate-100 hover:text-brand-600"
          >
            + Con
          </button>
          <button
            onClick={() => onDelete(todo.id)}
            title="Xóa"
            className="rounded px-1.5 py-0.5 text-xs text-slate-500 hover:bg-red-50 hover:text-red-600"
          >
            Xóa
          </button>
        </div>
      </div>

      {isAddingChild && (
        <div className={depth >= 0 ? "thread-line ml-2 pl-4" : ""}>
          <div className="flex gap-2 py-1">
            <input
              autoFocus
              value={childValue}
              onChange={(e) => setChildValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") submitChild();
                if (e.key === "Escape") setIsAddingChild(false);
              }}
              placeholder="Nội dung công việc con..."
              className="flex-1 rounded border border-slate-200 px-2 py-1 text-sm outline-none focus:border-brand-500"
            />
            <button
              onClick={submitChild}
              className="rounded bg-brand-600 px-3 text-sm text-white hover:bg-brand-700"
            >
              Thêm
            </button>
          </div>
        </div>
      )}

      {todo.children.length > 0 && (
        <div className={depth >= 0 ? "ml-2" : ""}>
          {todo.children.map((child) => (
            <TodoItem
              key={child.id}
              todo={child}
              depth={depth + 1}
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
