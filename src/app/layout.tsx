import type { Metadata } from "next";
import { Assistant } from "next/font/google";
import "./globals.css";
import { getTexts } from "@/lib/site-texts";
import { CartProvider } from "@/lib/cart-context";
import { ToastProvider } from "@/lib/toast-context";

const assistant = Assistant({
  subsets: ["hebrew", "latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-assistant",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  try {
    const t = await getTexts();
    return { title: t["seo.title"], description: t["seo.description"] };
  } catch {
    return { title: "פרפר סגול · חנות" };
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl" className={assistant.variable}>
      <body>
        <ToastProvider>
          <CartProvider>{children}</CartProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
