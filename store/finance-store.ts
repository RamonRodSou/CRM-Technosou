import { create } from 'zustand'
import { financeService, Client, Expense } from '@/service/finance-service'

interface FinanceState {
    clients: Client[]
    expenses: Expense[]
    taxRate: number
    companyReserveRate: number
    isLoading: boolean
    
    fetchData: () => Promise<void>
    
    addClient: (client: Omit<Client, 'id'>) => Promise<void>
    updateClient: (id: string, newVal: Partial<Client>) => Promise<void>
    removeClient: (id: string) => Promise<void>
    
    addExpense: (expense: Omit<Expense, 'id'>) => Promise<void>
    removeExpense: (id: string) => Promise<void>
    
    setTaxRate: (rate: number) => Promise<void>
    
    updateSettings: (tax: number, reserve: number) => Promise<void>
}

export const useFinanceStore = create<FinanceState>((set, get) => ({
    clients: [],
    expenses: [],
    taxRate: 6,
    companyReserveRate: 20,
    isLoading: false,

    fetchData: async () => {
        set({ isLoading: true })
        try {
            const [clients, expenses, settings] = await Promise.all([
                financeService.getClients(),
                financeService.getExpenses(),
                financeService.getSettings()
            ])
            set({ 
                clients, 
                expenses, 
                taxRate: settings.tax_rate, 
                companyReserveRate: settings.company_reserve_rate 
            })
        } catch (error) {
            console.error("Erro ao carregar finanças:", error)
        } finally {
            set({ isLoading: false })
        }
    },

    addClient: async (clientData) => {
        try {
            const newClient = await financeService.addClient(clientData)
            set((state) => ({ clients: [...state.clients, newClient] }))
        } catch (error) {
            console.error("Erro ao adicionar cliente:", error)
        }
    },

    updateClient: async (id, newVal) => {
        try {
            await financeService.updateClient(id, newVal)
            set((state) => ({
                clients: state.clients.map((c) => (c.id === id ? { ...c, ...newVal } : c)),
            }))
        } catch (error) {
            console.error("Erro ao atualizar:", error)
        }
    },

    removeClient: async (id) => {
        try {
            await financeService.deleteClient(id)
            set((state) => ({ clients: state.clients.filter((c) => c.id !== id) }))
        } catch (error) {
            console.error("Erro ao remover:", error)
        }
    },

    addExpense: async (expenseData) => {
        try {
            const newExpense = await financeService.addExpense(expenseData)
            set((state) => ({ expenses: [...state.expenses, newExpense] }))
        } catch (error) {
            console.error("Erro ao adicionar despesa:", error)
        }
    },

    removeExpense: async (id) => {
        try {
            await financeService.deleteExpense(id)
            set((state) => ({ expenses: state.expenses.filter((e) => e.id !== id) }))
        } catch (error) {
            console.error("Erro ao remover despesa:", error)
        }
    },

    setTaxRate: async (rate) => {
        try {
            await financeService.updateTaxRate(rate)
            set({ taxRate: rate })
        } catch (error) {
            console.error("Erro ao atualizar taxa:", error)
        }
    },

    updateSettings: async (tax: number, reserve: number) => {
        try {
            await financeService.updateSetting('tax_rate', tax)
            await financeService.updateSetting('company_reserve_rate', reserve)
            set({ taxRate: tax, companyReserveRate: reserve })
        } catch (error) {
            console.error("Erro config:", error)
        }
    }
}))