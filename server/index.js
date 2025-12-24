import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/send-order", async (req, res) => {
  try {
    const { customerName, phone, region, items, totalPrice } = req.body;

    if (!process.env.TELEGRAM_BOT_TOKEN || !process.env.TELEGRAM_CHAT_ID) {
      throw new Error("Telegram token ёки chat_id йўқ");
    }

    const itemsText = items
      .map((i, idx) => `${idx + 1}. ${i.name} × ${i.quantity}`)
      .join("\n");

    const message = 
`🛒 ЯНГИ ЗАКАЗ

👤 ${customerName}
📞 ${phone}
📍 ${region}

📦 Товарлар:
${itemsText}

💰 Жами: ${totalPrice} сўм`;

    const url = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`;

    const tgRes = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: process.env.TELEGRAM_CHAT_ID,
        text: message,
      }),
    });

    const result = await tgRes.json();
    if (!result.ok) throw new Error(result.description);

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(3001, () => {
  console.log("✅ Telegram server running: http://localhost:3001");
});
