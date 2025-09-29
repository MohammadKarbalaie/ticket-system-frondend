"use client";
import { List } from "lucide-react";
import { Ticket } from "@/types/Ticket";
import { TicketTable } from "./TicketTable";

interface TicketsListSectionProps {
  title: string;
  tickets: Ticket[];
  categoryBadge: string;
  statusColors: Record<string, string>;
  priorityColors: Record<string, string>;
  onEdit: (ticket: Ticket) => void;
  onDelete: (ticket: Ticket) => void;
  onRowClick?: (ticket: Ticket) => void;
}

export const TicketsListSection: React.FC<TicketsListSectionProps> = ({
  title,
  tickets,
  categoryBadge,
  statusColors,
  priorityColors,
  onEdit,
  onDelete,
  onRowClick,
}) => {
  return (
    <div className="col-span-2 border border-gray-400 rounded-lg overflow-hidden bg-white shadow">
      <div className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-4 py-3 font-semibold flex items-center gap-2">
        <List className="w-5 h-5" />
        {title}
      </div>
      <TicketTable
        tickets={tickets}
        categoryBadge={categoryBadge}
        statusColors={statusColors}
        priorityColors={priorityColors}
        onEdit={onEdit}
        onDelete={onDelete}
        onRowClick={onRowClick} // ← اینجا
      />
    </div>
  );
};
