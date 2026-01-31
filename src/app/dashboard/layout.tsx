'use client';

import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { useAuthStore } from "../../../store/auth-store";
import { useEffect } from "react";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {

    const { carregarUsuario } = useAuthStore();

    useEffect(() => {
        carregarUsuario()
    }, [carregarUsuario])

      return (
        <div className="h-full relative">
            <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-[80] bg-gray-900">
                <Sidebar />
            </div>

            <main className="md:pl-72 h-full bg-slate-50 dark:bg-slate-900">
                <Header />
                <div className="p-8 h-[calc(100vh-64px)] overflow-y-auto">
                {children}
                </div>
            </main>
        </div>
    )
}