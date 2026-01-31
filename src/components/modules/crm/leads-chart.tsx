"use client"

import { useEffect, useState } from "react"
import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"

import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import {
	ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart"
import { dashboardService, EmpresaMetrica } from "@/service/dashboard-service"
import { Skeleton } from "@/components/ui/skeleton"

const chartConfig = {
	total_leads: {
		label: "Total",
		color: "hsl(var(--primary))",
	},
	leads_qualificados: {
		label: "Qualificados",
		color: "#10b981",
	},
} satisfies ChartConfig

export function LeadsChart() {
	const [data, setData] = useState<EmpresaMetrica[]>([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		dashboardService.getMetricasEmpresas()
		.then((dados) => {
			setData(dados.slice(0, 10)) 
		})
		.finally(() => setLoading(false))
	}, [])

	if (loading) return <Skeleton className="h-[350px] w-full rounded-2xl" />

	return (
		<Card className="h-full flex flex-col">
		<CardHeader className="pb-2">
			<CardTitle className="text-lg">Performance por Projeto</CardTitle>
			<CardDescription>Volume total vs. qualificação.</CardDescription>
		</CardHeader>
		
		<CardContent className="flex-1 pb-0 min-h-0">
			<div className="h-full w-full min-h-[200px]">
				<ChartContainer config={chartConfig} className="h-full w-full">
				<BarChart 
					accessibilityLayer 
					data={data} 
 					barCategoryGap="10%" 
					margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
				>
					<CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-muted/40" />
					<XAxis
						dataKey="empresa"
						tickLine={false}
						tickMargin={10}
						axisLine={false}
						tickFormatter={(value) => value.slice(0, 5)} 
						className="text-[10px]"
						interval={0} 
					/>
					<YAxis 
						tickLine={false} 
						axisLine={false} 
						className="text-[10px]"
						width={35}
					/>
					<ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dashed" />} />
					
					<Bar dataKey="total_leads" fill="var(--color-total_leads)" radius={[4, 4, 0, 0]} />
					<Bar dataKey="leads_qualificados" fill="var(--color-leads_qualificados)" radius={[4, 4, 0, 0]} />
					
				</BarChart>
				</ChartContainer>
			</div>
		</CardContent>
		
		<CardFooter className="flex-col items-start gap-1 text-sm pt-2 pb-4 text-muted-foreground border-t bg-muted/5 mt-auto">
			<div className="flex gap-1.5 font-medium leading-none text-foreground">
				Tendência de alta de 5.2% <TrendingUp className="h-4 w-4 text-emerald-500" />
			</div>
		</CardFooter>
		</Card>
	)
}