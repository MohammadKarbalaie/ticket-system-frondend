"use client";
import Link from "next/link";
import { UserCircle, LayoutDashboard, Ticket, PlusCircle, Users, Settings, LogOut, Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { removeTokens, fetchUserProfile } from "@/utils/token";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import apiClient from "@/services/client";
import { urls } from "@/services/urls";

type MenuItem = { label: string; href?: string; icon: React.ElementType; action?: () => void; roles?: string[]; };

export function Sidebar() {
  const [profile, setProfile] = useState<{ fname: string; lname: string; role: string } | null>(null);
  const [isOpen, setIsOpen] = useState(false); // حالت موبایل
  const router = useRouter();

  useEffect(() => {
    const loadProfile = async () => {
      const user = await fetchUserProfile();
      if (user) setProfile(user);
    };
    loadProfile();
  }, []);

  const handleLogout = async () => {
    try {
      await apiClient.post(urls.auth.signOut);
      removeTokens();
      toast.success("خروج با موفقیت انجام شد");
      router.push("/");
    } catch (error) {
      removeTokens();
      toast.error("خطا در خروج از سیستم");
      router.push("/");
    }
  };

  const menuItems: MenuItem[] = [
    { label: "داشبورد", href: "/dashboard", icon: LayoutDashboard },
    { label: "تیکت های من", href: "/tickets/my", icon: Ticket },
    { label: "ایجاد تیکت جدید", href: "/tickets/new", icon: PlusCircle },
    { label: "تمام تیکت ها", href: "/tickets/all", icon: Ticket, roles: ["ادمین"] },
    { label: "تیکت های محول شده", href: "/tickets/assigned", icon: Ticket },
    { label: "مدیریت کاربران", href: "/users", icon: Users, roles: ["ادمین"] },
    { label: "تنظیمات", href: "/settings", icon: Settings, roles: ["ادمین"] },
    { label: "پروفایل", href: "/profile", icon: UserCircle },
    { label: "خروج", icon: LogOut, action: handleLogout },
  ];

  return (
    <>
      {/* دکمه همبرگر موبایل */}
      <button className="sidebar-toggle" onClick={() => setIsOpen(!isOpen)}>
        <Menu className="w-6 h-6" />
      </button>

      {/* سایدبار */}
      <aside   className={`sidebar flex flex-col ${isOpen ? "sidebar-open md:translate-x-0 md:static" : "sidebar-closed md:translate-x-0 md:static"}`}>
        <div className="p-4 text-2xl font-extrabold text-center border-b border-white/20">
          سیستم اتوماسیون اداری
        </div>

        <div className="flex flex-col items-center py-6 border-b border-white/20">
          <UserCircle className="w-40 h-40 text-white bg-white/10 rounded-full p-4" />
          <h2 className="mt-3 text-lg font-semibold">
            {profile ? `${profile.fname} ${profile.lname}` : "در حال بارگذاری..."}
          </h2>
          <p className="text-sm text-white/70">{profile ? profile.role : "—"}</p>
        </div>

        <nav className="flex-1">
          <ul className="flex flex-col gap-1 p-2">
            {menuItems
              .filter(item => !item.roles || (profile && item.roles.includes(profile.role)))
              .map(({ label, href, icon: Icon, action }) => (
                <li key={label} className="cursor-pointer">
                  {href ? (
                    <Link
                      href={href}
                      className="flex items-center gap-3 rounded-lg px-4 py-2 hover:bg-white/20 transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{label}</span>
                    </Link>
                  ) : (
                    <button
                      onClick={() => { action?.(); setIsOpen(false); }}
                      className="w-full text-left flex items-center gap-3 rounded-lg px-4 py-2 hover:bg-white/20 transition-colors"
                    >
                      <Icon className="w-5 h-5" />
                      <span>{label}</span>
                    </button>
                  )}
                </li>
              ))}
          </ul>
        </nav>
      </aside>
    </>
  );
}
