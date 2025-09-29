"use client";
import { Header } from "@/components/shared/header";
import { Sidebar } from "@/components/shared/sidebar";
import { useState, useEffect } from "react";
import { Category } from "@/types/Category";
import apiClient from "@/services/client";
import { urls } from "@/services/urls";
import { Ticket } from "@/types/Ticket";
import EditTicketModal from "@/components/modals/EditTickets";
import DeleteTicketModal from "@/components/delete/DeleteTicketModal";
import { TicketFilterForm } from "@/components/UI/Ticket/TicketFilterForm";
import { TicketsListSection } from "@/components/UI/Ticket/TicketsListSection";

type FormData = {
  status: string;
  category: string;
};

function TicketsMy() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [allTickets, setAllTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleTicketDeleted = (ticketId: string) => {
    setTickets((prev) => prev.filter((t) => t._id !== ticketId));
    setAllTickets((prev) => prev.filter((t) => t._id !== ticketId));
  };

  const onSubmit = (data: FormData) => {
    let filtered = allTickets;
    if (data.status)
      filtered = filtered.filter((t) => t.status === data.status);
    if (data.category)
      filtered = filtered.filter((t) => t.category._id === data.category);
    setTickets(filtered);
  };

  const handleReset = () => {
    setTickets(allTickets);
  };

  const handleTicketUpdated = (updated: Ticket) => {
    setTickets((prev) =>
      prev.map((t) =>
        t._id === updated._id ? { ...t, ...updated, category: t.category } : t
      )
    );
    setAllTickets((prev) =>
      prev.map((t) =>
        t._id === updated._id ? { ...t, ...updated, category: t.category } : t
      )
    );
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await apiClient.get(urls.categories.getAll);
        setCategories(res.data);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    const fetchTickets = async () => {
      try {
        const res = await apiClient.get(urls.tickets.getMine);
        setTickets(res.data);
        setAllTickets(res.data);
      } catch (err) {
        console.error("Error fetching tickets:", err);
      }
    };
    fetchCategories();
    fetchTickets();
  }, []);

  const categoryBadge = "bg-purple-500 text-white px-2 py-1 rounded text-xs";
  const priorityColors: Record<string, string> = {
    بالا: "bg-red-500 text-white",
    متوسط: "bg-blue-500 text-white",
    پایین: "bg-green-500 text-white",
  };
  const statusColors: Record<string, string> = {
    "در حال بررسی": "bg-blue-500 text-white",
    "حل شده": "bg-green-500 text-white",
    بسته: "bg-red-500 text-white",
    باز: "bg-yellow-500 text-white",
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6">
        <Header />
        <div className="flex flex-col gap-6 text-black px-8 py-10">
          <TicketFilterForm
            categories={categories}
            onFilter={onSubmit}
            onReset={handleReset}
          />

          <TicketsListSection
            title="لیست تیکت‌ها"
            tickets={tickets}
            categoryBadge={categoryBadge}
            statusColors={statusColors}
            priorityColors={priorityColors}
            onEdit={(t) => {
              setSelectedTicket(t);
              setIsModalOpen(true);
            }}
            onDelete={(t) => {
              setSelectedTicket(t);
              setIsDeleteModalOpen(true);
            }}
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
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        ticket={selectedTicket}
        onTicketUpdated={handleTicketUpdated}
      />
    </div>
  );
}

export default TicketsMy;
