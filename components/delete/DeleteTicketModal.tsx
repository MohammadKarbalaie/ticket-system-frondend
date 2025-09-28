"use client";

import React, { useState } from "react";
import apiClient from "@/services/client";
import { urls } from "@/services/urls";
import { Ticket } from "@/types/Ticket";

interface DeleteTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: Ticket | null;
  onTicketDeleted: (ticketId: string) => void;
}

const DeleteTicketModal: React.FC<DeleteTicketModalProps> = ({
  isOpen,
  onClose,
  ticket,
  onTicketDeleted,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!ticket?._id) return;
    setIsDeleting(true);
    try {
      await apiClient.delete(urls.tickets.remove(ticket._id));
      onTicketDeleted(ticket._id);
      onClose();
    } catch (err) {
      console.error("خطا در حذف تیکت:", err);
      alert("خطا در حذف تیکت");
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isOpen || !ticket) return null;

  return (
    <div className="fixed inset-0 flex text-black items-center justify-center z-50">
      {/* پس‌زمینه شیشه‌ای */}
      <div className="absolute inset-0 bg-white bg-opacity-20 backdrop-blur-sm"></div>

      {/* جعبه مودال */}
      <div className="relative bg-white bg-opacity-80 backdrop-blur-md rounded-lg p-6 w-80 shadow-lg z-10">
        <h2 className="text-lg font-semibold mb-4 text-center">حذف تیکت</h2>
        <p className="text-sm mb-6 text-center">
          آیا مطمئن هستید که می‌خواهید تیکت{" "}
          <span className="font-semibold">{ticket.title}</span> را حذف کنید؟
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
            onClick={onClose}
            className="bg-gray-300 text-black px-4 py-2 rounded hover:opacity-90"
          >
            لغو
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteTicketModal;
