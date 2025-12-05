import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/navigation/Header";
import { Footer } from "@/components/navigation/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "MedLink | Find Doctors & Hospitals",
  description:
    "Discover nearby doctors and hospitals by specialization, location, and experience.",
};

import { AuthProvider } from "@/context/AuthContext";
import { DoctorAccessControl } from "@/components/auth/DoctorAccessControl";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} bg-slate-50 text-slate-900`}>
        <AuthProvider>
          <Header />
          <DoctorAccessControl />
          <main>{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
