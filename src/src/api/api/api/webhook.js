export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  try {
    const event = req.body;

    if (!event) {
      return res.status(400).json({ error: "Corps de requête manquant" });
    }

    const status    = event.status;
    const reference = event.reference || "";
    const email     = event.customer?.email || "inconnu";
    const amount    = event.amount || 0;

    if (status === "complete") {
      const plan = reference.includes("business") ? "business" : "pro";
      console.log(`✅ Paiement reçu — Plan: ${plan} — Email: ${email} — Montant: ${amount}`);

    } else if (status === "failed") {
      console.log(`❌ Paiement échoué — Email: ${email}`);

    } else if (status === "canceled") {
      console.log(`🚫 Paiement annulé — Email: ${email}`);

    } else {
      console.log(`ℹ️ Événement reçu — Status: ${status}`);
    }

    return res.status(200).json({ received: true });

  } catch (err) {
    console.error("Webhook error:", err.message);
    return res.status(500).json({ error: err.message });
  }
        }
