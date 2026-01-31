"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { dashboardService, ActivityFeed, EmpresaMetrica } from "@/service/dashboard-service"
import { Activity, Database, ArrowUpRight } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"

export function ActivitiesList() {
    const [leadsFeed, setLeadsFeed] = useState<ActivityFeed[]>([])
    const [activeTables, setActiveTables] = useState<EmpresaMetrica[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loadData = async () => {
            try {
                const [feed, metrics] = await Promise.all([
                    dashboardService.getRecentActivity(),
                    dashboardService.getMetricasEmpresas()
                ])
                setLeadsFeed(feed)
                setActiveTables(metrics.filter(m => m.leads_hoje > 0).sort((a,b) => b.leads_hoje - a.leads_hoje))
            } finally {
                setLoading(false)
            }
        }
        loadData()
    }, [])

    if (loading) return <Skeleton className="h-[400px] w-full" />

    return (
        <div className="grid gap-4 grid-rows-2 h-full min-h-[600px] lg:min-h-0">
            
            <Card className="flex flex-col h-full overflow-hidden max-h-[350px]">
                <CardHeader className="pb-3 bg-muted/20 border-b shrink-0">
                    <CardTitle className="text-sm font-bold flex items-center gap-2">
                        <Activity className="h-4 w-4 text-emerald-500" />
                        Entrada de Leads (Real-time)
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 min-h-0 p-0">
                    <div className="h-full overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-muted">
                        {leadsFeed.map((item, i) => (
                            <div key={i} className="flex items-start">
                                <span className="relative flex h-2.5 w-2.5 mr-4 mt-1.5 shrink-0">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                                </span>
                                
                                <div className="space-y-1 w-full">
                                    <div className="flex justify-between items-start">
                                        <p className="text-sm font-semibold leading-none text-foreground">{item.empresa}</p>
                                        <span className="text-[10px] text-muted-foreground whitespace-nowrap ml-2">
                                            {formatDistanceToNow(new Date(item.tempo), { addSuffix: true, locale: ptBR }).replace('cerca de ', '')}
                                        </span>
                                    </div>
                                    <p className="text-xs text-muted-foreground line-clamp-1">
                                        Status: <span className="text-emerald-600 font-medium">{item.status || 'Novo Lead'}</span>
                                    </p>
                                </div>
                            </div>
                        ))}
                        {leadsFeed.length === 0 && (
                            <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                                Nenhuma atividade recente.
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            <Card className="flex flex-col h-full overflow-hidden max-h-[350px]">
                <CardHeader className="pb-3 bg-muted/20 border-b shrink-0">
                    <CardTitle className="text-sm font-bold flex items-center gap-2">
                        <Database className="h-4 w-4 text-blue-500" />
                        Tabelas Atualizadas Hoje
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 min-h-0 p-0">
                    <div className="h-full overflow-y-auto p-0 scrollbar-thin">
                        {activeTables.map((table, i) => (
                            <div key={i} className="flex items-center justify-between p-4 border-b last:border-0 hover:bg-muted/30 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-xs shrink-0">
                                        {table.empresa.substring(0, 2).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium leading-none truncate max-w-[120px]" title={table.empresa}>{table.empresa}</p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {table.tabelas_contabilizadas.length} tabela(s)
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right shrink-0">
                                    <div className="flex items-center justify-end gap-1 text-emerald-600 font-bold text-xs bg-emerald-100 dark:bg-emerald-900/30 px-2 py-1 rounded-full">
                                        <ArrowUpRight className="h-3 w-3" />
                                        +{table.leads_hoje}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {activeTables.length === 0 && (
                            <div className="flex h-full items-center justify-center text-xs text-muted-foreground p-4">
                                Sem movimento hoje.
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}