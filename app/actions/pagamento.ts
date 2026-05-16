"use server"

import { cookies } from "next/headers"

export type PagamentoState = {
  success?: boolean
  invoiceUrl?: string
  error?: string
}

const ABACATE_API_URL = "https://api.abacatepay.com/v2"

export async function criarPagamento(
  _prev: PagamentoState,
  formData: FormData,
): Promise<PagamentoState> {
  const ABACATE_API_KEY = process.env.ABACATE_API_KEY ?? ""
  const nome = String(formData.get("nome") ?? "").trim()
  const email = String(formData.get("contato") ?? "").trim()
  const cpfRaw = String(formData.get("cpf") ?? "").trim()

  const cpf = cpfRaw.replace(/\D/g, "")

  if (!nome || nome.length < 2) {
    return { error: "Por favor, informe seu nome completo." }
  }

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  if (!emailOk) {
    return { error: "Por favor, informe um e-mail válido." }
  }

  if (cpf.length !== 11) {
    return { error: "Por favor, informe um CPF válido com 11 dígitos." }
  }

  if (!ABACATE_API_KEY) {
    return { error: "Chave de API não configurada." }
  }

  try {
    console.log(`[AbacatePay] Criando checkout para ${nome}`)

    const res = await fetch(`${ABACATE_API_URL}/checkouts/create`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${ABACATE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items: [
          {
            id: "prod_r0WPHY0FndnekYC3YYRExrcJ", // Seu ID de produto
            quantity: 1,
          },
        ],
        methods: ["PIX"],
        // Passamos os dados do peregrino no metadata para o Webhook ler depois
        metadata: {
          nome,
          email,
          cpf,
        },
        returnUrl: "https://v0-src-certificado-peregrinacao.vercel.app",
        completionUrl: "https://v0-src-certificado-peregrinacao.vercel.app/sucesso",
      }),
      cache: "no-store",
    })

    const responseText = await res.text()
    if (!res.ok) {
      console.error("[AbacatePay] Erro:", responseText)
      return { error: "Erro ao criar checkout na AbacatePay." }
    }

    const result = JSON.parse(responseText)
    const checkoutUrl = result.data.url
    const checkoutId = result.data.id

    // Grava o ID no cookie para a página de sucesso
    const cookieStore = await cookies()
    cookieStore.set("ssrc_last_payment_id", checkoutId, {
      maxAge: 3600,
      path: "/",
      sameSite: "lax",
    })

    return {
      success: true,
      invoiceUrl: checkoutUrl,
    }
  } catch (err: any) {
    console.error("[AbacatePay] Erro fatal:", err)
    return { error: "Erro interno ao processar pagamento." }
  }
}
