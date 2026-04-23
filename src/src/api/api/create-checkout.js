export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  try {
    const { plan, email, name } = req.body;

    const PRICES = {
      pro:      { amount: 9,  currency: "eur", label: "ContentAI Pro"      },
      business: { amount: 29, currency: "eur", label: "ContentAI Business"  },
    };

    if (!PRICES[plan]) {
      return res.status(400).json({ error: "Plan invalide" });
    }

    if (!email) {
      return res.status(400).json({ error: "Email manquant" });
    }

    if (!process.env.NOTCHPAY_SECRET_KEY) {
      return res.status(500).json({ error: "Clé Notchpay manquante" });
    }

    const selected = PRICES[plan];

    const response = await fetch("https://api.notchpay.co/payments/initialize", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": process.env.NOTCHPAY_SECRET_KEY,
      },
      body: JSON.stringify({
        email:       email,
        name:        name || "Client ContentAI",
        amount:      selected.amount,
        currency:    selected.currency,
        description: selected.label,
        reference:   `contentai-${plan}-${Date.now()}`,
        callback:    `${process.env.NEXT_PUBLIC_URL}/api/webhook`,
        return_url:  `${process.env.NEXT_PUBLIC_URL}/?plan=${plan}&success=true`,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data.message || "Erreur Notchpay"
      });
    }

    const url = data.authorization_url || data.data?.authorization_url;

    if (!url) {
      return res.status(500).json({ error: "URL de paiement non reçue" });
    }

    return res.status(200).json({ url });

  } catch (err) {
    return res.status(500).json({ error: "Erreur serveur : " + err.message });
  }
      }
