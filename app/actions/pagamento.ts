"use server"

import { redirect } from "next/navigation"

export type PagamentoState = {
  error?: string
}

const ASAAS_API_URL =
  process.env.ASAAS_API_URL ?? "https://api.asaas.com/v3"

function getDueDate(): string {
  // YYYY-MM-DD (data de hoje, fuso de Brasília)
  const now = new Date()
  const tz = new Date(now.getTime() - 3 * 60 * 60 * 1000)
  return tz.toISOString().slice(0, 10)
}

async function getOrCreateCustomer(
  apiKey: string,
  nome: string,
  email: string,
  cpfCnpj: string,
): Promise<string> {
  // Tenta encontrar cliente existente pelo CPF/CNPJ
  const searchRes = await fetch(
    `${ASAAS_API_URL}/customers?cpfCnpj=${encodeURIComponent(cpfCnpj)}`,
    {
      method: "GET",
      headers: {
        access_token: apiKey,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    },
  )

  if (searchRes.ok) {
    const data = (await searchRes.json()) as {
      data?: Array<{ id: string }>
    }
    if (data.data && data.data.length > 0) {
      return data.data[0].id
    }
  }

  // Cria novo cliente com CPF/CNPJ obrigatório para Pix
  const createRes = await fetch(`${ASAAS_API_URL}/customers`, {
    method: "POST",
    headers: {
      access_token: apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name: nome, email, cpfCnpj }),
    cache: "no-store",
  })

  if (!createRes.ok) {
    const txt = await createRes.text()
    console.log("[v0] Asaas customer create error:", txt)
    throw new Error("Falha ao criar cliente no Asaas")
  }

  const customer = (await createRes.json()) as { id: string }
  return customer.id
}

export async function criarPagamento(
  _prev: PagamentoState,
  formData: FormData,
): Promise<PagamentoState> {
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

  const apiKey = process.env.ASAAS_API_KEY
  if (!apiKey) {
    console.log("[v0] ASAAS_API_KEY não configurada")
    return {
      error:
        "Pagamento indisponível no momento. Tente novamente em instantes.",
    }
  }

  let invoiceUrl: string
  try {
    const customerId = await getOrCreateCustomer(apiKey, nome, email, cpf)

    const externalReference = JSON.stringify({ nome, email, cpf })

    const paymentRes = await fetch(`${ASAAS_API_URL}/payments`, {
      method: "POST",
      headers: {
        access_token: apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        customer: customerId,
        billingType: "PIX",
        value: 10.0,
        dueDate: getDueDate(),
        description: "Certificado de Peregrinação - Santa Rita de Cássia",
        externalReference,
        callback: {
          successUrl: "https://v0-src-certificado-peregrinacao.vercel.app/sucesso?id=${paymentId}",
          autoRedirect: true,
        },
      }),
      cache: "no-store",
    })

    if (!paymentRes.ok) {
      const txt = await paymentRes.text()
      console.log("[v0] Asaas payment error:", txt)
      return {
        error:
          "Não foi possível gerar o pagamento agora. Tente novamente.",
      }
    }

    const payment = (await paymentRes.json()) as {
      invoiceUrl?: string
      id: string
    }

    if (!payment.invoiceUrl) {
      return { error: "Pagamento criado, mas sem link de cobrança." }
    }

    invoiceUrl = payment.invoiceUrl
  } catch (err) {
    console.log("[v0] Erro ao processar pagamento:", err)
    return {
      error:
        "Falha de conexão. Verifique sua internet e tente novamente.",
    }
  }

  // redirect() lança internamente — fica fora do try/catch
  redirect(invoiceUrl)
}
