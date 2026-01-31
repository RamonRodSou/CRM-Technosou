import { api } from "./api";

export function crud<T, U>(tableName: string) { 
    return {
        getAll: async (): Promise<T[]> => {
            const { data, error } = await api
                .from(tableName)
                .select('*');

            if (error) throw error;
            return data as T[];
        },

        getById: async (id: number | string): Promise<T> => {
            const { data, error } = await api
                .from(tableName)
                .select('*')
                .eq('id', id)
                .single(); 

            if (error) throw error;
            return data as T;
        },

        create: async (dados: U): Promise<T> => {
            const { data, error } = await api
                .from(tableName)
                .insert(dados)
                .select()
                .single();

            if (error) throw error;
            return data as T;
        },

        update: async (id: number | string, dados: Partial<U>): Promise<T> => {
            const { data, error } = await api
                .from(tableName)
                .update(dados)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return data as T;
        },

        delete: async (id: number | string): Promise<void> => {
            const { error } = await api
                .from(tableName)
                .delete()
                .eq('id', id);

            if (error) throw error;
        }
    }
};