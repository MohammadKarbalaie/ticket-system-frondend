"use client";

import { usePathname } from "next/navigation";
import { LayoutDashboard, Ticket, Users, Settings, UserCircle, LogOut } from "lucide-react";

type PageConfig = {
  title: string;
  icon: React.ElementType;
};

// دیکشنری مسیرها → عنوان و آیکون
const pageMap: Record<string, PageConfig> = {
  "/dashboard": { title: "داشبورد", icon: LayoutDashboard },
  "/tickets/my": { title: "تیکت‌های من", icon: Ticket },
  "/tickets/new": { title: "ایجاد تیکت جدید", icon: Ticket },
  "/tickets/all": { title: "تمام تیکت‌ها", icon: Ticket },
  "/tickets/assigned": { title: " تیکت های محصول شده به من", icon: Ticket },
  "/users": { title: "مدیریت کاربران", icon: Users },
  "/settings": { title: "تنظیمات سیستم", icon: Settings },
  "/profile": { title: "پروفایل", icon: UserCircle },
  "/logout": { title: "خروج", icon: LogOut },
};

export function Header() {
  const pathname = usePathname();

  // مقادیر پیش‌فرض اگه مسیر توی دیکشنری نبود
  const config = pageMap[pathname] || { title: "سیستم تیکت", icon: LayoutDashboard };
  const Icon = config.icon;

  return (
    <div className="flex items-center gap-2 text-2xl font-bold text-[#6f5fc0] border-b border-gray-300 pb-2 mb-4">
      <Icon className="w-6 h-6" />
      <span>{config.title}</span>
    </div>
  );
}
