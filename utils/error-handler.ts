import { AxiosError } from "axios";
import { toast } from "react-toastify";

export const errorHandler = (error: AxiosError) => {
  const appError = (error.response?.data as { error: string })?.error;
  if (typeof appError === "string") {
    toast.error(appError);
  } else if (typeof error.message === "string") {
    toast.error(error.message);
  }
};
