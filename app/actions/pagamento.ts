"use server"

import { redirect } from "next/navigation"
import { cookies } from "next/headers"

export type PagamentoState = {
  success?: boolean
  invoiceUrl?: string
  error?: string
}

const ASAAS_API_URL = process.env.ASAAS_API_URL ?? "https://api.asaas.com/v3"

async function getOrCreateCustomer(
  apiKey: string,
  nome: string,
  email: string,
  cpfCnpj: string,
): Promise<string> {
  try {
    const searchRes = await fetch(
      `${ASAAS_API_URL}/customers?cpfCnpj=${cpfCnpj}`,
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
      const data = await searchRes.json()
      if (data.data && data.data.length > 0) {
        return data.data[0].id
      }
    }
  } catch (err) {
    console.error("[Asaas] Erro ao buscar cliente:", err)
  }

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
    if (txt.includes("cust_001")) {
       throw new Error("Este CPF já está cadastrado com outro nome ou e-mail.")
    }
    throw new Error("Falha ao cadastrar cliente no Asaas.")
  }

  const customer = await createRes.json()
  return customer.id
}

export async function criarPagamento(
  _prev: PagamentoState,
  formData: FormData,
): Promise<PagamentoState> {
  const nome = String(formData.get("nome") ?? "").trim()
  const email = String(formData.get("contato") ?? "").trim()
  const cpfRaw = String(formData.get("cpf") ?? "").trim()
  const cpf = cpfRaw.replace(/\D/g, "")

  if (!nome || nome.length < 2) return { error: "Informe seu nome completo." }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: "E-mail inválido." }
  if (cpf.length !== 11) return { error: "CPF inválido." }

  const apiKey = process.env.ASAAS_API_KEY
  if (!apiKey) return { error: "Pagamento indisponível (Erro: API_KEY)." }

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
        dueDate: new Date().toISOString().slice(0, 10),
        description: "Certificado de Peregrinação - Santa Rita de Cássia",
        externalReference,
        callback: {
          successUrl: "https://v0-src-certificado-peregrinacao.vercel.app/sucesso",
          autoRedirect: true,
        },
      }),
      cache: "no-store",
    })

    if (!paymentRes.ok) {
      const txt = await paymentRes.text()
      return { error: `Erro no Asaas: ${txt}` }
    }

    const payment = await paymentRes.json()
    
    // Gravamos o ID no cookie
    const cookieStore = await cookies()
    cookieStore.set("ssrc_last_payment_id", payment.id, { 
      maxAge: 3600,
      path: "/",
      sameSite: "lax"
    })

    return { success: true, invoiceUrl: payment.invoiceUrl }
  } catch (err: any) {
    return { error: err.message || "Erro interno no processamento." }
  }
}
