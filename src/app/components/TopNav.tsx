"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
export function TopNav() {
    const pathname = usePathname();

    return (
        <nav className="w-full flex justify-center py-4">
            <Link href="/">
                <h2
                    className={`text-xl font-semibold mx-4 ${
                        pathname === "/" ? "border-b-2 border-black" : ""
                    }`}
                >
                    In production
                </h2>
            </Link>
            <p className="font-bold">|</p>
            <Link href="/past-production">
                <h2
                    className={`text-xl font-semibold mx-4 ${
                        pathname === "/past-production" ? "border-b-2 border-black" : ""
                    }`}
                >
                    Past production
                </h2>
            </Link>
        </nav>
    );
}
