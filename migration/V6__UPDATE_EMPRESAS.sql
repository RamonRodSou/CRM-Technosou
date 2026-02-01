-- 1. Remove a versão anterior quebrada
DROP FUNCTION IF EXISTS dashboard_empresas();

-- 2. Cria a versão V6 (Blindada contra tabelas sem data)
create or replace function dashboard_empresas()
returns table (
  empresa text,
  total_leads bigint,
  leads_hoje bigint,
  leads_semana bigint,
  leads_mes bigint,
  leads_qualificados bigint,
  agentes_off bigint,
  leads_parados bigint,
  tabelas_contabilizadas text[]
)
language plpgsql
security definer
as $$
declare
  r record;
  tabela_nome text;
  empresa_nome text;
  sql_query text;
  
  -- Variáveis
  c_total bigint; c_hoje bigint; c_semana bigint; c_mes bigint;
  c_qualificados bigint; c_agentes_off bigint; c_parados bigint;
  
  -- Flags
  is_followup boolean;
  tem_status boolean;
  tem_agente boolean;
  coluna_agente text;
  condicao_sucesso text;
  
  sufixos text[] := array['_contatos_agente', '_follow_up', '_followup', '_contatos'];
  sufixo text;
begin
  create temp table if not exists temp_dashboard (
    tmp_empresa_key text primary key,
    tmp_total bigint default 0,
    tmp_hoje bigint default 0,
    tmp_semana bigint default 0,
    tmp_mes bigint default 0,
    tmp_qualificados bigint default 0,
    tmp_agentes_off bigint default 0,
    tmp_parados bigint default 0,
    tmp_tabelas text[] default array[]::text[]
  ) on commit drop;

  for r in 
    select table_name 
    from information_schema.tables 
    where table_schema = 'public' 
    and table_type = 'BASE TABLE'
    -- AQUI ESTÁ A CORREÇÃO: Ignora tabelas internas e tabelas financeiras
    and table_name not in ('teste_contatos_agente', 'Chat_historic', 'documents', 'pg_stat_statements')
    and table_name not like 'finance_%' -- <--- LINHA NOVA: Ignora tudo do financeiro
  loop
    tabela_nome := r.table_name;
    empresa_nome := tabela_nome;
    
    -- Verifica Follow Up
    if tabela_nome ilike '%follow_up' or tabela_nome ilike '%followup' then
        is_followup := true;
    else
        is_followup := false;
    end if;

    -- Limpa nome
    foreach sufixo in array sufixos loop
      if empresa_nome like '%' || sufixo then
        empresa_nome := replace(empresa_nome, sufixo, '');
      end if;
    end loop;
    empresa_nome := replace(empresa_nome, '_', ' ');

    if is_followup then
        c_total := 0; c_hoje := 0; c_semana := 0; c_mes := 0;
        c_qualificados := 0; c_parados := 0; c_agentes_off := 0;
    else
        select exists (select 1 from information_schema.columns where table_name = r.table_name and column_name = 'status') into tem_status;
        
        if exists (select 1 from information_schema.columns where table_name = r.table_name and column_name = 'agente') then
            tem_agente := true; coluna_agente := 'agente';
        elsif exists (select 1 from information_schema.columns where table_name = r.table_name and column_name = 'agent') then
            tem_agente := true; coluna_agente := 'agent';
        else
            tem_agente := false;
        end if;

        condicao_sucesso := 'false';
        if tem_status and tem_agente then
            condicao_sucesso := format('(cast(status as text) ilike ''%%qualificado%%'' OR cast(%I as text) ilike ''%%off%%'')', coluna_agente);
        elsif tem_status then
            condicao_sucesso := 'cast(status as text) ilike ''%qualificado%''';
        elsif tem_agente then
            condicao_sucesso := format('cast(%I as text) ilike ''%%off%%''', coluna_agente);
        end if;

        sql_query := 'select count(*), 
                      count(*) filter (where created_at >= current_date), 
                      count(*) filter (where created_at >= date_trunc(''week'', current_date)), 
                      count(*) filter (where created_at >= date_trunc(''month'', current_date))';
        
        sql_query := sql_query || format(', count(*) filter (where %s)', condicao_sucesso);
        sql_query := sql_query || format(', count(*) filter (where created_at < (current_timestamp - interval ''5 hours'') and not (%s))', condicao_sucesso);

        if tem_agente then
            sql_query := sql_query || format(', count(*) filter (where cast(%I as text) ilike ''%%off%%'')', coluna_agente);
        else
            sql_query := sql_query || ', 0::bigint';
        end if;

        sql_query := sql_query || format(' from %I', tabela_nome);

        execute sql_query into c_total, c_hoje, c_semana, c_mes, c_qualificados, c_parados, c_agentes_off;
    end if;
        
    insert into temp_dashboard (
        tmp_empresa_key, tmp_total, tmp_hoje, tmp_semana, tmp_mes, tmp_qualificados, tmp_agentes_off, tmp_parados, tmp_tabelas
    )
    values (
        empresa_nome, c_total, c_hoje, c_semana, c_mes, c_qualificados, c_agentes_off, c_parados, array[tabela_nome]
    )
    on conflict (tmp_empresa_key) do update set
        tmp_total = temp_dashboard.tmp_total + excluded.tmp_total,
        tmp_hoje = temp_dashboard.tmp_hoje + excluded.tmp_hoje,
        tmp_semana = temp_dashboard.tmp_semana + excluded.tmp_semana,
        tmp_mes = temp_dashboard.tmp_mes + excluded.tmp_mes,
        tmp_qualificados = temp_dashboard.tmp_qualificados + excluded.tmp_qualificados,
        tmp_agentes_off = temp_dashboard.tmp_agentes_off + excluded.tmp_agentes_off,
        tmp_parados = temp_dashboard.tmp_parados + excluded.tmp_parados,
        tmp_tabelas = array_cat(temp_dashboard.tmp_tabelas, excluded.tmp_tabelas);
  end loop;

  return query 
  select 
    initcap(tmp_empresa_key), tmp_total, tmp_hoje, tmp_semana, tmp_mes, tmp_qualificados, tmp_agentes_off, tmp_parados, tmp_tabelas
  from temp_dashboard
  order by tmp_total desc;
end;
$$;