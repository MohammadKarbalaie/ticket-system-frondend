"use client";
import { useEffect, useState } from "react";
import apiClient from "@/services/client";
import { urls } from "@/services/urls";
import { Ticket } from "@/types/Ticket";
import { Department } from "@/types/Department";
import { toast } from "react-toastify";

interface EditTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: Ticket | null;
  onTicketUpdated: (ticket: Ticket) => void;
}

type FormData = {
  title: string;
  status: string;
  priority: string;
  assignedDepartment: string;
  description: string;
};

const EditTicketModal: React.FC<EditTicketModalProps> = ({
  isOpen,
  onClose,
  ticket,
  onTicketUpdated,
}) => {
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState<Department[]>([]);

  const [formData, setFormData] = useState<FormData>({
    title: "",
    status: "",
    priority: "",
    assignedDepartment: "",
    description: "",
  });

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await apiClient.get(urls.departments.getAll);
        setDepartments(res.data || []);
      } catch (err) {
        console.error("خطا در گرفتن دپارتمان‌ها:", err);
      }
    };
    fetchDepartments();
  }, []);

  useEffect(() => {
    if (ticket) {
      setFormData({
        title: ticket.title || "",
        status: ticket.status || "",
        priority: ticket.priority || "",
        assignedDepartment:
          typeof ticket.assignedDepartment === "string"
            ? ticket.assignedDepartment
            : ticket.assignedDepartment?._id || "",
        description: ticket.description || "",
      });
    }
  }, [ticket]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticket) return;
    setLoading(true);

    try {
      const payload = {
        title: formData.title,
        status: formData.status,
        priority: formData.priority,
        assignedDepartment: formData.assignedDepartment, // فقط آیدی ارسال شود
        description: formData.description,
      };

      const res = await apiClient.put(urls.tickets.update(ticket._id), payload);

      // برگرداندن داده به parent برای بروزرسانی جدول
      onTicketUpdated({ ...ticket, ...res.data });

      toast.success("تیکت با موفقیت ویرایش شد ✅");
      onClose();
    } catch (err: any) {
      console.error("خطا در ویرایش تیکت:", err.response || err.message);
      toast.error("خطا در ذخیره تغییرات ❌");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !ticket) return null;

  return (
    <div className="fixed inset-0 z-50 text-black flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 text-black">
        <h2 className="text-xl font-semibold mb-4">ویرایش تیکت</h2>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm mb-1">عنوان</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">وضعیت</label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
              className="w-full border rounded px-3 py-2"
            >
              <option value="">انتخاب وضعیت</option>
              <option value="باز">باز</option>
              <option value="در حال بررسی">در حال بررسی</option>
              <option value="بسته">بسته شده</option>
              <option value="حل شده">حل شده</option>
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1">اولویت</label>
            <select
              value={formData.priority}
              onChange={(e) =>
                setFormData({ ...formData, priority: e.target.value })
              }
              className="w-full border rounded px-3 py-2"
            >
              <option value="">انتخاب اولویت</option>
              <option value="بالا">بالا</option>
              <option value="متوسط">متوسط</option>
              <option value="پایین">پایین</option>
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1">دپارتمان</label>
            <select
              value={formData.assignedDepartment}
              onChange={(e) =>
                setFormData({ ...formData, assignedDepartment: e.target.value })
              }
              className="w-full border rounded px-3 py-2"
            >
              <option value="">انتخاب دپارتمان</option>
              {departments.map((dept) => (
                <option key={dept._id} value={dept._id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1">توضیحات</label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full border rounded px-3 py-2"
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
            >
              لغو
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "در حال ذخیره..." : "ذخیره"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTicketModal;
