"use client";

import { Header } from "@/components/shared/header";
import { Sidebar } from "@/components/shared/sidebar";
import { Edit2, Funnel, List, RotateCw, Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import apiClient from "@/services/client";
import { urls } from "@/services/urls";
import { Category } from "@/types/Category";
import { Ticket } from "@/types/Ticket";
import { User } from "@/types/User";
import DeleteTicketModal from "@/components/delete/DeleteTicketModal";
import EditTicketModal from "@/components/modals/EditTickets";

type FormData = {
  status: string;
  category: string;
};

function TicketsAssigned() {
  const { register, handleSubmit, reset } = useForm<FormData>();
  const [categories, setCategories] = useState<Category[]>([]);
  const [allTickets, setAllTickets] = useState<Ticket[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [profile, setProfile] = useState<User | null>(null);

  // کنترل مودال‌ها
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

  const onSubmit = (data: FormData) => {
    if (!profile) return;

    let filtered = allTickets.filter(
      (t) => t.assignedDepartment === profile.department._id
    );

    if (data.status) {
      filtered = filtered.filter((t) => t.status === data.status);
    }

    if (data.category) {
      filtered = filtered.filter((t) => t.category._id === data.category);
    }

    setTickets(filtered);
  };

  const handleReset = () => {
    reset();
    if (profile) {
      const filtered = allTickets.filter(
        (t) => t.assignedDepartment === profile.department._id
      );
      setTickets(filtered);
    }
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
          {/* فرم فیلتر */}
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
                <option value="تایید شده">تایید شده</option>
                <option value="باز">باز</option>
              </select>
            </div>

            <div className="w-1/3 min-w-[200px]">
              <label className="block text-sm font-medium mb-1">دسته‌بندی</label>
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

          {/* جدول تیکت‌ها */}
          <div className="col-span-2 border border-gray-400 rounded-lg overflow-hidden bg-white shadow">
            <div className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-4 py-3 font-semibold flex items-center gap-2">
              <List className="w-5 h-5" />
              لیست تیکت‌های ثبت شده
            </div>
            <div className="p-4 overflow-x-auto">
              <table className="w-full text-sm text-center border-collapse text-black">
                <thead>
                  <tr className="bg-gray-100 text-gray-700">
                    <th className="p-2 border border-gray-400">شماره تیکت</th>
                    <th className="p-2 border border-gray-400">عنوان</th>
                    <th className="p-2 border border-gray-400">ایجاد کننده</th>
                    <th className="p-2 border border-gray-400">دسته‌بندی</th>
                    <th className="p-2 border border-gray-400">وضعیت</th>
                    <th className="p-2 border border-gray-400">اولویت</th>
                    <th className="p-2 border border-gray-400">تاریخ ایجاد</th>
                    <th className="p-2 border border-gray-400">آخرین بروزرسانی</th>
                    <th className="p-2 border border-gray-400">عملیات</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.map((u) => (
                    <tr
                      key={u._id}
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => router.push(`/tickets/${u._id}`)}
                    >
                      <td className="p-2 border border-gray-400">{u.ticketNumber}</td>
                      <td className="p-2 border border-gray-400">{u.title}</td>
                      <td className="p-2 border border-gray-400">
                        {u.creator?.fname} {u.creator?.lname}
                      </td>
                      <td className="p-2 border border-gray-400">
                        <span className={categoryBadge}>{u.category.name}</span>
                      </td>
                      <td className="p-2 border border-gray-400">
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            statusColors[u.status] || "bg-gray-300 text-black"
                          }`}
                        >
                          {u.status}
                        </span>
                      </td>
                      <td className="p-2 border border-gray-400">
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            priorityColors[u.priority] || "bg-gray-300 text-black"
                          }`}
                        >
                          {u.priority}
                        </span>
                      </td>
                      <td className="p-2 border border-gray-400">
                        {new Date(u.createdAt).toLocaleDateString("fa-IR", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </td>
                      <td className="p-2 border border-gray-400">
                        {new Date(u.updatedAt).toLocaleDateString("fa-IR", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </td>
                      <td className="p-2 border border-gray-400 text-center space-x-2">
                        <button
                          className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTicket(u);
                            setIsEditModalOpen(true);
                          }}
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          className="p-1 text-red-600 hover:bg-red-100 rounded"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTicket(u);
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
                      <td colSpan={9} className="p-4 text-center text-gray-500">
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

export default TicketsAssigned;
