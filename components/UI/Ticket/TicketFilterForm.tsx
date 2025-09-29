"use client";
import { Funnel, RotateCw } from "lucide-react";
import { useForm } from "react-hook-form";
import { Category } from "@/types/Category";

type FormData = {
  status: string;
  category: string;
};

interface TicketFilterFormProps {
  categories: Category[];
  onFilter: (data: FormData) => void;
  onReset: () => void;
}

export const TicketFilterForm: React.FC<TicketFilterFormProps> = ({
  categories,
  onFilter,
  onReset,
}) => {
  const { register, handleSubmit, reset } = useForm<FormData>();

  const handleSubmitForm = (data: FormData) => {
    onFilter(data);
  };

  const handleResetForm = () => {
    reset();
    onReset();
  };

  return (
    <form
      className="flex flex-wrap items-end gap-6 bg-white p-6 rounded-lg shadow-md border border-gray-200"
      onSubmit={handleSubmit(handleSubmitForm)}
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
          onClick={handleResetForm}
          className="flex items-center justify-center gap-2 bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
        >
          <RotateCw className="w-4 h-4" />
          پاک کردن
        </button>
      </div>
    </form>
  );
};
