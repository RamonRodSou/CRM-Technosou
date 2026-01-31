'use client'
import { useEffect, useState } from "react"
import { schemaService } from "@/service/schema-service"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Database } from "lucide-react"

export default function ListaTabelas() {
    const [tabelas, setTabelas] = useState<{ nome_tabela: string }[]>([])

    useEffect(() => {
        schemaService.getTabelas().then(setTabelas)
    }, [])

    return (
        <Card className="w-full max-w-2xl">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Tabelas do n8n_agent
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>Nome da Tabela</TableHead>
                        <TableHead className="text-right">Ação</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {tabelas.map((t) => (
                        <TableRow key={t.nome_tabela}>
                            <TableCell className="font-medium">{t.nome_tabela}</TableCell>
                            <TableCell className="text-right">
                            <span className="text-xs text-muted-foreground cursor-pointer hover:underline">
                                Ver dados
                            </span>
                            </TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}