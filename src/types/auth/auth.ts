export interface Usuario {
    email: string;
    nome: string;
    cargos: string[];
    tenantId: string;
}

export interface LoginResponse {
    token: string;
}