"use client";

import { useCallback, useEffect, useState } from "react";
import {
  ApiError,
  createTodo,
  createTodoList,
  deleteTodo,
  deleteTodoList,
  getAllTodoLists,
  getTodoTree,
  searchTodos,
  toggleTodo,
  updateTodo,
} from "@/lib/api";
import { PageResult, TodoListView, TodoView } from "@/types";
import ListSelector from "@/components/ListSelector";
import SearchBar from "@/components/SearchBar";
import TodoTree from "@/components/TodoTree";
import Pagination from "@/components/Pagination";

export default function HomePage() {
  const [lists, setLists] = useState<TodoListView[]>([]);
  const [activeListId, setActiveListId] = useState<string | null>(null);

  const [todos, setTodos] = useState<TodoView[]>([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState<"" | "PENDING" | "COMPLETED">("");

  // ---------- Load danh sách TodoList khi khởi động ----------
  useEffect(() => {
    getAllTodoLists()
      .then((data) => {
        setLists(data);
        if (data.length > 0) setActiveListId(data[0].id);
      })
      .catch((err) => setError(toMessage(err)));
  }, []);

  // ---------- Load cây todo mỗi khi list/trang/filter đổi ----------
  const loadTodos = useCallback(async () => {
    if (!activeListId) return;
    setLoading(true);
    setError(null);
    try {
      const isFiltering = keyword.trim() !== "" || status !== "";
      const result: PageResult<TodoView> = isFiltering
        ? await searchTodos({
            listId: activeListId,
            keyword: keyword.trim() || undefined,
            status,
            page,
            size: pageSize,
          })
        : await getTodoTree({ listId: activeListId, page, size: pageSize });

      setTodos(result.content);
      setTotalPages(result.totalPages);
    } catch (err) {
      setError(toMessage(err));
    } finally {
      setLoading(false);
    }
  }, [activeListId, page, pageSize, keyword, status]);

  useEffect(() => {
    loadTodos();
  }, [loadTodos]);

  // Reset về trang đầu khi đổi list hoặc filter hoặc pageSize
  useEffect(() => {
    setPage(0);
  }, [activeListId, keyword, status, pageSize]);

  // ---------- Handlers ----------

  async function handleCreateList(name: string) {
    try {
      const created = await createTodoList(name);
      setLists((prev) => [...prev, created]);
      setActiveListId(created.id);
    } catch (err) {
      setError(toMessage(err));
    }
  }

  async function handleDeleteList(id: string) {
    if (!confirm("Bạn có chắc chắn muốn xóa danh sách này không?")) return;
    try {
      await deleteTodoList(id);
      const newLists = lists.filter((list) => list.id !== id);
      setLists(newLists);
      if (activeListId === id) {
        setActiveListId(newLists.length > 0 ? newLists[0].id : null);
      }
    } catch (err) {
      setError(toMessage(err));
    }
  }

  async function handleAddRoot(content: string) {
    if (!activeListId) return;
    try {
      await createTodo(activeListId, content, null);
      await loadTodos();
    } catch (err) {
      setError(toMessage(err));
    }
  }

  async function handleAddChild(parentId: string, content: string) {
    if (!activeListId) return;
    try {
      await createTodo(activeListId, content, parentId);
      await loadTodos();
    } catch (err) {
      setError(toMessage(err));
    }
  }

  async function handleToggle(id: string) {
    try {
      await toggleTodo(id);
      await loadTodos();
    } catch (err) {
      setError(toMessage(err));
    }
  }

  async function handleUpdate(id: string, content: string) {
    try {
      await updateTodo(id, content);
      await loadTodos();
    } catch (err) {
      setError(toMessage(err));
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteTodo(id);
      await loadTodos();
    } catch (err) {
      setError(toMessage(err));
    }
  }

  return (
    <main className="mx-auto min-h-screen max-w-2xl px-4 py-8 sm:py-12">
      <header className="mb-6">
        <h1 className="text-xl font-semibold text-slate-900">Công việc</h1>
        <p className="mt-1 text-sm text-slate-500">
          Quản lý việc theo danh sách, thêm việc con lồng nhau không giới hạn cấp.
        </p>
      </header>

      <div className="mb-4">
        <ListSelector
          lists={lists}
          activeListId={activeListId}
          onSelect={setActiveListId}
          onCreate={handleCreateList}
          onDelete={handleDeleteList}
        />
      </div>

      {activeListId ? (
        <>
          <div className="mb-4">
            <SearchBar
              keyword={keyword}
              status={status}
              onKeywordChange={setKeyword}
              onStatusChange={setStatus}
            />
          </div>

          {error && (
            <div className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </div>
          )}

          <TodoTree
            todos={todos}
            listId={activeListId}
            loading={loading}
            onToggle={handleToggle}
            onDelete={handleDelete}
            onUpdate={handleUpdate}
            onAddChild={handleAddChild}
            onAddRoot={handleAddRoot}
          />

          <Pagination
            page={page}
            totalPages={totalPages}
            pageSize={pageSize}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
          />
        </>
      ) : (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white py-16 text-center text-sm text-slate-400">
          Tạo danh sách đầu tiên để bắt đầu.
        </div>
      )}
    </main>
  );
}

function toMessage(err: unknown): string {
  if (err instanceof ApiError) return err.message;
  if (err instanceof Error) return err.message;
  return "Đã có lỗi không xác định";
}
