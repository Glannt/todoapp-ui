export type TodoStatus = "PENDING" | "COMPLETED";

export interface TodoView {
  id: string;
  content: string;
  status: TodoStatus;
  parentId: string | null;
  listId: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  children: TodoView[];
}

export interface TodoListView {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PageResult<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface ApiErrorBody {
  timestamp: string;
  status: number;
  error: string;
  message: string;
}
