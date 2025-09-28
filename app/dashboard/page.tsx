"use client";
import { Header } from "@/components/shared/header";
import { Sidebar } from "@/components/shared/sidebar";
import {
  Ticket,
  TicketCheck,
  TicketMinus,
  TicketPercent,
  ListChecks,
  User,
  ArrowLeft,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Tickets } from "@/types/Ticket";
import { urls } from "@/services/urls";
import apiClient from "@/services/client";
import Link from "next/link";

function DashboardPage() {
  const [tickets, setTickets] = useState<Tickets[]>([]);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await apiClient.get(urls.tickets.getAll);
        setTickets(res.data);
      } catch (error) {
        console.error("Error fetching tickets:", error);
      }
    };
    fetchTickets();
  }, []);

  const alltotalTickets = tickets.length;
  const allopenTickets = tickets.filter((t) => t.status === "باز").length;
  const allclosedTickets = tickets.filter((t) => t.status === "بسته").length;

  // نرخ حل
  const resolutionRate =
    alltotalTickets > 0
      ? Math.round((allclosedTickets / alltotalTickets) * 100)
      : 0;

  // ۵ تیکت اخیر
  const recentTickets = [...tickets]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 5);

  // آمار دسته‌بندی
  const categoryStats = tickets.reduce((acc: Record<string, number>, ticket) => {
    const cat = ticket.category || "نامشخص";
    acc[cat.name] = (acc[cat.name] || 0) + 1;
    return acc;
  }, {});

  // رنگ دسته‌بندی‌ها
  const categoryColors: Record<string, string> = {
    فنی: "text-sky-600",
    اداری: "text-purple-600",
    درخواست: "text-green-600",
    پشتیبانی: "text-yellow-600",
    نامشخص: "text-gray-500",
  };

  return (
    <div className="flex" dir="rtl">
      <Sidebar />
      <div className="flex-1 p-6">
        <Header />

        {/* کارت‌های بالای داشبورد */}
        <div className="grid grid-cols-4 gap-6 py-4">
          <div className="bg-white rounded-md flex flex-col items-center justify-center py-8 text-black">
            <div className="bg-sky-500 p-6 rounded-full flex items-center justify-center">
              <Ticket className="w-8 h-8 text-white" />
            </div>
            <p className="mt-4 font-bold text-2xl">{alltotalTickets}</p>
            <p className="mt-2 text-lg">کل تیکت‌ها</p>
          </div>

          <div className="bg-white rounded-md flex flex-col items-center justify-center py-8 text-black">
            <div className="bg-yellow-500 p-6 rounded-full flex items-center justify-center">
              <TicketCheck className="w-8 h-8 text-white" />
            </div>
            <p className="mt-4 font-bold text-2xl">{allopenTickets}</p>
            <p className="mt-2 text-lg">تیکت‌های باز</p>
          </div>

          <div className="bg-white rounded-md flex flex-col items-center justify-center py-8 text-black">
            <div className="bg-green-500 p-6 rounded-full flex items-center justify-center">
              <TicketMinus className="w-8 h-8 text-white" />
            </div>
            <p className="mt-4 font-bold text-2xl">{allclosedTickets}</p>
            <p className="mt-2 text-lg">تیکت‌های بسته</p>
          </div>

          <div className="bg-white rounded-md flex flex-col items-center justify-center py-8 text-black">
            <div className="bg-blue-500 p-6 rounded-full flex items-center justify-center">
              <TicketPercent className="w-8 h-8 text-white" />
            </div>
            <p className="mt-4 font-bold text-2xl">{resolutionRate}%</p>
            <p className="mt-2 text-lg">نرخ حل</p>
          </div>
        </div>

        {/* بخش پایین (منو و جدول) */}
        <div className="grid grid-cols-3 gap-6 mt-6">
          {/* منوی سریع + آمار دسته‌بندی */}
          <div className="flex flex-col gap-6">
            {/* منوی سریع */}
            <div className="bg-white rounded-md shadow text-black">
              <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold p-3 rounded-t-md">
                منوی سریع
              </div>
              <div className="flex flex-col">
                <Link
                  href="/tickets/new"
                  className="flex items-center justify-between p-3 border-b hover:bg-gray-50"
                >
                  <span>ایجاد تیکت جدید</span>
                  <ArrowLeft className="w-4 h-4 text-gray-500" />
                </Link>

                <Link
                  href="/tickets/my"
                  className="flex items-center justify-between p-3 border-b hover:bg-gray-50"
                >
                  <span className="flex items-center gap-2">
                    <Ticket className="w-4 h-4 text-sky-500" /> تیکت‌های من
                  </span>
                </Link>

                <Link
                  href="/tickets/assigned"
                  className="flex items-center justify-between p-3 border-b hover:bg-gray-50"
                >
                  <span className="flex items-center gap-2">
                    <ListChecks className="w-4 h-4 text-yellow-500" /> تیکت‌های
                    محلول شده
                  </span>
                </Link>

                <Link
                  href="/profile"
                  className="flex items-center justify-between p-3 hover:bg-gray-50"
                >
                  <span className="flex items-center gap-2">
                    <User className="w-4 h-4 text-purple-500" /> پروفایل
                  </span>
                </Link>
              </div>
            </div>

            {/* آمار دسته‌بندی */}
            <div className="bg-white rounded-md shadow text-black">
              <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold p-3 rounded-t-md">
                آمار دسته‌بندی
              </div>
              <div className="p-4 text-sm">
                <ul className="space-y-2">
                  {Object.entries(categoryStats).map(([cat, count]) => (
                    <li key={cat} className="flex justify-between">
                      <span className={categoryColors[cat] || "text-gray-600"}>
                        {cat}
                      </span>
                      <span className="font-bold">{count} تیکت</span>
                    </li>
                  ))}
                  {Object.keys(categoryStats).length === 0 && (
                    <li className="text-gray-500 text-center">
                      دسته‌بندی وجود ندارد
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>

          {/* جدول تیکت‌ها */}
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
                  {recentTickets.map((t) => (
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
                  {recentTickets.length === 0 && (
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
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
