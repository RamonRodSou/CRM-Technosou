"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { setCookie } from "nookies";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { authService } from "@/service/auth-service";
import { stringUtil } from "@/lib/stringUtils";
import { loginSchema } from "@/schema/acesso/loginSchema";

export default function LoginPage() {
    const router = useRouter();

    const form = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
        email: stringUtil.EMPTY,
        senha: stringUtil.EMPTY,
        },
    });

async function onSubmit(values: z.infer<typeof loginSchema>) {
    try {
      await authService.login(values);

      toast.success("Bem-vindo de volta!");

      router.refresh(); 

      router.push("/dashboard");

    } catch (error) {
      console.error(error);
      toast.error("E-mail ou senha incorretos.");
    }
  }

  return (
        <div className="flex min-h-screen items-center justify-center bg-slate-100 dark:bg-slate-950">
        <Card className="w-[350px] shadow-lg">
            <CardHeader>
            <CardTitle>CRM Integrado</CardTitle>
            <CardDescription>Acesse sua conta para continuar.</CardDescription>
            </CardHeader>
            <CardContent>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>E-mail</FormLabel>
                        <FormControl>
                        <Input placeholder="seu@email.com" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="senha"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Senha</FormLabel>
                        <FormControl>
                        <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <Button type="submit" className="w-full cursor-pointer">Entrar</Button>
                </form>
            </Form>
            </CardContent>
        </Card>
        </div>
    )
}