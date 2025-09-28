"use client";
import { useEffect, useState } from "react";
import apiClient from "@/services/client";
import { urls } from "@/services/urls";
import { User } from "@/types/User";
import { Department } from "@/types/Department";

interface EditUsersByAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: User | null;
  onUserUpdated: (user: User) => void;
}

type FormState = {
  fname: string;
  lname: string;
  phone: number;
  department: Department | null; // 👈 اینجا آبجکت ذخیره میشه
  role: string;
  status: string;
};

const EditUsersByAdmin: React.FC<EditUsersByAdminModalProps> = ({
  isOpen,
  onClose,
  users,
  onUserUpdated,
}) => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<FormState>({
    fname: "",
    lname: "",
    phone: 0,
    department: null,
    role: "",
    status: "فعال",
  });

  // دریافت لیست دپارتمان‌ها
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await apiClient.get(urls.departments.getAll);
        setDepartments(res.data || []);
      } catch (err) {
        console.error("خطا در دریافت دپارتمان‌ها:", err);
      }
    };
    fetchDepartments();
  }, []);

  // پر کردن فرم وقتی کاربر انتخاب شد
  useEffect(() => {
    if (users) {
      setFormData({
        fname: users.fname || "",
        lname: users.lname || "",
        phone: users.phone || 0,
        department:
          users.department && typeof users.department !== "string"
            ? (users.department as Department)
            : null,
        role: users.role || "",
        status: users.status || "فعال",
      });
    } else {
      setFormData({
        fname: "",
        lname: "",
        phone: 0,
        department: null,
        role: "",
        status: "فعال",
      });
    }
  }, [users]);

  if (!isOpen || !users) return null;

  // تغییر فیلدهای ساده
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "phone" ? Number(value) : value,
    }));
  };

  // تغییر دپارتمان
  const handleDepartmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = departments.find((d) => d._id === e.target.value) || null;
    setFormData((prev) => ({
      ...prev,
      department: selected,
    }));
  };

  // ارسال فرم
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        fname: formData.fname,
        lname: formData.lname,
        phone: formData.phone,
        department: formData.department, // 👈 کل آبجکت ارسال میشه
        role: formData.role,
        status: formData.status,
      };

      const res = await apiClient.put(urls.users.update(users._id), payload);

      onUserUpdated(res.data);
      alert("اطلاعات با موفقیت ویرایش شد ✅");
      onClose();
    } catch (err) {
      console.error("خطا در ارسال ویرایش:", err);
      alert("خطا در ذخیره‌سازی تغییرات ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-lg font-bold mb-4">ویرایش کاربر</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* نام */}
          <div>
            <label className="block text-sm mb-1">نام</label>
            <input
              name="fname"
              value={formData.fname}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              placeholder="نام"
            />
          </div>

          {/* نام خانوادگی */}
          <div>
            <label className="block text-sm mb-1">نام خانوادگی</label>
            <input
              name="lname"
              value={formData.lname}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              placeholder="نام خانوادگی"
            />
          </div>

          {/* شماره تماس */}
          <div>
            <label className="block text-sm mb-1">شماره تماس</label>
            <input
              type="number"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              placeholder="شماره تماس"
            />
          </div>

          {/* دپارتمان */}
          <div>
            <label className="block text-sm mb-1">دپارتمان</label>
            <select
              value={formData.department?._id || ""}
              onChange={handleDepartmentChange}
              className="w-full border px-3 py-2 rounded"
            >
              <option value="">انتخاب دپارتمان</option>
              {departments.map((d) => (
                <option key={d._id} value={d._id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          {/* نقش */}
          <div>
            <label className="block text-sm mb-1">نقش</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            >
              <option value="">انتخاب نقش</option>
              <option value="ادمین">ادمین</option>
              <option value="مدیر">مدیر</option>
              <option value="کارمند">کارمند</option>
              <option value="کاربر">کاربر</option>
            </select>
          </div>

          {/* وضعیت */}
          <div>
            <label className="block text-sm mb-1">وضعیت</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            >
              <option value="فعال">فعال</option>
              <option value="غیرفعال">غیرفعال</option>
            </select>
          </div>

          {/* دکمه‌ها */}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-400 text-white rounded"
              disabled={loading}
            >
              لغو
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded"
              disabled={loading}
            >
              {loading ? "در حال ذخیره..." : "ذخیره تغییرات"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUsersByAdmin;
