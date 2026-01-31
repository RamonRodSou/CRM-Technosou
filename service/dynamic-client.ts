import { createBrowserClient } from '@supabase/ssr'

export function getClientForProject(projectUrl: string, projectKey: string) {
    return createBrowserClient(projectUrl, projectKey)
}

export async function getTabelasDoProjeto(url: string, key: string) {
    const dynamicApi = getClientForProject(url, key)
    
    const { data, error } = await dynamicApi.rpc('listar_tabelas')
    
    if (error) throw error
    return data
}