'use client'

import { useEffect, useState } from "react"
import { dashboardService } from "@/service/dashboard-service"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Users, CalendarDays, CheckCircle2, UserX, TrendingUp, Building2, CalendarRange, Activity } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { EmpresaMetrica } from "@/types/estatistica/empresaMetrica"

export default function Projetos() {
    const [metricas, setMetricas] = useState<EmpresaMetrica[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        dashboardService.getMetricasEmpresas()
        .then(setMetricas)
        .finally(() => setLoading(false))
    }, [])

    const getThemeColor = (total: number) => {
        if (total > 2000) return { 
            border: "border-purple-500", 
            iconBg: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
            shadow: "hover:shadow-purple-500/20"
        };
        if (total > 500) return { 
            border: "border-indigo-500", 
            iconBg: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300",
            shadow: "hover:shadow-indigo-500/20"
        };
        return { 
            border: "border-slate-400", 
            iconBg: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
            shadow: "hover:shadow-slate-500/20"
        };
    }

    if (loading) return <div className="grid gap-6 md:grid-cols-3"><Skeleton className="h-[350px] w-full rounded-2xl" /><Skeleton className="h-[350px] w-full rounded-2xl" /><Skeleton className="h-[350px] w-full rounded-2xl" /></div>

    return (
        <div className="space-y-8 p-2">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-extrabold tracking-tight flex items-center gap-3 text-slate-900 dark:text-slate-100">
                        <div className="p-3 bg-blue-600 rounded-xl shadow-lg shadow-blue-600/20">
                            <TrendingUp className="h-6 w-6 text-white" />
                        </div>
                        Dashboard de Leads
                    </h2>
                    <p className="text-muted-foreground mt-1 ml-1">Visão geral em tempo real de todas as operações.</p>
                </div>
                
                <Badge variant="outline" className="px-4 py-2 text-sm font-medium bg-white dark:bg-slate-950 shadow-sm border-slate-200 dark:border-slate-800 gap-2 self-start md:self-center">
                    <Building2 className="h-4 w-4 text-slate-500" />
                    {metricas.length} Empresas Conectadas
                </Badge>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
                {metricas.map((item) => {
                    const theme = getThemeColor(item.total_leads);
                    const percentQualificado = item.total_leads > 0 ? Math.round((item.leads_qualificados / item.total_leads) * 100) : 0
                    const percentOff = item.total_leads > 0 ? Math.round((item.agentes_off / item.total_leads) * 100) : 0
                    
                    return (
                    <Card key={item.empresa} className={cn(
                        "relative overflow-hidden transition-all duration-300 hover:-translate-y-1 group border-t-[6px] rounded-2xl", 
                        theme.border, theme.shadow
                    )}>
                        
                        <CardHeader className="pb-2 pt-6 px-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex gap-3 items-center">
                                <div className={cn("p-3 rounded-xl transition-colors", theme.iconBg)}>
                                    <Users className="h-5 w-5" />
                                </div>
                                <div className="space-y-0.5">
                                    <CardTitle className="text-lg font-bold line-clamp-1 leading-none" title={item.empresa}>
                                        {item.empresa}
                                    </CardTitle>
                                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                        Base Total
                                    </div>
                                </div>
                            </div>
                            {item.leads_hoje > 0 && (
                                <div className="flex flex-col items-end">
                                    <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold shadow-md shadow-emerald-500/20 animate-pulse px-2.5 py-0.5 border-0">
                                        <Activity className="w-3 h-3 mr-1" />
                                        +{item.leads_hoje}
                                    </Badge>
                                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold mt-1">Hoje</span>
                                </div>
                            )}
                        </div>
                        
                        <div className="flex items-baseline gap-1 mt-2">
                            <span className="text-4xl font-black tracking-tighter text-slate-800 dark:text-slate-100">
                                    {item.total_leads.toLocaleString()}
                            </span>
                            <span className="text-sm font-semibold text-slate-400 dark:text-slate-500 mb-1">leads</span>
                        </div>
                        </CardHeader>
                        
                        <CardContent className="px-4 pb-6 pt-2 flex flex-col gap-3">
                        
                        <div className="grid grid-cols-2 gap-3 h-28">
                            
                            <div className="bg-emerald-50/80 dark:bg-emerald-950/20 p-3 rounded-xl border border-emerald-100 dark:border-emerald-900/50 flex flex-col justify-between group-hover:bg-emerald-100/50 transition-colors">
                                <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-bold text-[10px] uppercase tracking-wider">
                                    <div className="bg-emerald-200 dark:bg-emerald-800 p-1 rounded-md">
                                        <CheckCircle2 className="w-3 h-3" />
                                    </div>
                                    Qualificado
                                </div>
                                <div>
                                    <span className="text-2xl font-extrabold text-emerald-800 dark:text-emerald-300 block">
                                        {item.leads_qualificados.toLocaleString()}
                                    </span>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Progress value={percentQualificado} className="h-1.5 bg-emerald-200 dark:bg-emerald-900" indicatorClassName="bg-emerald-500" />
                                        <span className="text-[10px] font-bold text-emerald-600">{percentQualificado}%</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-amber-50/80 dark:bg-amber-950/20 p-3 rounded-xl border border-amber-100 dark:border-amber-900/50 flex flex-col justify-between group-hover:bg-amber-100/50 transition-colors">
                                <div className="flex items-center gap-1.5 text-amber-700 dark:text-amber-400 font-bold text-[10px] uppercase tracking-wider">
                                    <div className="bg-amber-200 dark:bg-amber-800 p-1 rounded-md">
                                        <UserX className="w-3 h-3" />
                                    </div>
                                    Agente Off
                                </div>
                                <div>
                                    <span className="text-2xl font-extrabold text-amber-800 dark:text-amber-300 block">
                                        {item.agentes_off.toLocaleString()}
                                    </span>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Progress value={percentOff} className="h-1.5 bg-amber-200 dark:bg-amber-900" indicatorClassName="bg-amber-500" />
                                        <span className="text-[10px] font-bold text-amber-600">{percentOff}%</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 h-16">
                            <div className="bg-blue-50/50 dark:bg-blue-950/10 rounded-xl flex items-center px-3 border border-blue-100/50 dark:border-blue-900/20">
                                <div className="mr-3 bg-blue-100 dark:bg-blue-900/40 p-1.5 rounded-lg">
                                    <CalendarRange className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase text-blue-600/70 font-bold leading-none mb-0.5">Mês</p>
                                    <p className="text-lg font-black text-blue-700 dark:text-blue-300 leading-none">+{item.leads_mes}</p>
                                </div>
                            </div>

                            <div className="bg-cyan-50/50 dark:bg-cyan-950/10 rounded-xl flex items-center px-3 border border-cyan-100/50 dark:border-cyan-900/20">
                                <div className="mr-3 bg-cyan-100 dark:bg-cyan-900/40 p-1.5 rounded-lg">
                                    <CalendarDays className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase text-cyan-600/70 font-bold leading-none mb-0.5">Semana</p>
                                    <p className="text-lg font-black text-cyan-700 dark:text-cyan-300 leading-none">+{item.leads_semana}</p>
                                </div>
                            </div>
                        </div>

                        </CardContent>
                    </Card>
                    )
                })}
            </div>
        </div>
    )
}