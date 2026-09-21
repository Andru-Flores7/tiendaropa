-- ============================================================
-- MIGRACIÓN: Descuento automático de stock al confirmar pedido
-- Ejecutar en el SQL Editor de tu proyecto Supabase
-- ============================================================

create or replace function public.deduct_stock_on_order_item()
returns trigger as $$
declare
  current_stock integer;
begin
  select stock into current_stock
  from public.products
  where id = new.product_id;

  if not found then
    return new;
  end if;

  if current_stock < new.quantity then
    raise exception
      'Stock insuficiente para el producto "%" (disponible: %, solicitado: %)',
      new.product_name, current_stock, new.quantity
      using errcode = 'P0001';
  end if;

  update public.products
  set stock = stock - new.quantity
  where id = new.product_id;

  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists trg_deduct_stock on public.order_items;
create trigger trg_deduct_stock
  after insert on public.order_items
  for each row
  execute procedure public.deduct_stock_on_order_item();
