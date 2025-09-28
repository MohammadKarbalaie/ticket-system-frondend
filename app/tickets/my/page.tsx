"use client";
import { Header } from "@/components/shared/header";
import { Sidebar } from "@/components/shared/sidebar";
import { Edit2, Funnel, List, RotateCw, Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { Category } from "@/types/Category";
import apiClient from "@/services/client";
import { urls } from "@/services/urls";
import { Ticket } from "@/types/Ticket";
import EditTicketModal from "@/components/modals/EditTickets";
import DeleteTicketModal from "@/components/delete/DeleteTicketModal";

type FormData = {
  status: string;
  category: string;
};

function TicketsMy() {
  const { register, handleSubmit, reset } = useForm<FormData>();
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
    reset();
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
          <form
            className="flex flex-wrap items-end gap-6 bg-white p-6 rounded-lg shadow-md border border-gray-200"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="w-1/3 min-w-[200px]">
              <label className="block text-sm font-medium mb-1">وضعیت</label>
              <select
                {...register("status")}
                className="w-full p-2 border border-gray-400 rounded text-black"
              >
                <option value="">همه وضعیت‌ها</option>
                <option value="در حال بررسی">در حال بررسی</option>
                <option value="بسته">بسته</option>
                <option value="حل شده">حل شده</option>
                <option value="باز">باز</option>
              </select>
            </div>

            <div className="w-1/3 min-w-[200px]">
              <label className="block text-sm font-medium mb-1">
                دسته‌بندی
              </label>
              <select
                {...register("category")}
                className="w-full border border-gray-300 text-black rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">همه دسته‌بندی‌ها</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-3 w-full sm:w-auto">
              <button
                type="submit"
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-4 py-2 rounded hover:opacity-90"
              >
                <Funnel className="w-4 h-4" />
                فیلتر
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="flex items-center justify-center gap-2 bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
              >
                <RotateCw className="w-4 h-4" />
                پاک کردن
              </button>
            </div>
          </form>

          <div className="col-span-2 border border-gray-400 rounded-lg overflow-hidden bg-white shadow">
            <div className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-4 py-3 font-semibold flex items-center gap-2">
              <List className="w-5 h-5" />
              لیست تیکت‌ها
            </div>
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
                    <th className="p-2 border border-gray-400">
                      آخرین بروزرسانی
                    </th>
                    <th className="p-2 border border-gray-400">عملیات</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.map((t, i) => (
                    <tr key={i} className="hover:bg-gray-50 cursor-pointer">
                      <td className="p-2 border border-gray-400">
                        {t.ticketNumber}
                      </td>
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
                            priorityColors[t.priority] ||
                            "bg-gray-300 text-black"
                          }`}
                        >
                          {t.priority}
                        </span>
                      </td>
                      <td className="p-2 border border-gray-400">
                        {t.createdAt
                          ? new Date(t.createdAt).toLocaleDateString("fa-IR", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })
                          : null}
                      </td>
                      <td className="p-2 border border-gray-400">
                        {t.updatedAt
                          ? new Date(t.updatedAt).toLocaleDateString("fa-IR", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })
                          : null}
                      </td>
                      <td className="p-2 border border-gray-400 text-center">
                        <button
                          className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                          onClick={() => {
                            setSelectedTicket(t);
                            setIsModalOpen(true);
                          }}
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          className="p-1 text-red-600 hover:bg-red-100 rounded"
                          onClick={() => {
                            setSelectedTicket(t);
                            setIsDeleteModalOpen(true);
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
          </div>
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
