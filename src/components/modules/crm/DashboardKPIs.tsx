"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { dashboardService } from "@/service/dashboard-service"
import { Users, CheckCircle2, AlertTriangle, Database } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

export function DashboardKPIs() {
    const [stats, setStats] = useState({
        total: 0,
        hoje: 0,
        qualificados: 0,
        parados: 0,
        empresas: 0
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        dashboardService.getMetricasEmpresas()
        .then((data) => {
            const summary = data.reduce((acc, curr) => ({
                total: acc.total + curr.total_leads,
                hoje: acc.hoje + curr.leads_hoje,
                qualificados: acc.qualificados + curr.leads_qualificados,
                parados: acc.parados, 
                empresas: acc.empresas + 1
            }), { total: 0, hoje: 0, qualificados: 0, parados: 0, empresas: 0 })
            
            setStats(summary)
        })
        .finally(() => setLoading(false))
    }, [])

    if (loading) {
        return <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[1,2,3,4].map(i => <Skeleton key={i} className="h-32 w-full rounded-xl" />)}
        </div>
    }

    const taxaConversao = stats.total > 0 ? ((stats.qualificados / stats.total) * 100).toFixed(1) : "0.0"

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            
            <Card className="border-l-4 border-l-blue-500 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Total de Leads</CardTitle>
                    <Users className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.total.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">
                        <span className="text-emerald-600 font-bold">+{stats.hoje}</span> novos hoje
                    </p>
                </CardContent>
            </Card>

            <Card className="border-l-4 border-l-emerald-500 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Taxa de Qualificação</CardTitle>
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">{taxaConversao}%</div>
                    <p className="text-xs text-muted-foreground">{stats.qualificados.toLocaleString()} qualificados</p>
                </CardContent>
            </Card>

            <Card className="border-l-4 border-l-red-500 bg-red-50/50 dark:bg-red-950/10 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-bold text-red-600 dark:text-red-400">Parados (+5h)</CardTitle>
                    <AlertTriangle className="h-4 w-4 text-red-500 animate-pulse" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-red-700 dark:text-red-400">{stats.parados.toLocaleString()}</div>
                    <p className="text-xs text-red-600/80 font-medium">Ação necessária urgente</p>
                </CardContent>
            </Card>

            <Card className="border-l-4 border-l-slate-500 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Bancos Conectados</CardTitle>
                    <Database className="h-4 w-4 text-slate-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.empresas}</div>
                    <p className="text-xs text-muted-foreground">Todos operacionais</p>
                </CardContent>
            </Card>
        </div>
    )
}