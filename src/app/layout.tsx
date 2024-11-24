import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { TopNav } from "./TopNav";

export const metadata: Metadata = {
    title: "Kombucha Brewery",
    description: "Master your craft",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body>
                <div className="container mx-auto max-w-[800px]">
                    <TopNav />
                    {children}
                    <Toaster position="top-right" />
                </div>
            </body>
        </html>
    );
}
