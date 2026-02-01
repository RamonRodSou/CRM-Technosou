"use client"

import { useEffect, useState } from "react"
import { useFinanceStore } from "@/store/finance-store"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DollarSign, TrendingDown, Users, Wallet, Plus, Trash2, Calendar, BadgeCheck, Ban, Landmark, Settings, HandCoins, User } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { stringUtil } from "@/lib/stringUtils"

export default function FinanceiroPage() {
    const { 
        clients, expenses, taxRate, companyReserveRate,
        addClient, removeClient, updateClient, 
        addExpense, removeExpense, updateSettings,
        fetchData
    } = useFinanceStore()

    const [newClient, setNewClient] = useState({ 
        name: stringUtil.EMPTY, service: stringUtil.EMPTY, value: stringUtil.EMPTY, 
        contract_date: format(new Date(), 'yyyy-MM-dd'),
        payment_due_day: '5', implementation_value: '0', 
        implementation_installments: '1', status: 'active',
        commission_value: '0', commission_name: stringUtil.EMPTY
    })

    const [newExpense, setNewExpense] = useState({ description: stringUtil.EMPTY, value: stringUtil.EMPTY })
    
    const [config, setConfig] = useState({ tax: 6, reserve: 20 })
    
    const [isClientOpen, setIsClientOpen] = useState<boolean>(false)
    const [isExpenseOpen, setIsExpenseOpen] = useState<boolean>(false)
    const [isConfigOpen, setIsConfigOpen] = useState<boolean>(false)

    useEffect(() => {
        fetchData()
    }, [fetchData])

    useEffect(() => {
        setConfig({ tax: taxRate, reserve: companyReserveRate })
    }, [taxRate, companyReserveRate])

  
    const activeClients = clients.filter(c => c.status === 'active')
    const totalBruto = activeClients.reduce((acc, curr) => acc + curr.value, 0)
    
    const totalComissoes = activeClients.reduce((acc, curr) => acc + (curr.commission_value || 0), 0)

    const totalDespesasFixas = expenses.reduce((acc, curr) => acc + curr.value, 0)
    const valorImposto = totalBruto * (taxRate / 100)
    
    const lucroLiquidoOperacional = totalBruto - totalDespesasFixas - valorImposto - totalComissoes
    
    const valorReserva = lucroLiquidoOperacional > 0 ? lucroLiquidoOperacional * (companyReserveRate / 100) : 0
    
    const lucroDistribuivel = lucroLiquidoOperacional - valorReserva
    
    const porSocio = lucroDistribuivel > 0 ? lucroDistribuivel / 3 : 0

    const handleAddClient = () => {
        if (!newClient.name || !newClient.value) return
        addClient({
            name: newClient.name,
            service: newClient.service,
            value: Number(newClient.value),
            contract_date: newClient.contract_date,
            payment_due_day: Number(newClient.payment_due_day),
            implementation_value: Number(newClient.implementation_value),
            implementation_installments: Number(newClient.implementation_installments),
            status: newClient.status as 'active' | 'inactive',
            commission_value: Number(newClient.commission_value),
            commission_name: newClient.commission_name // <--- SALVA O NOME
        })
        setNewClient({ 
            name: stringUtil.EMPTY, service: stringUtil.EMPTY, value: stringUtil.EMPTY, 
            contract_date: format(new Date(), 'yyyy-MM-dd'),
            payment_due_day: '5', implementation_value: '0', 
            implementation_installments: '1', status: 'active',
            commission_value: '0', commission_name: stringUtil.EMPTY
        })
        setIsClientOpen(false)
    }

    const handleAddExpense = () => {
        if (!newExpense.description || !newExpense.value) return
        addExpense({ description: newExpense.description, value: Number(newExpense.value)})
        setNewExpense({ description: stringUtil.EMPTY, value: stringUtil.EMPTY })
        setIsExpenseOpen(false)
    }

    const handleUpdateConfig = () => {
        updateSettings(Number(config.tax), Number(config.reserve))
        setIsConfigOpen(false)
    }

    return (
        <div className="flex flex-col gap-6 p-6">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Gestão Financeira</h2>
                    <p className="text-muted-foreground">Visão estratégica de lucros, comissões e dividendos.</p>
                </div>
                <div className="flex flex-wrap gap-2">
                    
                    <Dialog open={isConfigOpen} onOpenChange={setIsConfigOpen}>
                        <DialogTrigger asChild>
                            <Button variant="ghost" size="icon"><Settings className="h-5 w-5 text-muted-foreground" /></Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader><DialogTitle>Configurações Fiscais</DialogTitle></DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label>Taxa de Imposto (%)</Label>
                                    <Input type="number" value={config.tax} onChange={e => setConfig({...config, tax: Number(e.target.value)})} />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Reserva de Caixa (%)</Label>
                                    <Input type="number" value={config.reserve} onChange={e => setConfig({...config, reserve: Number(e.target.value)})} />
                                </div>
                                <Button onClick={handleUpdateConfig}>Salvar Alterações</Button>
                            </div>
                        </DialogContent>
                    </Dialog>

                    <Dialog open={isExpenseOpen} onOpenChange={setIsExpenseOpen}>
                        <DialogTrigger asChild><Button variant="outline" className="text-red-500 border-red-200"><TrendingDown className="mr-2 h-4 w-4" /> Despesa</Button></DialogTrigger>
                        <DialogContent>
                            <DialogHeader><DialogTitle>Adicionar Despesa</DialogTitle></DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2"><Label>Descrição</Label><Input value={newExpense.description} onChange={e => setNewExpense({...newExpense, description: e.target.value})} /></div>
                                <div className="grid gap-2"><Label>Valor (R$)</Label><Input type="number" value={newExpense.value} onChange={e => setNewExpense({...newExpense, value: e.target.value})} /></div>
                                <Button onClick={handleAddExpense} variant="destructive">Salvar</Button>
                            </div>
                        </DialogContent>
                    </Dialog>

                    <Dialog open={isClientOpen} onOpenChange={setIsClientOpen}>
                        <DialogTrigger asChild><Button><Plus className="mr-2 h-4 w-4" /> Novo Contrato</Button></DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader><DialogTitle>Novo Contrato</DialogTitle></DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2"><Label>Cliente</Label><Input value={newClient.name} onChange={e => setNewClient({...newClient, name: e.target.value})} /></div>
                                    <div className="grid gap-2"><Label>Serviço</Label><Input value={newClient.service} onChange={e => setNewClient({...newClient, service: e.target.value})} /></div>
                                </div>
                                
                                <div className="p-4 bg-muted/30 rounded-lg border space-y-4">
                                    <div className="grid gap-2"><Label>Valor Mensal (Total)</Label><Input type="number" value={newClient.value} onChange={e => setNewClient({...newClient, value: e.target.value})} /></div>
                                    
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2"><Label>Comissão (Valor)</Label><Input type="number" value={newClient.commission_value} onChange={e => setNewClient({...newClient, commission_value: e.target.value})} placeholder="R$ 0.00" /></div>
                                        <div className="grid gap-2"><Label>Nome do Parceiro</Label><Input value={newClient.commission_name} onChange={e => setNewClient({...newClient, commission_name: e.target.value})} placeholder="Ex: Ramon" /></div>
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        * A comissão será descontada do lucro líquido e paga ao parceiro.
                                    </div>
                                </div>

                                <div className="p-4 bg-muted/30 rounded-lg border grid grid-cols-2 gap-4">
                                    <div className="grid gap-2"><Label>Valor Implementação</Label><Input type="number" value={newClient.implementation_value} onChange={e => setNewClient({...newClient, implementation_value: e.target.value})} /></div>
                                    <div className="grid gap-2"><Label>Parcelas Setup</Label><Input type="number" value={newClient.implementation_installments} onChange={e => setNewClient({...newClient, implementation_installments: e.target.value})} /></div>
                                </div>
                                
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="grid gap-2"><Label>Data Contrato</Label><Input type="date" value={newClient.contract_date} onChange={e => setNewClient({...newClient, contract_date: e.target.value})} /></div>
                                    <div className="grid gap-2"><Label>Dia Venc.</Label><Input type="number" value={newClient.payment_due_day} onChange={e => setNewClient({...newClient, payment_due_day: e.target.value})} /></div>
                                    <div className="grid gap-2">
                                        <Label>Status</Label>
                                        <Select onValueChange={(val) => setNewClient({...newClient, status: val})} defaultValue="active">
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent><SelectItem value="active">Ativo</SelectItem><SelectItem value="inactive">Inativo</SelectItem></SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <Button onClick={handleAddClient} className="w-full mt-2">Salvar Contrato</Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                
                <Card className="border-l-4 border-l-blue-500 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Faturamento</CardTitle>
                        <DollarSign className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">R$ {totalBruto.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                        <p className="text-xs text-muted-foreground">{activeClients.length} ativos</p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-red-500 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Custos & Imp.</CardTitle>
                        <TrendingDown className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">R$ {(totalDespesasFixas + valorImposto).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                        <p className="text-xs text-muted-foreground">Imp: {taxRate}% | Fixos: R$ {totalDespesasFixas}</p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-orange-500 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Comissões Terc.</CardTitle>
                        <HandCoins className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-orange-600">R$ {totalComissoes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                        <p className="text-xs text-muted-foreground">Repasse mensal garantido</p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-emerald-500 bg-emerald-50/30 dark:bg-emerald-950/10 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Lucro Líquido</CardTitle>
                        <Wallet className="h-4 w-4 text-emerald-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">R$ {lucroLiquidoOperacional.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                        <Progress value={totalBruto > 0 ? (lucroLiquidoOperacional / totalBruto) * 100 : 0} className="h-1.5 mt-2 bg-emerald-200" indicatorClassName="bg-emerald-500" />
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-indigo-500 bg-indigo-50/30 dark:bg-indigo-950/10 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Caixa Empresa ({companyReserveRate}%)</CardTitle>
                        <Landmark className="h-4 w-4 text-indigo-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-indigo-700 dark:text-indigo-400">
                            R$ {valorReserva.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </div>
                        <p className="text-xs text-indigo-600/80 mt-1 font-medium">Retido para crescimento</p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-purple-500 bg-purple-50/30 dark:bg-purple-950/10 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Sócios (3)</CardTitle>
                        <Users className="h-4 w-4 text-purple-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-purple-700 dark:text-purple-400">
                            R$ {porSocio.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </div>
                        <p className="text-xs text-muted-foreground">Dividendos p/ cada</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Contratos & Pagamentos</CardTitle>
                        <CardDescription>Visão detalhada de contratos ativos, implementação e vencimentos.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Cliente</TableHead>
                                    <TableHead>Início</TableHead>
                                    <TableHead>Implementação</TableHead>
                                    <TableHead>Mensalidade</TableHead>
                                    <TableHead>Comissão</TableHead>
                                    <TableHead>Dia Venc.</TableHead>
                                    <TableHead className="w-[50px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {clients.map((client) => (
                                    <TableRow key={client.id} className={client.status === 'inactive' ? 'opacity-50 bg-muted/20' : stringUtil.EMPTY}>
                                        <TableCell>
                                            {client.status === 'active' ? (
                                                <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white gap-1"><BadgeCheck className="w-3 h-3" /> Ativo</Badge>
                                            ) : (
                                                <Badge variant="destructive" className="gap-1"><Ban className="w-3 h-3" /> Inativo</Badge>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-medium">{client.name}</div>
                                            <div className="text-xs text-muted-foreground">{client.service}</div>
                                        </TableCell>
                                        <TableCell className="text-muted-foreground text-sm">
                                            {client.contract_date ? format(new Date(client.contract_date), 'dd/MM/yyyy') : '-'}
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-sm font-medium">R$ {client.implementation_value?.toLocaleString()}</div>
                                            <div className="text-xs text-muted-foreground">
                                                {client.implementation_installments}x de R$ {(client.implementation_value / (client.implementation_installments || 1)).toLocaleString(undefined, {maximumFractionDigits: 0})}
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-bold text-blue-600">
                                            R$ {client.value.toLocaleString()}
                                        </TableCell>
                                        <TableCell className="text-orange-600 font-medium">
                                            {client.commission_value > 0 ? (
                                                <div className="flex flex-col">
                                                    <span>- R$ {client.commission_value.toLocaleString()}</span>
                                                    <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                                                        <User className="h-3 w-3" /> {client.commission_name}
                                                    </span>
                                                </div>
                                            ) : '-'}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2 text-sm">
                                                <Calendar className="w-3 h-3 text-muted-foreground" />
                                                Dia {client.payment_due_day}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex gap-2">
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button variant="ghost" size="icon">
                                                            <Wallet className="h-4 w-4 text-muted-foreground hover:text-blue-500" />
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent>
                                                        <DialogHeader><DialogTitle>Editar {client.name}</DialogTitle></DialogHeader>
                                                        <div className="grid gap-4 py-4">
                                                            <Label>Status</Label>
                                                            <Select defaultValue={client.status} onValueChange={(val) => updateClient(client.id, { status: val as 'active' | 'inactive' })}>
                                                                <SelectTrigger><SelectValue /></SelectTrigger>
                                                                <SelectContent><SelectItem value="active">Ativo</SelectItem><SelectItem value="inactive">Inativo</SelectItem></SelectContent>
                                                            </Select>
                                                            
                                                            <Label>Valor Mensal</Label>
                                                            <Input type="number" defaultValue={client.value} onChange={(e) => updateClient(client.id, { value: Number(e.target.value) })} />

                                                            <div className="grid grid-cols-2 gap-4">
                                                                <div>
                                                                    <Label>Comissão (Valor)</Label>
                                                                    <Input type="number" defaultValue={client.commission_value} onChange={(e) => updateClient(client.id, { commission_value: Number(e.target.value) })} />
                                                                </div>
                                                                <div>
                                                                    <Label>Nome Parceiro</Label>
                                                                    <Input defaultValue={client.commission_name} onChange={(e) => updateClient(client.id, { commission_name: e.target.value })} />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </DialogContent>
                                                </Dialog>

                                                <Button variant="ghost" size="icon" onClick={() => removeClient(client.id)}>
                                                    <Trash2 className="h-4 w-4 text-muted-foreground hover:text-red-500" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}