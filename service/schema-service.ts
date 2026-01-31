import { api } from "./api"; 

export const schemaService = {
    getTabelas: async () => {
        const { data, error } = await api.rpc('listar_tabelas');
        
        if (error) {
            console.error("Erro ao buscar tabelas:", error);
            throw error;
        }
        
        return data as { nome_tabela: string }[];
    }
};