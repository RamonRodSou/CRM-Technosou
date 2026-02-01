import { api } from "./api"

export type Client = {
    id: string
    name: string
    service: string
    value: number
    contract_date: string
    payment_due_day: number
    implementation_value: number
    implementation_installments: number
    status: 'active' | 'inactive'
    commission_value: number
	commission_name: string
}

export type Expense = {
    id: string
    description: string
    value: number
}

export const financeService = {
    getClients: async () => {
        const { data, error } = await api.from('finance_clients').select('*').order('created_at', { ascending: true })
        if (error) throw error
        return data as Client[]
    },

	addClient: async (client: Omit<Client, 'id'>) => {
		const { data, error } = await api.from('finance_clients').insert(client).select().single()
		if (error) throw error
		return data as Client
	},

	updateClient: async (id: string, client: Partial<Client>) => {
		const { error } = await api.from('finance_clients').update(client).eq('id', id)
		if (error) throw error
	},

	deleteClient: async (id: string) => {
		const { error } = await api.from('finance_clients').delete().eq('id', id)
		if (error) throw error
	},

	getExpenses: async () => {
		const { data, error } = await api.from('finance_expenses').select('*').order('created_at', { ascending: true })
		if (error) throw error
		return data as Expense[]
	},

	addExpense: async (expense: Omit<Expense, 'id'>) => {
		const { data, error } = await api.from('finance_expenses').insert(expense).select().single()
		if (error) throw error
		return data as Expense
	},

	deleteExpense: async (id: string) => {
		const { error } = await api.from('finance_expenses').delete().eq('id', id)
		if (error) throw error
	},

	getTaxRate: async () => {
		const { data, error } = await api.from('finance_settings').select('value').eq('key', 'tax_rate').single()
		if (error) return 6 
		return data?.value || 6
	},

	updateTaxRate: async (rate: number) => {
		const { error } = await api.from('finance_settings').upsert({ key: 'tax_rate', value: rate })
		if (error) throw error
	},

	getSettings: async () => {
		const { data, error } = await api.from('finance_settings').select('*')
		if (error) return { tax_rate: 6, company_reserve_rate: 20 }
		
		const tax = data.find(d => d.key === 'tax_rate')?.value || 6
		const reserve = data.find(d => d.key === 'company_reserve_rate')?.value || 20
		
		return { tax_rate: tax, company_reserve_rate: reserve }
	},

	updateSetting: async (key: 'tax_rate' | 'company_reserve_rate', value: number) => {
		const { error } = await api.from('finance_settings').upsert({ key, value })
		if (error) throw error
	}
}