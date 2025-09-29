"use client";
import Link from "next/link";
import { ArrowLeft, Ticket, ListChecks, User } from "lucide-react";

export const QuickMenu = () => {
  return (
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
            <ListChecks className="w-4 h-4 text-yellow-500" /> تیکت‌های محلول شده
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
  );
};
