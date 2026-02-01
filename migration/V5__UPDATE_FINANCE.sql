alter table finance_clients 
add column if not exists contract_date date default current_date,
add column if not exists payment_due_day integer default 5,
add column if not exists implementation_value numeric default 0,
add column if not exists implementation_installments integer default 1,
add column if not exists status text default 'active';