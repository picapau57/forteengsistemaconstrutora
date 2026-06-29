import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route to check if Mercado Pago is configured
  app.get("/api/payment/config", (req, res) => {
    const isConfigured = !!process.env.MERCADO_PAGO_ACCESS_TOKEN;
    res.json({ configured: isConfigured });
  });

  // API Route to create PIX payment
  app.post("/api/payment/create", async (req, res) => {
    const { plan, email, customAccessToken } = req.body;
    
    let amount = 399.00;
    if (plan === 'Mensal') amount = 49.90;
    else if (plan === 'Vitalício') amount = 899.00;

    const accessToken = customAccessToken || process.env.MERCADO_PAGO_ACCESS_TOKEN;

    if (!accessToken) {
      // Return high-fidelity simulated payment details
      const simulatedId = `sim-${Date.now()}`;
      return res.json({
        id: simulatedId,
        status: "pending",
        isSimulated: true,
        qr_code: "00020101021126580014br.gov.bcb.pix0136forteengenhariahb8f9a0c-7b2e-4b9a-8f92-c2e3a1d94b1a5204000053039865405" + amount.toFixed(2).replace('.', '') + "5802BR5916Forte Engenharia6009SAO PAULO62070503***6304D1A0",
        qr_code_base64: "MOCK_QR_CODE",
        amount,
        plan
      });
    }

    try {
      const paymentData = {
        transaction_amount: amount,
        description: `Assinatura Plano ${plan} - Forte Engenharia`,
        payment_method_id: "pix",
        payer: {
          email: email || "picapauinformatica@gmail.com",
          first_name: "Cliente",
          last_name: "Forte Engenharia"
        }
      };

      const response = await fetch("https://api.mercadopago.com/v1/payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`,
          "X-Idempotency-Key": `idemp-${Date.now()}`
        },
        body: JSON.stringify(paymentData)
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error("Mercado Pago API error response:", errText);
        return res.status(response.status).json({
          error: "Erro ao comunicar com o Mercado Pago",
          details: errText
        });
      }

      const data = await response.json();
      
      const qr_code = data.point_of_interaction?.transaction_data?.qr_code;
      const qr_code_base64 = data.point_of_interaction?.transaction_data?.qr_code_base64;
      const ticket_url = data.point_of_interaction?.transaction_data?.ticket_url;

      res.json({
        id: data.id,
        status: data.status,
        status_detail: data.status_detail,
        isSimulated: false,
        qr_code,
        qr_code_base64,
        ticket_url,
        amount,
        plan
      });
    } catch (error: any) {
      console.error("Payment creation failed:", error);
      res.status(500).json({ error: "Erro interno ao processar pagamento", details: error.message });
    }
  });

  // API Route to check status of PIX payment
  app.get("/api/payment/status/:id", async (req, res) => {
    const paymentId = req.params.id;
    const customAccessToken = req.headers['x-mp-access-token'] as string || req.query.token as string;
    const accessToken = customAccessToken || process.env.MERCADO_PAGO_ACCESS_TOKEN;

    if (paymentId.startsWith("sim-")) {
      // Simulated payments can be queried and are always mock approved
      return res.json({
        id: paymentId,
        status: "approved",
        isSimulated: true
      });
    }

    if (!accessToken) {
      return res.status(400).json({ error: "Mercado Pago access token not configured" });
    }

    try {
      const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${accessToken}`
        }
      });

      if (!response.ok) {
        const errText = await response.text();
        return res.status(response.status).json({
          error: "Erro ao consultar status no Mercado Pago",
          details: errText
        });
      }

      const data = await response.json();
      res.json({
        id: data.id,
        status: data.status,
        status_detail: data.status_detail,
        isSimulated: false
      });
    } catch (error: any) {
      console.error("Payment status check failed:", error);
      res.status(500).json({ error: "Erro interno ao consultar status", details: error.message });
    }
  });

  // Serve static assets or mount Vite in dev mode
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
