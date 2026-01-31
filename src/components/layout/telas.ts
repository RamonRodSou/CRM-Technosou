import { 
    LayoutDashboard, 
    Users, 
    MessageSquare, 
    BarChart3, 
    Settings, 
    Zap 
  } from "lucide-react";
  
  export const telas = [
      { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard", color: "text-sky-500" },
      { label: "projetos", icon: Zap, href: "/dashboard/projetos", color: "text-yellow-500" }, 
      { label: "CRM / Leads", icon: Users, href: "/dashboard/crm", color: "text-pink-700" },
      { label: "Mensagens", icon: MessageSquare, href: "/dashboard/mensagens", color: "text-orange-700" },
      { label: "Financeiro", icon: BarChart3, href: "/dashboard/financeiro", color: "text-emerald-500" },
      { label: "Configurações", icon: Settings, href: "/dashboard/configuracoes", color: "text-gray-500" },
  ]; 