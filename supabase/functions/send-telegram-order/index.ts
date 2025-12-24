import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface OrderRequest {
  customerName: string;
  phone: string;
  region: string;
  items: OrderItem[];
  totalPrice: number;
}

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("uz-UZ").format(price) + " сўм";
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const TELEGRAM_BOT_TOKEN = Deno.env.get("8477303807:AAFxB-8KW3SU1oyd4sfcCgzF2GNzdrnVN4c");
    const TELEGRAM_CHAT_ID = Deno.env.get("8477303807");

    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      console.error("Missing Telegram configuration");
      throw new Error("Telegram configuration is missing");
    }

    const { customerName, phone, region, items, totalPrice }: OrderRequest = await req.json();

    console.log("Received order:", { customerName, phone, region, itemsCount: items.length, totalPrice });

    // Format the order message
    const itemsList = items
      .map((item, index) => `${index + 1}. ${item.name} - ${item.quantity} та × ${formatPrice(item.price)}`)
      .join("\n");

    const message = `🛒 *ЯНГИ ЗАКАЗ*

👤 *Мижоз:* ${customerName}
📞 *Телефон:* ${phone}
📍 *Вилоят:* ${region}

📦 *Товарлар:*
${itemsList}

💰 *Жами:* ${formatPrice(totalPrice)}`;

    // Send to Telegram
    const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    
    const telegramResponse = await fetch(telegramUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: "Markdown",
      }),
    });

    const telegramResult = await telegramResponse.json();
    console.log("Telegram API response:", telegramResult);

    if (!telegramResult.ok) {
      console.error("Telegram API error:", telegramResult);
      throw new Error(`Telegram API error: ${telegramResult.description}`);
    }

    return new Response(
      JSON.stringify({ success: true, message: "Order sent successfully" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-telegram-order function:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
