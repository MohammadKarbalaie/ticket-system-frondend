import Cookies from "js-cookie";
import apiClient, { setAuthHeader } from "./../services/client";
import { urls } from "@/services/urls";

const ACCESS_TOKEN_KEY = "accessToken";
const USER_KEY = "user";

/**
 * ذخیره توکن و کاربر
 */
export const setTokens = (accessToken: string, user?: any) => {
  Cookies.set(ACCESS_TOKEN_KEY, accessToken, { expires: 1 / 24 }); // ۱ ساعت

  if (user) {
    Cookies.set(USER_KEY, JSON.stringify(user), { expires: 7 });
  }

  setAuthHeader(accessToken);
};

/**
 * دریافت اکسس توکن
 */
export const getAccessToken = (): string | undefined => {
  return Cookies.get(ACCESS_TOKEN_KEY);
};

/**
 * دریافت اطلاعات کاربر
 */
export const getUser = (): any | null => {
  const user = Cookies.get(USER_KEY);
  return user ? JSON.parse(user) : null;
};

/**
 * حذف توکن و کاربر
 */
export const removeTokens = () => {
  Cookies.remove(ACCESS_TOKEN_KEY, { path: "/" });
  Cookies.remove(USER_KEY, { path: "/" });
  setAuthHeader(null);
};


function base64UrlDecode(str: string) {
  // تبدیل Base64URL به Base64 معمولی
  str = str.replace(/-/g, "+").replace(/_/g, "/");
  // padding اضافه کن
  const pad = str.length % 4;
  if (pad) str += "=".repeat(4 - pad);
  return atob(str);
}

/**
 * چک کردن منقضی بودن توکن
 */
const isAccessTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(base64UrlDecode(token.split(".")[1]));
    const expirationTime = payload.exp * 1000;
    return expirationTime < Date.now();
  } catch (error) {
    console.error("[Token] Error decoding token:", error);
    return true;
  }
};

/**
 * رفرش کردن اکسس توکن
 */
export const refreshAccessToken = async (): Promise<string | null> => {
  const oldAccessToken = getAccessToken();
  if (!oldAccessToken) {
    console.log("[Token] No access token available for refresh");
    return null;
  }

  try {
    const response = await apiClient.post(
      urls.auth.refreshToken,
      {},
      {
        headers: {
          Authorization: `Bearer ${oldAccessToken}`,
        },
      }
    );

    const data = response.data;

    if (data.accessToken) {
      const newAccessToken = data.accessToken;
      Cookies.set(ACCESS_TOKEN_KEY, newAccessToken, { expires: 1 / 24 });
      setAuthHeader(newAccessToken);

      return newAccessToken;
    }

    return null;
  } catch (error) {
    console.error("[Token] Error refreshing token:", error);
    removeTokens();
    return null;
  }
};

/**
 * گرفتن اکسس توکن معتبر (اگر منقضی شده بود، رفرش می‌کنه)
 */
export const getValidAccessToken = async (): Promise<string | null> => {
  const accessToken = getAccessToken();

  if (accessToken && !isAccessTokenExpired(accessToken)) {
    setAuthHeader(accessToken);
    return accessToken;
  }

  console.log("[Token] Access token expired or unavailable. Refreshing...");
  const newAccessToken = await refreshAccessToken();
  return newAccessToken;
};

/**
 * دریافت پروفایل کاربر جاری از بک‌اند
 */
export const fetchUserProfile = async (): Promise<any | null> => {
  try {
    const token = await getValidAccessToken();
    if (!token) return null;

    const response = await apiClient.get(urls.auth.getProfile);
    const user = response.data;

    Cookies.set(USER_KEY, JSON.stringify(user), { expires: 7 });

    return user;
  } catch (error) {
    console.error("[Token] Error fetching user profile:", error);
    return null;
  }
};
