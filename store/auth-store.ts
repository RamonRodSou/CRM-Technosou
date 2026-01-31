import { authService } from '@/service/auth-service'
import { User } from '@supabase/supabase-js'
import { create } from 'zustand'

interface AuthState {
  usuario: User | null
  isAuthenticated: boolean
  isLoading: boolean
  
  carregarUsuario: () => Promise<void>
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
    usuario: null,
    isAuthenticated: false,
    isLoading: true,

    carregarUsuario: async () => {
        try {
            set({ isLoading: true })
            const usuario = await authService.getMe()
            set({ usuario , isAuthenticated: true })

        } catch (error) {
            console.error("Erro ao carregar usuário", error)
            set({ usuario: null, isAuthenticated: false })
            
        } finally {
            set({ isLoading: false })
        }
    },

    logout: () => {
        authService.logout()
        set({ usuario: null, isAuthenticated: false })
    }
}))