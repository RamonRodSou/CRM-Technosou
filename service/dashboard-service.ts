import { EmpresaMetrica } from "@/types/estatistica/empresaMetrica";
import { api } from "./api"
import { ActivityFeed } from "@/types/estatistica/activityFeed";

export const dashboardService = {
    getMetricasEmpresas: async () => {
        const { data, error } = await api.rpc('dashboard_empresas');
        
        if (error) {
            console.error("Erro ao carregar dashboard:", error);
            throw error;
        }
        
        return data as EmpresaMetrica[];
    },

    getRecentActivity: async () => {
        const { data, error } = await api.rpc('get_recent_leads_feed');
        if (error) {
            console.error("Erro feed:", error);
            return [];
        }
        return data as ActivityFeed[];
    }
}