"use client";
import Link from "next/link";
import { Tickets } from "@/types/Ticket";

interface RecentTicketsProps {
  tickets: Tickets[];
}

export const RecentTickets: React.FC<RecentTicketsProps> = ({ tickets }) => {
  return (
    <div className="col-span-2 bg-white rounded-md shadow text-black">
      <div className="flex justify-between items-center bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold p-3 rounded-t-md">
        <span>تیکت‌های اخیر</span>
        <Link
          href="/tickets"
          className="bg-white text-purple-600 px-3 py-1 rounded text-sm"
        >
          مشاهده همه
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-right">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="p-3">شماره تیکت</th>
              <th className="p-3">عنوان</th>
              <th className="p-3">وضعیت</th>
              <th className="p-3">اولویت</th>
              <th className="p-3">تاریخ</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((t) => (
              <tr key={t._id} className="border-b hover:bg-gray-50">
                <td className="p-3 text-blue-500">{t.ticketNumber}</td>
                <td className="p-3">{t.title}</td>
                <td className="p-3">
                  <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs">
                    {t.status}
                  </span>
                </td>
                <td className="p-3">
                  <span className="bg-yellow-200 text-yellow-700 px-2 py-1 rounded-full text-xs">
                    {t.priority}
                  </span>
                </td>
                <td className="p-3">
                  {new Date(t.createdAt).toLocaleDateString("fa-IR")}
                </td>
              </tr>
            ))}
            {tickets.length === 0 && (
              <tr>
                <td colSpan={5} className="p-4 text-center text-gray-500">
                  هیچ تیکتی وجود ندارد
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
