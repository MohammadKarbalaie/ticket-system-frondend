"use client";
import { Header } from "@/components/shared/header";
import { Sidebar } from "@/components/shared/sidebar";
import apiClient from "@/services/client";
import { urls } from "@/services/urls";
import { Category } from "@/types/Category";
import { Tickets, Ticket } from "@/types/Ticket";
import { Edit2, Funnel, List, RotateCw, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import DeleteTicketModal from "@/components/delete/DeleteTicketModal";
import EditTicketModal from "@/components/modals/EditTickets";
import { TicketFilterForm } from "@/components/UI/Ticket/TicketFilterForm";
import { TicketsListSection } from "@/components/UI/Ticket/TicketsListSection";

type FormData = {
  status: string;
  category: string;
};

function TicketsAll() {
  const { register, handleSubmit, reset } = useForm<FormData>();
  const [categories, setCategories] = useState<Category[]>([]);
  const [allTickets, setAllTickets] = useState<Tickets[]>([]);
  const [tickets, setTickets] = useState<Tickets[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  // کنترل مودال‌ها
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const router = useRouter();

  useEffect(() => {
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
        setTickets(res.data);
      } catch (error) {
        console.error("Error fetching tickets:", error);
      }
    };

    fetchTickets();
    fetchCategories();
  }, []);

  const onSubmit = (data: FormData) => {
    let filtered = allTickets;
    if (data.status)
      filtered = filtered.filter((t) => t.status === data.status);
    if (data.category)
      filtered = filtered.filter((t) => t.category._id === data.category);
    setTickets(filtered);
  };

  const handleReset = () => {
    reset();
    setTickets(allTickets);
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
    باز: "bg-gray-500 text-white",
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
            title="لیست تمام تیکت‌ها"
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

      {/* مودال حذف */}
      <DeleteTicketModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        ticket={selectedTicket}
        onTicketDeleted={handleTicketDeleted}
      />

      {/* مودال ویرایش */}
      <EditTicketModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        ticket={selectedTicket}
        onTicketUpdated={handleTicketUpdated}
      />
    </div>
  );
}

export default TicketsAll;
