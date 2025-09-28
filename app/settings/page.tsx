"use client";
import { Header } from "@/components/shared/header";
import { Sidebar } from "@/components/shared/sidebar";
import apiClient from "@/services/client";
import { urls } from "@/services/urls";
import { Category } from "@/types/Category";
import { Ticket } from "@/types/Ticket";
import { User } from "@/types/User";
import { Activity, Info, PencilLine, Tag } from "lucide-react";
import { useEffect, useState } from "react";
import EditCategoryModal from "@/components/modals/EditCategories";

function SettingsPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );

  const colors = ["#007bff", "#4da55f", "#ffbe09", "#d84d50", "#6e63c5"];

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await apiClient.get(urls.categories.getAll);
        setCategories(res.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    const fetchUser = async () => {
      try {
        const res = await apiClient.get(urls.users.getAll);
        setUsers(res.data);
      } catch (error) {
        console.error("Error fetching Users:", error);
      }
    };

    const fetchTickets = async () => {
      try {
        const res = await apiClient.get(urls.tickets.getAll);
        setTickets(res.data);
      } catch (error) {
        console.error("Error fetching tickets:", error);
      }
    };

    fetchUser();
    fetchTickets();
    fetchCategories();
  }, []);

  const allUsers = users.length;
  const alltotalTickets = tickets.length;
  const allopenTickets = tickets.filter((t) => t.status === "open").length;
  const allclosedTickets = tickets.filter((t) => t.status === "closed").length;

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6">
        <Header />
        <div className="grid grid-cols-2 gap-6 mt-6">
          {/* مدیریت دسته‌بندی‌ها */}
          <div className="w-full bg-white rounded-2xl shadow-md overflow-hidden flex flex-col">
            <div className="bg-[#6e63c5] text-white px-4 py-3 font-semibold flex items-center gap-2">
              <Tag className="w-5 h-5" />
              مدیریت دسته بندی ها
            </div>
            <div className="flex text-gray-600">
              <table className="w-full text-center">
                <thead>
                  <tr className="border-b bg-sky-200 border-b-gray-600">
                    <th className="px-4 py-2">نام</th>
                    <th className="px-4 py-2">توضیحات</th>
                    <th className="px-4 py-2">رنگ</th>
                    <th className="px-4 py-2">عملیات</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.length > 0 ? (
                    categories.map((cat, index) => {
                      const color = colors[index % colors.length];
                      return (
                        <tr
                          key={cat._id}
                          className="border-t border-b-gray-600"
                        >
                          <td className="px-4 py-2">{cat.name}</td>
                          <td className="px-4 py-2">
                            {cat.description.length > 30
                              ? cat.description.slice(0, 29) + "..."
                              : cat.description}
                          </td>
                          <td>
                            <p
                              className="rounded-4xl text-white pt-1 px-2"
                              style={{ backgroundColor: color }}
                            >
                              {color}
                            </p>
                          </td>
                          <td>
                            <PencilLine
                              onClick={() => {
                                setSelectedCategory(cat);
                                setIsOpen(true);
                              }}
                              className="mx-auto text-sky-600 border-2 h-5 w-5 cursor-pointer"
                            />
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={4} className="text-center py-4">
                        دسته‌بندی‌ای یافت نشد.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* آمار سیستم */}
          <div className="w-full bg-white rounded-2xl shadow-md overflow-hidden flex flex-col">
            <div className="bg-[#6e63c5] text-white px-4 py-3 font-semibold flex items-center gap-2">
              <Activity className="w-5 h-5" />
              آمار سیستم
            </div>
            <div className="grid grid-cols-2 py-15 gap-2 items-center justify-center p-4 text-gray-600">
              <div className="bg-sky-300 p-6 text-center ">
                <p className="text-sky-700 bold text-2xl">{allUsers}</p>
                <p className="text-gray-600">کل کاربران</p>
              </div>

              <div className="bg-blue-300 p-6 text-center ">
                <p className="text-blue-700 bold text-2xl">{alltotalTickets}</p>
                <p className="text-gray-600">کل تیکت ها</p>
              </div>

              <div className="bg-yellow-300 p-6 text-center ">
                <p className="text-orange-700 bold text-2xl">
                  {allopenTickets}
                </p>
                <p className="text-gray-600"> تیکت های باز</p>
              </div>

              <div className="bg-green-300 p-6 text-center ">
                <p className="text-green-700 bold text-2xl">
                  {allclosedTickets}
                </p>
                <p className="text-gray-600">تیکت های بسته</p>
              </div>
            </div>
          </div>

          {/* اطلاعات سیستم */}
          <div className="col-start-2 w-full bg-white rounded-2xl shadow-md overflow-hidden flex flex-col">
            <div className="bg-[#6e63c5] text-white px-4 py-3 font-semibold flex items-center gap-2">
              <Info className="w-5 h-5" />
              اطلاعات سیستم
            </div>
            <div className="flex flex-col justify-center p-6 text-gray-900">
              <div className="flex gap-2 pb-1">
                <p>نسخه:</p>
                <p>1.2.4</p>
              </div>

              <div className="flex gap-2 py-2">
                <p>نام سیستم:</p>
                <p>سیستم اتوماسیون اداری</p>
              </div>

              <div className="flex gap-2 py-2">
                <p>حداکثر اندازه فایل:</p>
                <p>5 MB</p>
              </div>
              <div className="flex gap-2 py-2">
                <p>تعداد آیتم در صفحه:</p>
                <p>10</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <EditCategoryModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        category={selectedCategory}
      />
    </div>
  );
}

export default SettingsPage;
