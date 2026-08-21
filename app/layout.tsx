import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Imagen Nano Banana Image Studio v2",
  description:
    "High-end luxury photorealistic image generation studio powered by Gemini 3.1 Flash Image Nano Banana.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-amber-500 selection:text-black">
        {children}
      </body>
    </html>
  );
}
