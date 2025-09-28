"use client";

import { Trash } from "lucide-react";
import apiClient, { setAuthHeader } from "@/services/client";
import { getValidAccessToken } from "@/utils/token";
import { urls } from "@/services/urls";
import React, { useState } from "react";

interface DeleteUserButtonProps {
  userId: string;
  onDeleted: (userId: string) => void;
}

const DeleteUserButton: React.FC<DeleteUserButtonProps> = ({ userId, onDeleted }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const token = await getValidAccessToken();
      if (!token) {
        console.warn("No valid token available");
        setIsDeleting(false);
        return;
      }

      setAuthHeader(token);

      await apiClient.delete(urls.users.delete(userId));

      onDeleted(userId);
      setIsOpen(false);
    } catch (err) {
      console.error("خطا در حذف کاربر:", err);
      alert("خطا در حذف کاربر");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="p-1 text-red-600 hover:bg-red-100 rounded"
      >
        <Trash className="w-4 h-4" />
      </button>

      {/* مودال شیشه‌ای */}
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* بک‌گراند شفاف و بلور */}
          <div className="w-1 absolute inset-0 bg-opacity-20 backdrop-blur-sm"></div>

          <div className="relative bg-white bg-opacity-70 backdrop-blur-md rounded-lg p-6 w-80 shadow-lg z-10">
            <h2 className="text-lg font-semibold mb-4 text-center">تایید حذف</h2>
            <p className="text-sm mb-6 text-center">
              آیا مطمئن هستید که می‌خواهید این کاربر را حذف کنید؟
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="bg-red-600 text-white px-4 py-2 rounded hover:opacity-90 disabled:opacity-50"
              >
                {isDeleting ? "در حال حذف..." : "حذف"}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="bg-gray-300 text-black px-4 py-2 rounded hover:opacity-90"
              >
                لغو
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DeleteUserButton;
