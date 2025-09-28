"use client";

import { useForm } from "react-hook-form";
import apiClient from "@/services/client";
import { urls } from "@/services/urls";
import { setTokens } from "@/utils/token";
import { errorHandler } from "@/utils/error-handler";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

type LoginFormInputs = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();

  const router = useRouter();

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      const response = await apiClient.post(urls.auth.signIn, data);

      const { accessToken, user } = response.data;

      if (accessToken) {
        setTokens(accessToken, user);
        toast.success(`خوش آمدید ${user?.fname || ""} 👋`);
        router.push("/dashboard");
      } else {
        toast.error("ورود ناموفق بود");
      }
    } catch (error: any) {
      errorHandler(error);
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-500 to-blue-500"
      dir="rtl"
    >
      <div className="bg-white shadow-lg rounded-lg w-full max-w-md p-8">
        <h2 className="text-2xl font-bold text-center text-purple-600 mb-6">
          ورود به سیستم
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              ایمیل
            </label>
            <input
              type="email"
              {...register("email", { required: "ایمیل الزامی است" })}
              className="w-full rounded-md border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 text-black"
              placeholder="ایمیل خود را وارد کنید"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              رمز عبور
            </label>
            <input
              type="password"
              {...register("password", { required: "رمز عبور الزامی است" })}
              className="w-full rounded-md border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 text-black"
              placeholder="********"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 rounded-md font-bold hover:opacity-90 transition"
          >
            ورود
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          حساب کاربری ندارید؟{" "}
          <a href="/auth?type=signup" className="text-purple-600 font-bold">
            ثبت‌نام
          </a>
        </p>
      </div>
    </div>
  );
}
