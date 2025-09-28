"use client";

import { Header } from "@/components/shared/header";
import { Sidebar } from "@/components/shared/sidebar";
import {
  Info,
  ListChecks,
  ArrowLeft,
  SendHorizonal,
  User as UserIcon,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import apiClient from "@/services/client";
import { urls } from "@/services/urls";
import { Ticket } from "@/types/Ticket";
import { User } from "@/types/User";

interface Message {
  _id: string;
  body: string;
  sender?: User; // optional برای جلوگیری از خطا
  createdAt: string;
}

const Ticketid = () => {
  const params = useParams() as { id?: string | string[] | undefined };
  const rawId = params?.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;

  const router = useRouter();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [profile, setProfile] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // اسکرول خودکار به آخر پیام‌ها
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchTicket = async () => {
      try {
        const res = await apiClient.get(`${urls.tickets.getAll}/${id}`);
        setTicket(res.data);
      } catch (error) {
        console.error("Error fetching ticket:", error);
      }
    };

    const fetchProfile = async () => {
      try {
        const res = await apiClient.get(urls.auth.getProfile);
        setProfile(res.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    const fetchMessages = async () => {
      try {
        const res = await apiClient.get(urls.messages.getById(id));
        setMessages(res.data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    Promise.all([fetchTicket(), fetchProfile(), fetchMessages()]).finally(() =>
      setLoading(false)
    );
  }, [id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!id || !newMessage.trim()) return;

    try {
      await apiClient.post(urls.messages.create, {
        ticketId: id,
        body: newMessage,
      });

      setNewMessage("");
      // دوباره پیام‌ها را fetch می‌کنیم تا sender پر باشد
      const res = await apiClient.get(urls.messages.getById(id));
      setMessages(res.data);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  if (loading) {
    return <p className="p-6">در حال بارگذاری...</p>;
  }

  if (!ticket) {
    return <p className="p-6 text-red-500">تیکت یافت نشد.</p>;
  }

  const handleBack = () => {
    if (
      document.referrer &&
      !document.referrer.includes(window.location.href)
    ) {
      window.history.back();
    } else {
      router.push("/tickets");
    }
  };

  const priorityColors: Record<string, string> = {
    بالا: "bg-red-500 text-white",
    متوسط: "bg-yellow-500 text-black",
    پایین: "bg-green-500 text-white",
  };

  const statusColors: Record<string, string> = {
    "در حال بررسی": "bg-blue-500 text-white",
    "تایید شده": "bg-green-500 text-white",
    باز: "bg-gray-500 text-white",
  };

  return (
    <div className="flex text-black">
      <Sidebar />
      <div className="flex-1 p-6">
        <Header />

        {/* دکمه بازگشت */}
        <div className="flex justify-end my-2">
          <button
            className="py-1 px-4 bg-gray-400 text-white rounded-lg hover:bg-gray-600 cursor-pointer"
            onClick={handleBack}
          >
            بازگشت
          </button>
        </div>

        {/* ساختار دو ستونی */}
        <div className="grid grid-cols-5 gap-4 py-4">
          {/* ستون سمت راست */}
          <div className="col-span-3 flex flex-col gap-4">
            {/* اطلاعات تیکت */}
            <div className="bg-white rounded-md shadow">
              <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold p-3 rounded-t-md flex items-center gap-2">
                <Info className="w-5 h-5" />
                اطلاعات تیکت
              </div>
              <div className="p-4 grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <p className="py-1 font-semibold text-lg my-4">
                    شماره تیکت: {ticket.ticketNumber}
                  </p>
                  <p className="py-1 font-semibold text-lg my-4">
                    عنوان: {ticket.title}
                  </p>
                  <p className="py-1 font-semibold text-lg my-4">
                    ایجاد کننده: {ticket.creator?.fname || "-"}
                  </p>
                  <p className="py-1 font-semibold text-lg my-4">
                    ایمیل: {ticket.creator?.email || "-"}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="py-1 font-semibold text-lg my-4">
                    دسته‌بندی: {ticket.category?.name || "-"}
                  </p>
                  <p className="py-1 font-semibold text-lg my-4">
                    اولویت:{" "}
                    <span
                      className={`px-2 py-1 rounded font-semibold text-lg ${
                        priorityColors[ticket.priority] ||
                        "bg-gray-300 text-black"
                      }`}
                    >
                      {ticket.priority}
                    </span>
                  </p>
                  <p className="py-1 my-4 font-semibold text-lg">
                    وضعیت:{" "}
                    <span
                      className={`px-2 py-2 rounded font-semibold text-lg ${
                        statusColors[ticket.status] || "bg-gray-300 text-black"
                      }`}
                    >
                      {ticket.status}
                    </span>
                  </p>
                </div>
              </div>
              <div className="p-4 border-t text-sm">
                <p className="font-semibold mb-2">توضیحات:</p>
                <p>{ticket.description}</p>
                <p className="text-xs text-gray-400 mt-2">
                  آخرین بروزرسانی:{" "}
                  {ticket.updatedAt
                    ? new Date(ticket.updatedAt).toLocaleString("fa-IR")
                    : "-"}
                </p>
              </div>
            </div>

            {/* گفتگو */}
            <div className="bg-white rounded-md shadow flex flex-col h-[500px]">
              <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold p-3 rounded-t-md flex items-center gap-2">
                <UserIcon className="w-5 h-5" />
                گفتگو
              </div>
              <div className="flex-1 p-4 space-y-4 text-sm overflow-y-auto">
                {messages.length === 0 && (
                  <p className="text-gray-400 text-center">
                    هنوز پیامی وجود ندارد.
                  </p>
                )}
                {messages.map((msg) => {
                  const isMine = msg.sender?._id === profile?._id;
                  return (
                    <div
                      key={msg._id}
                      className={`flex ${
                        isMine ? "justify-start" : "justify-end"
                      }`}
                    >
                      <div
                        className={`max-w-xs p-3 rounded-md ${
                          isMine
                            ? "bg-purple-500 text-white rounded-br-none"
                            : "bg-gray-100 text-black rounded-bl-none"
                        }`}
                      >
                        <p className="font-semibold text-xs">
                          {isMine ? "شما" : msg.sender?.fname || "ناشناس"}
                        </p>
                        <p>{msg.body}</p>
                        <p className="text-[10px] text-gray-400 mt-1">
                          {msg.createdAt
                            ? new Date(msg.createdAt).toLocaleString("fa-IR")
                            : "-"}
                        </p>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
              <div className="border-t p-4 flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSendMessage();
                  }}
                  placeholder="پیام خود را بنویسید..."
                  className="flex-1 border rounded-md p-2 text-sm"
                />
                <button
                  onClick={handleSendMessage}
                  className="bg-purple-600 text-white px-4 rounded-md flex items-center gap-1 hover:bg-purple-700"
                >
                  <SendHorizonal className="w-4 h-4" />
                  ارسال پیام
                </button>
              </div>
              <p className="text-xs text-gray-400 px-4 pb-2">
                پیام داخل (فقط برای پشتیبان قابل مشاهده)
              </p>
            </div>
          </div>

          {/* ستون سمت چپ */}
          <div className="col-span-2 flex flex-col gap-4">
            {/* مدیریت تیکت */}
            <div className="bg-white rounded-md shadow">
              <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold p-3 rounded-t-md flex items-center gap-2">
                <ListChecks className="w-5 h-5" />
                مدیریت تیکت
              </div>
              <div className="p-4 flex flex-col gap-3">
                <div>
                  <label className="block mb-1 text-sm">وضعیت</label>
                  <select className="w-full border rounded p-2">
                    <option>{ticket.status}</option>
                    <option>باز</option>
                    <option>در حال بررسی</option>
                    <option>بسته شده</option>
                    <option>حل شده</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-1 text-sm">محول کردن به</label>
                  <select className="w-full border rounded p-2">
                    <option>
                      {profile
                        ? `${profile.fname} ${profile.lname}`
                        : "کاربر لاگین شده"}
                    </option>
                    <option>پشتیبان دوم (support2)</option>
                    <option>پشتیبان اول (support1)</option>
                  </select>
                </div>
                <button className="bg-green-600 text-white py-2 rounded-md hover:bg-green-700">
                  بروزرسانی وضعیت
                </button>
              </div>
            </div>

            {/* اطلاعات اضافی */}
            <div className="bg-white rounded-md shadow">
              <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold p-3 rounded-t-md flex items-center gap-2">
                <ArrowLeft className="w-5 h-5" />
                اطلاعات اضافی
              </div>
              <div className="p-4 text-sm space-y-2">
                <p className="font-bold">راهنمای وضعیت‌ها:</p>
                <ul className="space-y-1">
                  <li>
                    <span className="px-2 py-1 rounded bg-yellow-400 text-xs">
                      در حال بررسی
                    </span>{" "}
                    در حال بررسی توسط پشتیبان
                  </li>
                  <li>
                    <span className="px-2 py-1 rounded bg-blue-400 text-xs">
                      منتظر کاربر
                    </span>{" "}
                    منتظر پاسخ کاربر
                  </li>
                  <li>
                    <span className="px-2 py-1 rounded bg-green-500 text-xs">
                      حل شده
                    </span>{" "}
                    مشکل رفع شده
                  </li>
                  <li>
                    <span className="px-2 py-1 rounded bg-red-500 text-xs">
                      بسته شده
                    </span>{" "}
                    تیکت بسته شده
                  </li>
                </ul>
                <p className="text-xs text-gray-500 mt-3">
                  نکته: برای دریافت پاسخ سریع‌تر، پیام‌های خود را واضح و کامل
                  بنویسید.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ticketid;
