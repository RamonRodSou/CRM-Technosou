"use client"

import { useEffect, useState, useRef } from "react"
import { TrendingUp, Building2 } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, LabelList } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { api as supabase } from "@/service/api"
import { stringUtil } from "@/lib/stringUtils"
import { colorUtils } from "@/lib/colorUtils"

const chartConfig = {
    leads: { label: "Leads", color: "hsl(var(--primary))" },
} satisfies ChartConfig

interface ChartData {
    responsible: string
    leads: number
    fill?: string
}

interface CompanyOption {
  table_name: string
  friendly_name: string
}

export function ResponsibleChart() {
    const [data, setData] = useState<ChartData[]>([])
    const [companies, setCompanies] = useState<CompanyOption[]>([])
    const [selectedTable, setSelectedTable] = useState<string | null>(null)
    const [period, setPeriod] = useState<"week" | "month" | "all">("month")
    const [isLoading, setIsLoading] = useState<boolean>(false)
  
    const abortControllerRef = useRef<AbortController | null>(null)

    useEffect(() => {
            let mounted = true;
            async function loadCompanies() {
            const { data: result, error } = await supabase.rpc('get_available_companies')
            if (!mounted) return;
            if (error) { console.error("Erro empresas:", error); return; }
            if (result && result.length > 0) {
                setCompanies(result)
                setSelectedTable((prev) => prev || result[0].table_name)
            }
            }
            loadCompanies()
            return () => { mounted = false }
        }, [])

    useEffect(() => {
        if (!selectedTable) return

        if (abortControllerRef.current) abortControllerRef.current.abort()
        const controller = new AbortController()
        abortControllerRef.current = controller

        const timeoutId = setTimeout(async () => {
        setIsLoading(true)
        setData([]) 

        try {
            const { data: result, error } = await supabase.rpc('get_leads_by_responsible_dynamic', {
                target_table: selectedTable,
                period: period
            })

            if (error) throw error
            if (controller.signal.aborted) return

            const formatted = (result || [])
            .map((item: any, index: number) => ({
                responsible: item.responsible ? item.responsible.trim() : stringUtil.EMPTY,
                leads: Number(item.count),
                fill: colorUtils[index % colorUtils.length]
            }))
            .filter((item: ChartData) => {
                const name = item.responsible.toUpperCase();
                return (
                    name.length > 1 && 
                    /[a-zA-Z]/.test(name) &&
                    !['NULL', 'UNDEFINED'].includes(name)
                );
            });

            setData(formatted)
        } catch (error: any) {
            if (error.name !== 'AbortError') console.error("Erro dados:", error)
        } finally {
            if (!controller.signal.aborted) setIsLoading(false)
        }
        }, 300)

        return () => { clearTimeout(timeoutId); controller.abort() }
    }, [selectedTable, period])

    const totalLeads = data.reduce((acc, curr) => acc + curr.leads, 0)

    const dynamicHeight = Math.max(data.length * 50, 350);

    return (
        <Card className="col-span-full flex flex-col">
        <CardHeader className="pb-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
                <CardTitle>Performance por Responsável</CardTitle>
                <CardDescription>Ranking de atribuição de leads.</CardDescription>
            </div>
            <div className="flex flex-wrap items-center gap-2">
                <Select value={selectedTable || stringUtil.EMPTY} onValueChange={setSelectedTable}>
                <SelectTrigger className="w-[180px] h-8 text-xs"><SelectValue placeholder="Empresa" /></SelectTrigger>
                <SelectContent>
                    {companies.map((company) => (
                    <SelectItem key={company.table_name} value={company.table_name}>{company.friendly_name}</SelectItem>
                    ))}
                </SelectContent>
                </Select>
                <Select value={period} onValueChange={(val) => setPeriod(val as any)}>
                <SelectTrigger className="w-[110px] h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                    <SelectItem value="week">Esta Semana</SelectItem>
                    <SelectItem value="month">Este Mês</SelectItem>
                    <SelectItem value="all">Todo Período</SelectItem>
                </SelectContent>
                </Select>
            </div>
            </div>
        </CardHeader>

        <CardContent className="flex-1 pb-0 pt-4">
            {isLoading ? (
            <div className="h-[350px] w-full flex items-center justify-center text-muted-foreground text-sm">Carregando dados...</div>
            ) : data.length === 0 ? (
            <div className="h-[350px] w-full flex flex-col items-center justify-center text-muted-foreground text-sm gap-2">
                <Building2 className="h-8 w-8 opacity-20" />
                <p>Nenhum dado válido encontrado.</p>
            </div>
            ) : (
            <div className="w-full overflow-y-auto max-h-[600px] pr-4">
                <ChartContainer config={chartConfig} className="w-full" style={{ height: `${dynamicHeight}px` }}>
                    <BarChart 
                        accessibilityLayer 
                        data={data} 
                        layout="vertical" 
                        height={dynamicHeight}
                        margin={{ left: 0, right: 45, top: 0, bottom: 0 }} 
                        barSize={32}
                    >
                    <CartesianGrid horizontal={false} />
                    <YAxis 
                        dataKey="responsible" 
                        type="category" 
                        tickLine={false} 
                        tickMargin={10} 
                        axisLine={false} 
                        width={220} 
                        className="text-xs font-medium" 
                        tickFormatter={(value) => value.slice(0, 40)} 
                    />
                    <XAxis dataKey="leads" type="number" hide />
                    <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                    <Bar dataKey="leads" layout="vertical" radius={5}>
                        <LabelList dataKey="leads" position="right" offset={8} className="fill-foreground text-xs font-bold" fontSize={12} />
                    </Bar>
                    </BarChart>
                </ChartContainer>
            </div>
            )}
        </CardContent>

        <CardFooter className="flex-col gap-2 text-sm p-6 pt-0 mt-auto items-start border-t pt-4">
            {data.length > 0 && (
            <div className="flex items-center gap-2 font-medium leading-none text-muted-foreground">
                Total de {totalLeads} leads válidos no período <TrendingUp className="h-4 w-4 text-emerald-500" />
            </div>
            )}
        </CardFooter>
        </Card>
    )
}