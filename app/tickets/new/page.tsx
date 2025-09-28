"use client";
import { Header } from "@/components/shared/header";
import { Sidebar } from "@/components/shared/sidebar";
import {
  CircleCheckBig,
  Info,
  Lightbulb,
  MessageCircleQuestionMark,
  MoveRight,
  Ticket,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { Bs1Circle, Bs2Circle, Bs3Circle, Bs4Circle } from "react-icons/bs";
import apiClient from "@/services/client";
import { urls } from "@/services/urls";
import { Category } from "@/types/Category";
import { toast } from "react-toastify";

type FormData = {
  title: string;
  category: string;
  priority: string;
  assignedDepartment: string;
  description: string;
};

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 py-2">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center text-right font-medium text-gray-700 hover:text-purple-600"
      >
        {question}
        {open ? (
          <ChevronUp className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500" />
        )}
      </button>
      {open && <p className="mt-2 text-gray-600 text-sm">{answer}</p>}
    </div>
  );
}

function TicketsNew() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>();
  const [categories, setCategories] = useState<Category[]>([]);
  const [departments, setDepartments] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await apiClient.get(urls.categories.getAll);
        setCategories(res.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    const fetchDepartments = async () => {
      try {
        const res = await apiClient.get(urls.departments.create);
        setDepartments(res.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchDepartments();
    fetchCategory();
  }, []);

const onSubmit = async (data: FormData) => {
  try {
    const res = await apiClient.post(urls.tickets.create, data);
    console.log("Ticket created:", res.data);
    toast.success("تیکت با موفقیت ایجاد شد ✅");
    reset(); 
  } catch (error) {
    toast.warning("ایجاد تیکت با خطا مواجه شد ❌")
    console.error("Error creating ticket:", error);
  }
};


  const handleReset = () => {
    reset();
    console.log("Form cleared");
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6">
        <Header />
        <div className="grid grid-cols-3 gap-4">
          {/* فرم ایجاد تیکت */}
          <div className="col-span-2 border border-gray-200 rounded-lg overflow-hidden bg-white shadow">
            <div className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-4 py-3 font-semibold flex items-center gap-2">
              <Ticket className="w-5 h-5" />
              اطلاعات تیکت
            </div>
            <div className="bg-white">
              <form onSubmit={handleSubmit(onSubmit)} className="flex-1 p-6">
                <div className="w-full mb-2">
                  <label className="block font-bold text-gray-700 mb-1">
                    عنوان تیکت *
                  </label>
                  <input
                    type="text"
                    {...register("title", {
                      required: "عنوان الزامی است",
                      minLength: {
                        value: 2,
                        message: "عنوان حداقل 2 کاراکتر باشد",
                      },
                    })}
                    className="w-full border border-gray-300 text-black rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.title && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.title.message}
                    </p>
                  )}
                </div>

                <div className="flex gap-4 mb-2">
                  <div className="w-full">
                    <label className="block font-bold text-gray-700 mb-1">
                      دسته بندی *
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

                  <div className="w-full">
                    <label className="block font-bold text-gray-700 mb-1">
                      اولویت *
                    </label>
                    <select
                      {...register("priority")}
                      className="w-full border border-gray-300 text-black rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">انتخاب کنید</option>
                      <option value="بالا">بالا</option>
                      <option value="متوسط">متوسط</option>
                      <option value="پایین">پایین</option>
                    </select>
                  </div>

                  <div className="w-full">
                    <label className="block font-bold text-gray-700 mb-1">
                      دپارتمان *
                    </label>
                    <select
                      {...register("assignedDepartment")}
                      className="w-full border border-gray-300 text-black rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">همه دپارتمانها</option>
                      {departments.map((dep) => (
                        <option key={dep._id} value={dep._id}>
                          {dep.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <label className="block font-bold text-gray-700 mb-1">
                  توضیحات *
                </label>
                <textarea
                  {...register("description", {
                    required: "توضیحات الزامی است",
                    minLength: {
                      value: 20,
                      message: "توضیحات حداقل 20 کاراکتر باشد",
                    },
                  })}
                  className="w-full h-60 border border-gray-300 text-black rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="توضیحات کامل مشکل یا درخواست خود را بنویسید ..."
                ></textarea>
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.description.message}
                  </p>
                )}

                <p className="flex gap-2 text-gray-500 mt-2">
                  <Info />
                  هر چه توضیحات شما کامل‌تر باشد پاسخ سریعتری دریافت خواهید کرد
                </p>

                <div className="flex gap-3 w-full sm:w-auto mt-4">
                  <button
                    type="submit"
                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-4 py-2 rounded hover:opacity-90"
                  >
                    <CircleCheckBig className="w-4 h-4" />
                    ایجاد تیکت
                  </button>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="flex items-center justify-center gap-2 bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
                  >
                    <MoveRight className="w-4 h-4" />
                    بازگشت
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* ستون کناری (راهنما + FAQ) */}
          <div className="flex flex-col gap-4">
            {/* راهنما */}
            <div className="h-fit flex flex-col border border-gray-200 rounded-lg overflow-hidden bg-white shadow">
              <div className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-4 py-3 font-semibold flex items-center gap-2">
                <Lightbulb className="w-5 h-5" />
                راهنمای ایجاد تیکت
              </div>
              <div className="text-black p-4">
                <span className="flex flex-col mb-6">
                  <p className="text-sky-600 font-bold text-xl flex gap-2 items-center">
                    <Bs1Circle />
                    عنوان مناسب
                  </p>
                  <p className="mt-1 text-gray-600">
                    عنوان کوتاه و واضح انتخاب کنید که مشکل شما را به خوبی توصیف
                    کند
                  </p>
                </span>

                <span className="flex flex-col mb-6">
                  <p className="text-sky-600 font-bold text-xl flex gap-2 items-center">
                    <Bs2Circle />
                    دسته بندی صحیح
                  </p>
                  <p className="mt-1 text-gray-600">
                    دسته بندی مناسب را انتخاب کنید تا تیکت شما به دست متخصص
                    مربوطه برسد
                  </p>
                </span>

                <span className="flex flex-col mb-6">
                  <p className="text-sky-600 font-bold text-xl flex gap-2 items-center">
                    <Bs3Circle />
                    اولویت درست
                  </p>
                  <p className="mt-1 text-gray-600">
                    اولویت مناسب را انتخاب کنید. اولویت بالا فقط برای موارد
                    اضطراری استفاده شود
                  </p>
                </span>

                <span className="flex flex-col mb-2">
                  <p className="text-sky-600 font-bold text-xl flex gap-2 items-center">
                    <Bs4Circle />
                    توضیحات کامل
                  </p>
                  <p className="mt-1 text-gray-600">
                    تمام جزییات مربوط به مشکل یا درخواست خود را بنویسید
                  </p>
                </span>
              </div>
            </div>

            {/* سوالات متداول */}
            <div className="flex flex-col border border-gray-200 rounded-lg overflow-hidden bg-white shadow">
              <div className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-4 py-3 font-semibold flex items-center gap-2">
                <MessageCircleQuestionMark className="w-5 h-5" />
                سوالات متداول
              </div>
              <div className="p-4 text-black">
                <FAQItem
                  question="چقدر طول می‌کشد تا پاسخ دریافت کنم؟"
                  answer="معمولاً ظرف ۲۴ ساعت کاری به درخواست‌های شما پاسخ داده می‌شود."
                />
                <FAQItem
                  question="آیا می‌توانم فایل ضمیمه کنم؟"
                  answer="بله، در هنگام ایجاد تیکت می‌توانید فایل‌های مربوطه را ضمیمه کنید."
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TicketsNew;
