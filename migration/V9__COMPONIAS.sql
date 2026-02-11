create or replace function get_available_companies()
returns table (table_name text, friendly_name text)
language plpgsql
security definer
as $$
declare
    r record;
    sufixos text[] := array['_contatos_agente', '_contatos', '_leads'];
    sufixo text;
    empresa_nome text;
    nomes_ja_add text[] := array[]::text[]; 
begin
    for r in 
        select t.table_name 
        from information_schema.tables t
        where t.table_schema = 'public' 
        and t.table_type = 'BASE TABLE'
        and t.table_name not in ('teste_contatos_agente', 'Chat_historic', 'documents', 'pg_stat_statements', 'finance_clients', 'finance_expenses', 'finance_settings') 
        and t.table_name not like 'finance_%'
        and t.table_name not ilike '%follow_up%'
        and t.table_name not ilike '%followup%'
        order by length(t.table_name) desc
    loop
        empresa_nome := r.table_name;
        
        foreach sufixo in array sufixos loop
            if empresa_nome like '%' || sufixo then
                empresa_nome := replace(empresa_nome, sufixo, '');
            end if;
        end loop;
        
        empresa_nome := replace(empresa_nome, '_', ' ');
        empresa_nome := initcap(empresa_nome);

        if not (empresa_nome = any(nomes_ja_add)) then
            table_name := r.table_name;
            friendly_name := empresa_nome;
            
            nomes_ja_add := array_append(nomes_ja_add, empresa_nome);
            
            return next;
        end if;
    end loop;
end;
$$;