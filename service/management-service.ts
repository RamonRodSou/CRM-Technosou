'use server'
import { SupabaseProject } from "@/types/auth/supabaseProjetct"

export async function listarMeusBancos(): Promise<SupabaseProject[]> {
    const token = process.env.SUPABASE_ACCESS_TOKEN

    if (!token) {
        throw new Error('SUPABASE_ACCESS_TOKEN não configurado')
    }

    try {
        const response = await fetch('https://api.supabase.com/v1/projects', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        next: { revalidate: 3600 }
        })

        if (!response.ok) {
            throw new Error(`Erro na API: ${response.statusText}`)
        }

        const projects: SupabaseProject[] = await response.json()
        return projects

    } catch (error) {
        console.error('Falha ao buscar projetos:', error)
        return []
    }
}