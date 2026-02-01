-- 1. Tabela de Clientes
create table if not exists finance_clients (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  service text,
  value numeric not null,
  created_at timestamptz default now()
);

-- 2. Tabela de Despesas
create table if not exists finance_expenses (
  id uuid default gen_random_uuid() primary key,
  description text not null,
  value numeric not null,
  created_at timestamptz default now()
);

-- 3. Configurações (para salvar a taxa de imposto)
create table if not exists finance_settings (
  key text primary key,
  value numeric not null
);

-- Insere o valor padrão de 6% se não existir
insert into finance_settings (key, value) values ('tax_rate', 6) on conflict do nothing;

-- 4. Habilitar RLS (Segurança) - Opcional se estiver em dev, mas bom para produção
alter table finance_clients enable row level security;
alter table finance_expenses enable row level security;
alter table finance_settings enable row level security;

-- Política simples: permitir tudo para usuários logados (ajuste conforme necessidade)
create policy "Acesso total clientes" on finance_clients for all using (true);
create policy "Acesso total despesas" on finance_expenses for all using (true);
create policy "Acesso total settings" on finance_settings for all using (true);