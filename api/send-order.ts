import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { customerName, phone, region, items, totalPrice } = req.body;

    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    if (!BOT_TOKEN || !CHAT_ID) {
      throw new Error("Telegram env not set");
    }

    const itemsText = items
      .map(
        (item: any, i: number) =>
          `${i + 1}. ${item.name} × ${item.quantity} — ${item.price} сўм`
      )
      .join("\n");

    const message = `
🛒 ЯНГИ ЗАКАЗ

👤 Мижоз: ${customerName}
📞 Телефон: ${phone}
📍 Вилоят: ${region}

📦 Товарлар:
${itemsText}

💰 Жами: ${totalPrice} сўм
`;

    const tgRes = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: message,
        }),
      }
    );

    const tgData = await tgRes.json();

    if (!tgData.ok) {
      throw new Error(tgData.description);
    }

    return res.status(200).json({ success: true });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}
