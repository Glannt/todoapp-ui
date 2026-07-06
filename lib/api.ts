import {
  ApiErrorBody,
  PageResult,
  TodoListView,
  TodoView,
} from "@/types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080/api";

/** Ném lỗi có message rõ ràng lấy từ body lỗi của BE (GlobalExceptionHandler). */
class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
    ...options,
  });

  if (!res.ok) {
    let message = `Yêu cầu thất bại (${res.status})`;
    try {
      const body: ApiErrorBody = await res.json();
      message = body.message ?? message;
    } catch {
      // body không phải JSON hợp lệ -> giữ message mặc định
    }
    throw new ApiError(res.status, message);
  }

  if (res.status === 204) {
    return undefined as T;
  }
  return res.json() as Promise<T>;
}

// ---------- TodoList ----------

export function getAllTodoLists(): Promise<TodoListView[]> {
  return request<TodoListView[]>("/todo-lists");
}

export function createTodoList(name: string, description?: string): Promise<TodoListView> {
  return request<TodoListView>("/todo-lists", {
    method: "POST",
    body: JSON.stringify({ name, description }),
  });
}

export function updateTodoList(
  id: string,
  name: string,
  description?: string
): Promise<TodoListView> {
  return request<TodoListView>(`/todo-lists/${id}`, {
    method: "PUT",
    body: JSON.stringify({ name, description }),
  });
}

export function deleteTodoList(id: string): Promise<void> {
  return request<void>(`/todo-lists/${id}`, { method: "DELETE" });
}

// ---------- Todo ----------

export interface FetchTodosParams {
  listId: string;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: "ASC" | "DESC";
}

export function getTodoTree(params: FetchTodosParams): Promise<PageResult<TodoView>> {
  const query = buildQuery(params);
  return request<PageResult<TodoView>>(`/todos?${query}`);
}

export interface SearchTodosParams extends FetchTodosParams {
  keyword?: string;
  status?: "PENDING" | "COMPLETED" | "";
}

export function searchTodos(params: SearchTodosParams): Promise<PageResult<TodoView>> {
  const query = buildQuery(params);
  return request<PageResult<TodoView>>(`/todos/search?${query}`);
}

export function createTodo(
  listId: string,
  content: string,
  parentId?: string | null
): Promise<TodoView> {
  return request<TodoView>("/todos", {
    method: "POST",
    body: JSON.stringify({ listId, content, parentId: parentId ?? null }),
  });
}

export function updateTodo(id: string, content: string): Promise<TodoView> {
  return request<TodoView>(`/todos/${id}`, {
    method: "PUT",
    body: JSON.stringify({ content }),
  });
}

export function deleteTodo(id: string): Promise<void> {
  return request<void>(`/todos/${id}`, { method: "DELETE" });
}

export function toggleTodo(id: string): Promise<TodoView> {
  return request<TodoView>(`/todos/${id}/toggle`, { method: "PATCH" });
}

export function moveTodo(id: string, newParentId: string | null): Promise<TodoView> {
  return request<TodoView>(`/todos/${id}/move`, {
    method: "PATCH",
    body: JSON.stringify({ newParentId }),
  });
}

// ---------- Helper ----------

function buildQuery(params: Record<string, unknown>): string {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      search.set(key, String(value));
    }
  });
  return search.toString();
}

export { ApiError };
