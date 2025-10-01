"use client";
import { Header } from "@/components/shared/header";
import { Sidebar } from "@/components/shared/sidebar";
import { Ticket, TicketCheck, TicketMinus, TicketPercent } from "lucide-react";
import { useState, useEffect } from "react";
import { Tickets } from "@/types/Ticket";
import { urls } from "@/services/urls";
import apiClient from "@/services/client";
import { DashboardCard } from "@/components/UI/Dashboard/DashboardCard";
import { QuickMenu } from "@/components/UI/Dashboard/QuickMenu";
import { CategoryStats } from "@/components/UI/Dashboard/CategoryStats";
import { RecentTickets } from "@/components/UI/Dashboard/RecentTickets";

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
  const categoryStats = tickets.reduce(
    (acc: Record<string, number>, ticket) => {
      const cat = ticket.category || "نامشخص";
      acc[cat.name] = (acc[cat.name] || 0) + 1;
      return acc;
    },
    {}
  );

  return (
<div className="flex" dir="rtl">
  <Sidebar />
  <div className="flex-1 p-6">
    <Header />

    {/* کارت‌ها */}
    <div className="dashboard-cards">
      <DashboardCard
        icon={Ticket}
        iconBg="bg-sky-500"
        value={alltotalTickets}
        label="کل تیکت‌ها"
      />
      <DashboardCard
        icon={TicketCheck}
        iconBg="bg-yellow-500"
        value={allopenTickets}
        label="تیکت‌های باز"
      />
      <DashboardCard
        icon={TicketMinus}
        iconBg="bg-green-500"
        value={allclosedTickets}
        label="تیکت‌های بسته"
      />
      <DashboardCard
        icon={TicketPercent}
        iconBg="bg-blue-500"
        value={`${resolutionRate}%`}
        label="نرخ حل"
      />
    </div>

    {/* بخش پایین */}
    <div className="dashboard-bottom">
      <div className="flex flex-col gap-6">
        <QuickMenu />
        <CategoryStats stats={categoryStats} />
      </div>
      <RecentTickets tickets={recentTickets} />
    </div>
  </div>
</div>

  );
}

export default DashboardPage;
