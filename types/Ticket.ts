import { Category } from "./Category";
import { User } from "./User";
import { Department } from "./Department";

export interface Ticket {
  _id: string;
  ticketNumber: string;
  title: string;
  status: string;
  priority: string; // اضافه کردن priority
  category: Category; // category به صورت آبجکت
  creator: User; // creator به صورت آبجکت
  assignedDepartment?: string; // assignedDepartment به صورت آبجکت
  description: string;
  createdAt: string;
  updatedAt: string;
   department: Department; 
}



export interface Tickets {
  _id: string;
  ticketNumber: string;
  title: string;
  status: string;
  priority: string;
  category: Category;
  creator: User;
  department: Department; 
  createdAt: string;
  updatedAt: string;
  description : string
}

// export interface Ticket {
//   _id: string;
//   ticketNumber: string;
//   title: string;
//   status: string;
//   priority: string;
//   category: Category;       // دسته‌بندی به صورت آبجکت
//   creator: User;            // کاربر سازنده تیکت
//   assignedDepartment: Department; // 👈 اصلاح شد (آبجکت کامل، نه string)
//   description: string;
//   createdAt: string;
//   updatedAt: string;
// }