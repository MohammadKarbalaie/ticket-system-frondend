import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import { Providers } from "@/components/shared/Providers";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

const vazir = Vazirmatn({
  variable: "--font-vazir",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "سیستم اتوماسیون اداری",
  description: "قدرت گرفته از Next.js ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${vazir.variable} antialiased`}>
        <AuthProvider>
          <Providers>{children}</Providers>
        </AuthProvider>
      </body>
    </html>
  );
}
