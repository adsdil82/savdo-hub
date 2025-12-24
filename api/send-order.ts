import type { VercelRequest, VercelResponse } from "vercel";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const {
      customerName,
      phone,
      region,
      items,
      totalPrice,
    } = req.body;

    const text = `
🛒 ЯНГИ ЗАКАЗ

👤 Исм: ${customerName}
📞 Телефон: ${phone}
📍 Вилоят: ${region}

📦 Товарлар:
${items.map((i: any, idx: number) =>
  `${idx + 1}. ${i.name} × ${i.quantity}`
).join("\n")}

💰 Жами: ${totalPrice} сўм
    `;

    const telegramRes = await fetch(
      `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: process.env.TELEGRAM_CHAT_ID,
          text,
        }),
      }
    );

    const result = await telegramRes.json();

    if (!result.ok) {
      throw new Error(result.description);
    }

    return res.status(200).json({ success: true });
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
}
