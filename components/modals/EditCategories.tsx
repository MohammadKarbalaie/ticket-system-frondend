"use client";
import { useState, useEffect } from "react";
import { Category } from "@/types/Category";
import { urls } from "@/services/urls";
import apiClient from "@/services/client";

interface EditCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: Category | null;
}

const EditCategoryModal: React.FC<EditCategoryModalProps> = ({
  isOpen,
  onClose,
  category,
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (category) {
      setName(category.name);
      setDescription(category.description);
    }
  }, [category]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category) return;

    try {
      setLoading(true);
      await apiClient.put(urls.categories.update(category._id), {
        name,
        description,
      });
      onClose(); // بستن مودال بعد از موفقیت
      window.location.reload(); // رفرش صفحه برای گرفتن اطلاعات جدید
    } catch (error) {
      console.error("Error updating category:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
        <h2 className="text-xl font-semibold mb-4 text-black">ویرایش دسته‌بندی</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block mb-1 text-sm text-black">نام دسته‌بندی</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full text-black border px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-sky-300"
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-sm text-black">توضیحات</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border text-black px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-sky-300"
              rows={3}
              required
            />
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-gray-400"
            >
              انصراف
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-md bg-sky-600 text-white hover:bg-sky-700 disabled:opacity-50"
            >
              {loading ? "در حال ذخیره..." : "ذخیره تغییرات"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCategoryModal;
