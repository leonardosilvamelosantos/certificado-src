"use server"

import { cookies } from "next/headers"

export type PagamentoState = {
  success?: boolean
  checkoutUrl?: string
  pixData?: {
    brCode: string
    brCodeBase64: string
    transactionId: string
  }
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

  // Remove pontuação do CPF (000.000.000-00 -> 00000000000)
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
    console.error("[AbacatePay] ABACATE_API_KEY não configurada")
    return {
      error: "Pagamento indisponível no momento. Tente novamente em instantes.",
    }
  }

  try {
    // ── Cria o PIX via Checkout Transparente ──────────────────────────
    console.log(`[AbacatePay] Criando PIX para ${nome} (${email})`)

    const pixRes = await fetch(`${ABACATE_API_URL}/transparents/create`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${ABACATE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        method: "PIX",
        data: {
          amount: 1000,
          description: "Certificado de Peregrinação - Santa Rita de Cássia",
        },
      }),
      cache: "no-store",
    })

    const responseText = await pixRes.text()
    console.log(`[AbacatePay] Resposta (${pixRes.status}):`, responseText.substring(0, 300))

    if (!pixRes.ok) {
      let msg = ""
      try {
        const errObj = JSON.parse(responseText)
        msg = errObj.error || "Erro ao processar pagamento."
      } catch {
        msg = `Erro na AbacatePay: ${responseText.substring(0, 100)}`
      }
      return { error: msg }
    }

    const result = JSON.parse(responseText)
    const pixInfo = result.data

    if (!pixInfo || !pixInfo.brCode) {
      console.error("[AbacatePay] Resposta sem brCode:", responseText)
      return { error: "Erro ao gerar o QR Code do PIX." }
    }

    // Grava o ID da transação no cookie para a página de sucesso
    const cookieStore = await cookies()
    cookieStore.set("ssrc_last_payment_id", pixInfo.id, {
      maxAge: 3600, // 1 hora
      path: "/",
      sameSite: "lax",
    })

    console.log(`[AbacatePay] PIX criado com sucesso: ${pixInfo.id}`)

    return {
      success: true,
      pixData: {
        brCode: pixInfo.brCode,
        brCodeBase64: pixInfo.brCodeBase64,
        transactionId: pixInfo.id,
      },
    }
  } catch (err: any) {
    console.error("[AbacatePay] Erro fatal no processamento:", err)
    return {
      error: err.message || "Erro interno no servidor.",
    }
  }
}
