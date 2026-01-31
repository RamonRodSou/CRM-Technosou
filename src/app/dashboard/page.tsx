import { ActivitiesList } from "@/components/modules/crm/ActivitiesList"
import { DashboardKPIs } from "@/components/modules/crm/DashboardKPIs"
import { LeadsChart } from "@/components/modules/crm/leads-chart"

export default function DashboardPage() {
    return (
        <div className="flex flex-col gap-6 p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto">
            <DashboardKPIs />
            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-7 h-auto lg:h-[650px]">
                
                <div className="md:col-span-2 lg:col-span-5 h-full">
                    <LeadsChart />
                </div>

                <div className="md:col-span-1 lg:col-span-2 h-full">
                    <ActivitiesList />
                </div>

            </div>
        </div>
    )
}