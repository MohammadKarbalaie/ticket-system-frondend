"use client";

import { Header } from "@/components/shared/header";
import { Sidebar } from "@/components/shared/sidebar";
import apiClient from "@/services/client";
import { urls } from "@/services/urls";
import {
  UserCircle,
  PencilLine,
  Lock,
  Info,
  KeyRound,
  Save,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { User } from "@/types/User";
import { Category } from "@/types/Category";
import { Ticket } from "@/types/Ticket";

type PasswordForm = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

function ProfilePage() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<PasswordForm>();

  const [profile, setProfile] = useState<User | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [ticketsmy, setTicketsMy] = useState<Ticket[]>([]);

  // edit form
  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    formState: { errors: errorsEdit },
    reset,
  } = useForm<User>();

  const newPassword = watch("newPassword");

  // change passowrd
  const onSubmitPassword = async (data: PasswordForm) => {
    try {
      const payload = {
        oldPassword: data.currentPassword,
        newPassword: data.newPassword,
      };

      const res = await apiClient.put(urls.auth.changePassword, payload);
      console.log("رمز عبور تغییر کرد:", res.data);
    } catch (error) {
      console.error("خطا در تغییر رمز عبور:", error);
    }
  };

  //edit porfile
  const onEditSubmit = async (data: User) => {
    try {
      const res = await apiClient.put(urls.auth.getProfile, data);
      setProfile(res.data);
      console.log("ویرایش موفق:", res.data);
    } catch (error) {
      console.error("خطا در ویرایش پروفایل:", error);
    }
  };

  // Getting profiles and categories
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await apiClient.get(urls.auth.getProfile);
        console.log(res.data);
        setProfile(res.data);
        reset(res.data); // Populating the edit form with data
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


    const fetchTicketsMy = async () => {
      try {
        const res = await apiClient.get(urls.tickets.getMine);     
        setTicketsMy(res.data);
      } catch (error) {
        console.error("Error fetching tickets:", error);
      }
    };

    fetchTicketsMy();
    fetchProfile();
    fetchCategories();
  }, [reset]);

  const totalTickets = ticketsmy.length;
  const openTickets = ticketsmy.filter((t) => t.status === "open").length;
  const closedTickets = ticketsmy.filter((t) => t.status === "closed").length;

  

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-6">
        <Header />
        <div className="grid grid-cols-3 gap-6 mt-6">
          {/* Profile*/}
          <div className="w-full bg-white rounded-2xl shadow-md p-6 h-[350px]">
            <div className="flex flex-col items-center justify-center">
              <UserCircle className="w-32 h-32 text-white bg-blue-500 rounded-full p-4 shadow-md" />
              <p className="text-lg font-semibold text-gray-800 mt-4">
                {profile ? profile.fname : "—"} {profile ? profile.lname : "—"}
              </p>
              <p className="text-sm text-gray-500">
                {profile ? profile.role : "—"}
              </p>
            </div>
            <div className="grid grid-cols-3 mt-8 text-center">
              <div className="flex flex-col items-center text-gray-700 border-l">
                <p className="text-xl font-bold">{totalTickets}</p>
                <p className="text-sm">کل تیکت‌ها</p>
              </div>
              <div className="flex flex-col items-center text-gray-700 border-l">
                <p className="text-xl font-bold">{openTickets}</p>
                <p className="text-sm">باز</p>
              </div>
              <div className="flex flex-col items-center text-gray-700">
                <p className="text-xl font-bold">{closedTickets}</p>
                <p className="text-sm">بسته</p>
              </div>
            </div>
          </div>

          {/* ویرایش اطلاعات */}
          <div className="col-span-2 w-full bg-white rounded-2xl shadow-md overflow-hidden flex flex-col">
            <div className="bg-[#6e63c5] text-white px-4 py-3 font-semibold flex items-center gap-2">
              <PencilLine className="w-5 h-5" />
              ویرایش اطلاعات
            </div>

            <form
              onSubmit={handleSubmitEdit(onEditSubmit)}
              className="flex-1 p-6"
            >
              <div className="space-y-4">
                {/* نام کاربری و ایمیل */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="w-full">
                    <label className="block text-gray-700 mb-1">
                      نام کاربری
                    </label>
                    <input
                      type="text"
                      {...registerEdit("username", {
                        required: "نام کاربری الزامی است",
                        minLength: {
                          value: 3,
                          message: "نام کاربری حداقل 3 کاراکتر باشد",
                        },
                      })}
                      className="w-full border border-gray-300 text-black rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errorsEdit.username && (
                      <p className="text-red-500 text-sm mt-1">
                        {errorsEdit.username.message}
                      </p>
                    )}
                  </div>

                  <div className="w-full">
                    <label className="block text-gray-700 mb-1">ایمیل</label>
                    <input
                      type="email"
                      {...registerEdit("email", {
                        required: "ایمیل الزامی است",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "فرمت ایمیل نادرست است",
                        },
                      })}
                      className="w-full border border-gray-300 text-black rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errorsEdit.email && (
                      <p className="text-red-500 text-sm mt-1">
                        {errorsEdit.email.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* نام و نام خانوادگی */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="w-full">
                    <label className="block text-gray-700 mb-1">نام</label>
                    <input
                      type="text"
                      {...registerEdit("fname", {
                        required: "نام الزامی است",
                        minLength: {
                          value: 2,
                          message: "نام حداقل 2 کاراکتر باشد",
                        },
                      })}
                      className="w-full border border-gray-300 text-black rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errorsEdit.fname && (
                      <p className="text-red-500 text-sm mt-1">
                        {errorsEdit.fname.message}
                      </p>
                    )}
                  </div>

                  <div className="w-full">
                    <label className="block text-gray-700 mb-1">
                      نام خانوادگی
                    </label>
                    <input
                      type="text"
                      {...registerEdit("lname", {
                        required: "نام خانوادگی الزامی است",
                        minLength: {
                          value: 2,
                          message: "نام خانوادگی حداقل 2 کاراکتر باشد",
                        },
                      })}
                      className="w-full border border-gray-300 text-black rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errorsEdit.lname && (
                      <p className="text-red-500 text-sm mt-1">
                        {errorsEdit.lname.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* بخش و تلفن */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="w-full">
                    <label className="block text-gray-700 mb-1">دپارتمان</label>
                    <select
                      {...registerEdit("department", {
                        required: "انتخاب بخش الزامی است",
                      })}
                      className="w-full border border-gray-300 text-black rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">انتخاب کنید</option>
                      {categories.map((cat) => (
                        <option key={cat._id} value={cat._id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                    {errorsEdit.department && (
                      <p className="text-red-500 text-sm mt-1">
                        {errorsEdit.department.message}
                      </p>
                    )}
                  </div>

                  <div className="w-full">
                    <label className="block text-gray-700 mb-1">تلفن</label>
                    <input
                      type="text"
                      {...registerEdit("phone", {
                        required: "شماره تلفن الزامی است",
                        minLength: {
                          value: 10,
                          message: "شماره تلفن حداقل 10 رقم باشد",
                        },
                      })}
                      className="w-full border border-gray-300 text-black rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errorsEdit.phone && (
                      <p className="text-red-500 text-sm mt-1">
                        {errorsEdit.phone.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <button
                  type="submit"
                  className="flex items-center gap-2 bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 cursor-pointer transition"
                >
                  <Save className="w-5 h-5" />
                  ذخیره تغییرات
                </button>
              </div>
            </form>
          </div>

          {/* اطلاعات حساب */}
          <div className="w-full bg-white rounded-2xl shadow-md overflow-hidden h-fit">
            <div className="bg-[#6e63c5] text-white px-4 py-3 font-semibold flex items-center gap-2">
              <Info className="w-5 h-5" />
              اطلاعات حساب
            </div>
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-gray-600">نقش</p>
                <span className="bg-red-600 text-white uppercase text-sm px-3 py-1 rounded-full w-20 text-center">
                  {profile ? profile.role : "—"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-gray-600">بخش</p>
                <span className="text-gray-800">
                  {profile ? profile.department.name : "—"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-gray-600">تاریخ عضویت</p>
                <span className="text-gray-800">
                  {profile && profile.joinedAt
                    ? new Date(profile.joinedAt).toLocaleDateString("fa-IR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "—"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-gray-600">وضعیت</p>
                <span className="bg-green-600 text-white uppercase text-sm px-3 py-1 rounded-full w-20 text-center">
                  {profile ? profile.status : "—"}
                </span>
              </div>
            </div>
          </div>

          {/* تغییر رمز عبور */}
          <div className="col-span-2 w-full bg-white rounded-2xl shadow-md overflow-hidden flex flex-col p-6">
            <div className="bg-[#6e63c5] text-white px-4 py-3 font-semibold flex items-center gap-2 rounded-t-lg">
              <Lock className="w-5 h-5" />
              تغییر رمز عبور
            </div>

            <form
              onSubmit={handleSubmit(onSubmitPassword)}
              className="flex-1 flex flex-col space-y-4 mt-6"
            >
              <div className="w-full">
                <label className="block text-gray-700 mb-1">رمز فعلی</label>
                <input
                  type="password"
                  {...register("currentPassword", {
                    required: "رمز فعلی الزامی است",
                  })}
                  className="w-full border border-gray-300 text-black rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.currentPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.currentPassword.message}
                  </p>
                )}
              </div>

              <div className="w-full flex gap-4">
                <div className="w-full">
                  <label className="block text-gray-700 mb-1">رمز جدید</label>
                  <input
                    type="password"
                    {...register("newPassword", {
                      required: "رمز جدید الزامی است",
                      minLength: {
                        value: 6,
                        message: "رمز حداقل ۶ کاراکتر باشد",
                      },
                    })}
                    className="w-full border border-gray-300 text-black rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.newPassword && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.newPassword.message}
                    </p>
                  )}
                </div>

                <div className="w-full">
                  <label className="block text-gray-700 mb-1">
                    تایید رمز جدید
                  </label>
                  <input
                    type="password"
                    {...register("confirmPassword", {
                      required: "تایید رمز الزامی است",
                      validate: (value) =>
                        value === newPassword ||
                        "رمز جدید و تاییدیه مطابقت ندارند",
                    })}
                    className="w-full border border-gray-300 text-black rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-end mt-2">
                <button
                  type="submit"
                  className="flex items-center gap-2 bg-yellow-500 text-black px-4 py-2 rounded-lg hover:bg-yellow-600 cursor-pointer transition"
                >
                  <KeyRound className="w-5 h-5" />
                  تغییر رمز عبور
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
