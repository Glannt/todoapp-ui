"use client";

interface Props {
  keyword: string;
  status: "" | "PENDING" | "COMPLETED";
  onKeywordChange: (v: string) => void;
  onStatusChange: (v: "" | "PENDING" | "COMPLETED") => void;
}

export default function SearchBar({
  keyword,
  status,
  onKeywordChange,
  onStatusChange,
}: Props) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row">
      <input
        value={keyword}
        onChange={(e) => onKeywordChange(e.target.value)}
        placeholder="Tìm công việc..."
        className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
      />
      <select
        value={status}
        onChange={(e) => onStatusChange(e.target.value as "" | "PENDING" | "COMPLETED")}
        className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
      >
        <option value="">Tất cả trạng thái</option>
        <option value="PENDING">Chưa hoàn thành</option>
        <option value="COMPLETED">Hoàn thành</option>
      </select>
    </div>
  );
}
