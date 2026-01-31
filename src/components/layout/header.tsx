"use client";

import { LogOut, User, Menu } from "lucide-react";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
    Sheet, 
    SheetContent, 
    SheetTrigger,
    SheetTitle
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth-store";
import { Sidebar } from "./sidebar";

export function Header() {
    const { usuario, logout } = useAuthStore();

    function getIniciais(nome?: string) {
        if (!nome) return "US";
        
        const nomes = nome.trim().split(" ");
        const primeiroNome = nomes[0];
        const ultimoNome = nomes[nomes.length - 1];

        if (nomes.length === 1) {
            return primeiroNome.substring(0, 2).toUpperCase();
        }
        
        return `${primeiroNome[0]}${ultimoNome[0]}`.toUpperCase();
    }

    return (
        <div className="flex items-center p-4 border-b h-16 bg-white dark:bg-slate-950">
            <div className="md:hidden mr-4">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <Menu className="h-6 w-6" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent 
                        side="left" 
                        className="p-0 w-72 bg-slate-950 border-none text-white [&>button]:text-white [&>button]:top-4 [&>button]:right-4"
                    >
                        <SheetTitle className="hidden">Menu de Navegação</SheetTitle>
                        <Sidebar /> 
                    </SheetContent>
                </Sheet>
            </div>

            <div className="flex items-center gap-x-4 ml-auto">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src="https://github.com/shadcn.png" alt={usuario?.email} />
                                
                                <AvatarFallback className="bg-sky-500 text-white">
                                    {getIniciais(usuario?.new_email)}
                                </AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                        <DropdownMenuLabel className="font-normal">
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium leading-none">
                                    {usuario?.email || "Carregando..."}
                                </p>
                                <p className="text-xs leading-none text-muted-foreground">
                                    {usuario?.email || "..."}
                                </p>
                                
                                <p className="text-[10px] text-gray-400 font-mono uppercase mt-1">
                                    Panda Hub CRM
                                </p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="cursor-pointer">
                            <User className="mr-2 h-4 w-4" />
                            <span>Meu Perfil</span>
                        </DropdownMenuItem>
                        
                        <DropdownMenuItem onClick={logout} className="text-red-600 cursor-pointer focus:text-red-600">
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Sair</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    )
}