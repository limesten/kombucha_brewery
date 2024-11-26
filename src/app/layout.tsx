import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { TopNav } from "./TopNav";
import {
    ClerkProvider,
    SignInButton,
    SignedIn,
    SignedOut,
    UserButton,
} from "@clerk/nextjs";

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
        <ClerkProvider>
            <html lang="en">
                <body>
                    <div className="container mx-auto max-w-[800px]">
                        <SignedIn>
                            <TopNav />
                        </SignedIn>
                        {children}
                        <Toaster position="top-right" />
                    </div>
                </body>
            </html>
        </ClerkProvider>
    );
}
