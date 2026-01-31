import { createClient } from "./api";

export const authService = {
    login: async ({ email, senha }: { email: string; senha: string }) => {
        const supabase = createClient();
        
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password: senha,
        });

        if (error) throw error;
    
        return data;
    },

    getMe: async () => {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        return user;
    },

    logout: async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        window.location.href = '/login'; 
    }
};