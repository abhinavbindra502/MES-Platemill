import "./globals.css";
import React from "react";

export const metadata = {
  title: "Plate Mill MES Dashboard",
  description: "Manufacturing Execution System Monitoring Dashboard for Plate Mill Operations",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-900 text-slate-100 min-h-screen">
        {children}
      </body>
    </html>
  );
}
