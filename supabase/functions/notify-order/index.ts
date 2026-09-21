// supabase/functions/notify-order/index.ts
// Edge Function de Supabase que envía emails via Resend
// Deploy: npx supabase functions deploy notify-order

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")!;
const ADMIN_EMAIL = Deno.env.get("ADMIN_EMAIL")!;
const FROM_EMAIL = Deno.env.get("FROM_EMAIL") ?? "noreply@russoindumentaria.com";

interface OrderItem {
  product_name: string;
  quantity: number;
  unit_price: number;
  size?: string;
  color?: string;
}

interface OrderPayload {
  order_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  shipping_address: string;
  total: number;
  items: OrderItem[];
}

function formatPrice(n: number) {
  return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(n);
}

function buildItemsTable(items: OrderItem[]): string {
  return items.map(i =>
    `<tr>
      <td style="padding:8px 12px;border-bottom:1px solid #E2DED2;">${i.product_name}${i.size ? ` · ${i.size}` : ""}${i.color ? ` · ${i.color}` : ""}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #E2DED2;text-align:center;">${i.quantity}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #E2DED2;text-align:right;">${formatPrice(i.unit_price * i.quantity)}</td>
    </tr>`
  ).join("");
}

function customerEmail(order: OrderPayload): string {
  return `
  <!DOCTYPE html>
  <html lang="es">
  <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
  <body style="margin:0;padding:0;background:#FAF9F5;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;color:#1C1B18;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#FAF9F5;padding:40px 0;">
      <tr><td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#FFFFFF;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(28,27,24,0.08);">
          <!-- Header -->
          <tr><td style="background:#1C1B18;padding:32px 40px;text-align:center;">
            <h1 style="margin:0;font-family:Georgia,serif;font-size:22px;color:#FAF9F5;font-weight:400;letter-spacing:0.05em;">Russo Indumentaria</h1>
          </td></tr>
          <!-- Body -->
          <tr><td style="padding:40px;">
            <h2 style="margin:0 0 8px;font-family:Georgia,serif;font-size:20px;font-weight:400;color:#1C1B18;">¡Gracias por tu compra, ${order.customer_name}!</h2>
            <p style="margin:0 0 24px;color:#58554C;font-size:15px;">Recibimos tu pedido y lo estamos preparando. Te avisaremos cuando esté en camino.</p>
            <p style="margin:0 0 4px;font-size:13px;color:#8A8577;font-weight:500;">N.° DE PEDIDO</p>
            <p style="margin:0 0 28px;font-size:14px;color:#1C1B18;font-family:monospace;">${order.order_id}</p>
            <!-- Items -->
            <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #E2DED2;border-radius:8px;overflow:hidden;">
              <thead>
                <tr style="background:#F1EFE7;">
                  <th style="padding:10px 12px;text-align:left;font-size:11px;font-weight:600;color:#8A8577;letter-spacing:0.06em;">PRODUCTO</th>
                  <th style="padding:10px 12px;text-align:center;font-size:11px;font-weight:600;color:#8A8577;letter-spacing:0.06em;">CANT.</th>
                  <th style="padding:10px 12px;text-align:right;font-size:11px;font-weight:600;color:#8A8577;letter-spacing:0.06em;">TOTAL</th>
                </tr>
              </thead>
              <tbody>${buildItemsTable(order.items)}</tbody>
              <tfoot>
                <tr style="background:#F1EFE7;">
                  <td colspan="2" style="padding:12px;font-weight:600;font-size:14px;color:#1C1B18;">Total</td>
                  <td style="padding:12px;text-align:right;font-weight:600;font-size:14px;color:#1C1B18;">${formatPrice(order.total)}</td>
                </tr>
              </tfoot>
            </table>
            <!-- Shipping -->
            <div style="margin-top:28px;padding:20px;background:#F1EFE7;border-radius:8px;">
              <p style="margin:0 0 4px;font-size:11px;font-weight:600;color:#8A8577;letter-spacing:0.06em;">DIRECCIÓN DE ENVÍO</p>
              <p style="margin:0;font-size:14px;color:#1C1B18;">${order.shipping_address}</p>
            </div>
          </td></tr>
          <!-- Footer -->
          <tr><td style="padding:24px 40px;border-top:1px solid #E2DED2;text-align:center;">
            <p style="margin:0;font-size:12px;color:#8A8577;">¿Preguntas? Respondé este correo o escribinos por Instagram.</p>
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body>
  </html>`;
}

function adminEmail(order: OrderPayload): string {
  return `
  <!DOCTYPE html>
  <html lang="es">
  <head><meta charset="UTF-8"></head>
  <body style="font-family:sans-serif;color:#1C1B18;padding:32px;max-width:560px;">
    <h2 style="font-size:18px;margin:0 0 16px;">🛍️ Nuevo pedido — ${order.order_id}</h2>
    <p style="margin:0 0 4px;"><strong>Cliente:</strong> ${order.customer_name}</p>
    <p style="margin:0 0 4px;"><strong>Email:</strong> ${order.customer_email}</p>
    <p style="margin:0 0 4px;"><strong>Teléfono:</strong> ${order.customer_phone ?? "—"}</p>
    <p style="margin:0 0 16px;"><strong>Dirección:</strong> ${order.shipping_address}</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #ddd;border-radius:6px;overflow:hidden;">
      <thead><tr style="background:#f5f5f5;">
        <th style="padding:8px 10px;text-align:left;font-size:12px;">Producto</th>
        <th style="padding:8px 10px;text-align:center;font-size:12px;">Cant.</th>
        <th style="padding:8px 10px;text-align:right;font-size:12px;">Total</th>
      </tr></thead>
      <tbody>${buildItemsTable(order.items)}</tbody>
      <tfoot><tr style="background:#f5f5f5;">
        <td colspan="2" style="padding:10px;font-weight:700;">Total</td>
        <td style="padding:10px;text-align:right;font-weight:700;">${formatPrice(order.total)}</td>
      </tr></tfoot>
    </table>
    <p style="margin-top:20px;font-size:12px;color:#888;">Panel admin → <a href="${Deno.env.get("SITE_URL") ?? "#"}/admin/pedidos">Ver pedidos</a></p>
  </body>
  </html>`;
}

async function sendEmail(to: string, subject: string, html: string) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from: FROM_EMAIL, to, subject, html }),
  });
  if (!res.ok) {
    const text = await res.text();
    console.error("Resend error:", text);
  }
}

serve(async (req) => {
  // CORS para llamadas desde el navegador
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
      },
    });
  }

  try {
    const order: OrderPayload = await req.json();

    await Promise.all([
      sendEmail(
        order.customer_email,
        "¡Tu pedido fue recibido! — Russo Indumentaria",
        customerEmail(order)
      ),
      sendEmail(
        ADMIN_EMAIL,
        `Nuevo pedido de ${order.customer_name} — ${formatPrice(order.total)}`,
        adminEmail(order)
      ),
    ]);

    return new Response(JSON.stringify({ ok: true }), {
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  }
});
