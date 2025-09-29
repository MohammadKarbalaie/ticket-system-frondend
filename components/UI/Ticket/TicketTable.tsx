"use client";
import { Ticket } from "@/types/Ticket";
import { Edit2, Trash } from "lucide-react";

interface TicketTableProps {
  tickets: Ticket[];
  categoryBadge: string;
  statusColors: Record<string, string>;
  priorityColors: Record<string, string>;
  onEdit: (ticket: Ticket) => void;
  onDelete: (ticket: Ticket) => void;
  onRowClick?: (ticket: Ticket) => void; // ← اضافه شد
}

export const TicketTable: React.FC<TicketTableProps> = ({
  tickets,
  categoryBadge,
  statusColors,
  priorityColors,
  onEdit,
  onDelete,
  onRowClick,
}) => {
  return (
    <div className="p-4 overflow-x-auto">
      <table className="w-full text-sm text-center border-collapse text-black">
        <thead>
          <tr className="bg-gray-100 text-gray-700">
            <th className="p-2 border border-gray-400">شماره تیکت</th>
            <th className="p-2 border border-gray-400">عنوان</th>
            <th className="p-2 border border-gray-400">دسته‌بندی</th>
            <th className="p-2 border border-gray-400">وضعیت</th>
            <th className="p-2 border border-gray-400">اولویت</th>
            <th className="p-2 border border-gray-400">تاریخ ایجاد</th>
            <th className="p-2 border border-gray-400">آخرین بروزرسانی</th>
            <th className="p-2 border border-gray-400">عملیات</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((t, i) => (
            <tr
              key={i}
              className="hover:bg-gray-50 cursor-pointer"
              onClick={() => onRowClick && onRowClick(t)}
            >
              <td className="p-2 border border-gray-400">{t.ticketNumber}</td>
              <td className="p-2 border border-gray-400">{t.title}</td>
              <td className="p-2 border border-gray-400">
                <span className={categoryBadge}>{t.category.name}</span>
              </td>
              <td className="p-2 border border-gray-400">
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    statusColors[t.status] || "bg-gray-300 text-black"
                  }`}
                >
                  {t.status}
                </span>
              </td>
              <td className="p-2 border border-gray-400">
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    priorityColors[t.priority] || "bg-gray-300 text-black"
                  }`}
                >
                  {t.priority}
                </span>
              </td>
              <td className="p-2 border border-gray-400">
                {t.createdAt
                  ? new Date(t.createdAt).toLocaleDateString("fa-IR")
                  : null}
              </td>
              <td className="p-2 border border-gray-400">
                {t.updatedAt
                  ? new Date(t.updatedAt).toLocaleDateString("fa-IR")
                  : null}
              </td>
              <td className="p-2 border border-gray-400 text-center space-x-2">
                <button
                  className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(t);
                  }}
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  className="p-1 text-red-600 hover:bg-red-100 rounded"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(t);
                  }}
                >
                  <Trash className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
          {tickets.length === 0 && (
            <tr>
              <td colSpan={8} className="p-4 text-center text-gray-500">
                هیچ تیکتی یافت نشد.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
