"use client";

import { Header } from "@/components/shared/header";
import { Sidebar } from "@/components/shared/sidebar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import apiClient from "@/services/client";
import { urls } from "@/services/urls";
import { Category } from "@/types/Category";
import { Ticket } from "@/types/Ticket";
import { User } from "@/types/User";
import DeleteTicketModal from "@/components/delete/DeleteTicketModal";
import EditTicketModal from "@/components/modals/EditTickets";
import { TicketFilterForm } from "@/components/UI/Ticket/TicketFilterForm";
import { TicketsListSection } from "@/components/UI/Ticket/TicketsListSection";

function TicketsAssigned() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [allTickets, setAllTickets] = useState<Ticket[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [profile, setProfile] = useState<User | null>(null);

  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await apiClient.get(urls.auth.getProfile);
        setProfile(res.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    const fetchCategories = async () => {
      try {
        const res = await apiClient.get(urls.categories.getAll);
        setCategories(res.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    const fetchTickets = async () => {
      try {
        const res = await apiClient.get(urls.tickets.getAll);
        setAllTickets(res.data);
      } catch (error) {
        console.error("Error fetching tickets:", error);
      }
    };

    fetchProfile();
    fetchCategories();
    fetchTickets();
  }, []);

  useEffect(() => {
    if (profile) {
      const filtered = allTickets.filter(
        (t) => t.assignedDepartment === profile.department._id
      );
      setTickets(filtered);
    }
  }, [profile, allTickets]);

  const onFilter = (data: { status: string; category: string }) => {
    if (!profile) return;

    let filtered = allTickets.filter(
      (t) => t.assignedDepartment === profile.department._id
    );

    if (data.status) filtered = filtered.filter((t) => t.status === data.status);
    if (data.category) filtered = filtered.filter((t) => t.category._id === data.category);

    setTickets(filtered);
  };

  const handleReset = () => {
    if (!profile) return;
    const filtered = allTickets.filter(
      (t) => t.assignedDepartment === profile.department._id
    );
    setTickets(filtered);
  };

  const handleTicketDeleted = (ticketId: string) => {
    setTickets((prev) => prev.filter((t) => t._id !== ticketId));
    setAllTickets((prev) => prev.filter((t) => t._id !== ticketId));
  };

  const handleTicketUpdated = (updatedTicket: Ticket) => {
    setTickets((prev) =>
      prev.map((t) => (t._id === updatedTicket._id ? updatedTicket : t))
    );
    setAllTickets((prev) =>
      prev.map((t) => (t._id === updatedTicket._id ? updatedTicket : t))
    );
  };

  const categoryBadge = "bg-purple-500 text-white px-2 py-1 rounded text-xs";
  const priorityColors: Record<string, string> = {
    بالا: "bg-red-500 text-white",
    متوسط: "bg-yellow-500 text-black",
    پایین: "bg-green-500 text-white",
  };
  const statusColors: Record<string, string> = {
    "در حال بررسی": "bg-blue-500 text-white",
    "تایید شده": "bg-green-500 text-white",
    "باز": "bg-gray-500 text-white",
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6">
        <Header />
        <div className="flex flex-col gap-6 text-black px-8 py-10">
          <TicketFilterForm
            categories={categories}
            onFilter={onFilter}
            onReset={handleReset}
          />

          <TicketsListSection
            title="لیست تیکت‌های ثبت شده"
            tickets={tickets}
            categoryBadge={categoryBadge}
            statusColors={statusColors}
            priorityColors={priorityColors}
            onEdit={(t) => {
              setSelectedTicket(t);
              setIsEditModalOpen(true);
            }}
            onDelete={(t) => {
              setSelectedTicket(t);
              setIsDeleteModalOpen(true);
            }}
            onRowClick={(t) => router.push(`/tickets/${t._id}`)}
          />
        </div>
      </div>

      <DeleteTicketModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        ticket={selectedTicket}
        onTicketDeleted={handleTicketDeleted}
      />

      <EditTicketModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        ticket={selectedTicket}
        onTicketUpdated={handleTicketUpdated}
      />
    </div>
  );
}

export default TicketsAssigned;