-- Cria uma função que pode ser chamada pelo seu Next.js
create or replace function listar_tabelas()
returns table (nome_tabela text)
language sql
security definer -- Isso permite que a função rode com permissão de admin
as $$
  select table_name::text
  from information_schema.tables
  where table_schema = 'public'
  and table_type = 'BASE TABLE';
$$;