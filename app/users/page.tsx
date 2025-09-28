"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/shared/header";
import { Sidebar } from "@/components/shared/sidebar";
import apiClient from "@/services/client";
import { urls } from "@/services/urls";
import { Category } from "@/types/Category";
import { User } from "@/types/User";
import { getValidAccessToken } from "@/utils/token";
import { List, UserPlus, Edit2, Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import EditUsersByAdminModal from "@/components/modals/EditUsersByAdmin";
import DeleteUserButton from "@/components/delete/DeleteUserButton";

type FormData = {
  username: string;
  email: string;
  password: string;
  fname: string;
  lname: string;
  role: string;
  department: string;
  phone: string;
};

export default function UsersPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    try {
      // اگر endpoint ایجاد کاربر دارید از این استفاده کنید:
      // await apiClient.post(urls.users.create, data);
      console.log("Create user payload:", data);
      // بعد از ایجاد می‌توانید لیست را دوباره fetch کنید یا کاربر جدید را به state اضافه کنید.
      reset();
      alert("درخواست ایجاد کاربر ارسال شد (نمونه)");
    } catch (err) {
      console.error("Error creating user:", err);
      alert("خطا در ایجاد کاربر");
    }
  };

  const [users, setUsers] = useState<User[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const token = await getValidAccessToken();
        if (!token) {
          // اگر توکن لازم است، اینجا پیام یا ریدایرکت قرار دهید
          console.warn("No valid token available");
        }

        const [catRes, usersRes] = await Promise.all([
          apiClient.get(urls.categories.getAll),
          apiClient.get(urls.users.getAll),
        ]);

        setCategories(catRes.data || []);
        setUsers(usersRes.data || []);
        console.log(usersRes.data);
      } catch (err) {
        console.error("خطا در دریافت داده‌ها:", err);
      }
    };

    fetchAll();
  }, []);

  const roleColors: Record<string, string> = {
    ادمین: "bg-red-500 text-white ",
    مدیر: "bg-yellow-400 text-white",
    کارمند: "bg-orange-400 text-white",
    کاربر: "bg-green-500 text-white",
  };

  const statusColors: Record<string, string> = {
    فعال: "bg-green-500 text-white",
    غیرفعال: "bg-red-500 text-white",
  };

  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
    setIsModalOpen(false);
  };

  // وقتی مودال کاربر را آپدیت کرد، همین‌جا state لیست کاربران را بروزرسانی می‌کنیم
  const handleUserUpdated = (updatedUser: User) => {
    setUsers((prev) =>
      prev.map((u) =>
        String(u._id) === String(updatedUser._id) ? updatedUser : u
      )
    );
  };

  return (
    <div className="flex text-black">
      <Sidebar />
      <div className="flex-1 p-6">
        <Header />

        <div className="grid grid-cols-3 gap-6 mt-6 ">
          {/* ایجاد کاربر جدید */}
          <div className="border border-gray-400 rounded-lg overflow-hidden bg-white shadow">
            <div className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-4 py-3 font-semibold flex items-center gap-2">
              <UserPlus className="w-5 h-5" />
              ایجاد کاربر جدید
            </div>
            <div className="p-4">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    نام کاربری
                  </label>
                  <input
                    {...register("username")}
                    className="w-full p-2 border border-gray-400 rounded text-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    ایمیل
                  </label>
                  <input
                    type="email"
                    {...register("email")}
                    className="w-full p-2 border border-gray-400 rounded text-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    رمز عبور
                  </label>
                  <input
                    type="password"
                    {...register("password")}
                    className="w-full p-2 border border-gray-400 rounded text-black"
                  />
                </div>
                <div className="flex flex-col gap-4">
                  <div className="w-full">
                    <label className="block text-sm font-medium mb-1">
                      نام
                    </label>
                    <input
                      type="text"
                      {...register("fname", {
                        required: "نام الزامی است",
                        minLength: { value: 2, message: "حداقل ۲ کاراکتر" },
                      })}
                      className="w-full border border-gray-400 text-black rounded-lg px-3 py-2"
                    />
                    {errors.fname && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.fname.message}
                      </p>
                    )}
                  </div>

                  <div className="w-full">
                    <label className="block text-sm font-medium mb-1">
                      نام خانوادگی
                    </label>
                    <input
                      type="text"
                      {...register("lname", {
                        required: "نام خانوادگی الزامی است",
                        minLength: { value: 2, message: "حداقل ۲ کاراکتر" },
                      })}
                      className="w-full border border-gray-400 text-black rounded-lg px-3 py-2"
                    />
                    {errors.lname && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.lname.message}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">نقش</label>
                  <select
                    {...register("role")}
                    className="w-full p-2 border border-gray-400 rounded text-black"
                  >
                    <option value="">انتخاب نقش</option>
                    <option value="ادمین">ادمین</option>
                    <option value="مدیر">مدیر</option>
                    <option value="کارمند">کارمند</option>
                    <option value="کاربر">کاربر</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">بخش</label>
                  <select
                    {...register("department", {
                      required: "انتخاب بخش الزامی است",
                    })}
                    className="w-full border border-gray-400 text-black rounded-lg px-3 py-2"
                  >
                    <option value="">انتخاب کنید</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    شماره تماس
                  </label>
                  <input
                    {...register("phone")}
                    className="w-full p-2 border border-gray-400 rounded text-black"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-4 py-2 rounded w-full hover:opacity-90"
                >
                  ایجاد کاربر
                </button>
              </form>
            </div>
          </div>

          {/* لیست کاربران */}
          <div className="col-span-2 border border-gray-400 rounded-lg overflow-hidden bg-white shadow">
            <div className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-4 py-3 font-semibold flex items-center gap-2">
              <List className="w-5 h-5" />
              لیست کاربران
            </div>
            <div className="p-4 overflow-x-auto">
              <table className="w-full text-sm text-right border-collapse text-black">
                <thead>
                  <tr className="bg-gray-100 text-gray-700">
                    <th className="p-2 border border-gray-400">نام کاربری</th>
                    <th className="p-2 border border-gray-400">نام کامل</th>
                    <th className="p-2 border border-gray-400">ایمیل</th>
                    <th className="p-2 border border-gray-400">نقش</th>
                    <th className="p-2 border border-gray-400">بخش</th>
                    <th className="p-2 border border-gray-400">وضعیت</th>
                    <th className="p-2 border border-gray-400">تاریخ عضویت</th>
                    <th className="p-2 border border-gray-400">عملیات</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id} className="hover:bg-gray-50">
                      <td className="p-2 border border-gray-400">
                        {u.username}
                      </td>
                      <td className="p-2 border border-gray-400">
                        {u.fname} {u.lname}
                      </td>
                      <td className="p-2 border border-gray-400">{u.email}</td>
                      <td className="p-2 border border-gray-400">
                        <span
                          className={`px-2 py-1 rounded text-sm uppercase ${
                            roleColors[u.role] || "bg-gray-400 text-white"
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="p-2 border border-gray-400">
                        {u?.department?.name || "—"}
                      </td>
                      <td className="p-2 border border-gray-400">
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            statusColors[u.status] || "bg-gray-400 text-white"
                          }`}
                        >
                          {u.status}
                        </span>
                      </td>
                      <td className="p-2 border border-gray-400">
                        {u?.joinedAt
                          ? new Date(u.joinedAt).toLocaleDateString("fa-IR", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })
                          : "—"}
                      </td>
                      <td className="p-2 border border-gray-400 text-center">
                        <button
                          onClick={() => handleEditClick(u)}
                          className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <DeleteUserButton
                          userId={u._id}
                          onDeleted={(id) =>
                            setUsers((prev) =>
                              prev.filter((user) => user._id !== id)
                            )
                          }
                        />
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr>
                      <td colSpan={8} className="p-4 text-center text-gray-500">
                        هیچ کاربری یافت نشد.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* مودال ویرایش */}
        <EditUsersByAdminModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          users={selectedUser}
          onUserUpdated={handleUserUpdated}
        />
      </div>
    </div>
  );
}
