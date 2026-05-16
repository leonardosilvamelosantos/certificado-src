"use client"

import { useState, useEffect, type FormEvent } from "react"
import { Lock, Loader2, Copy, Check, QrCode } from "lucide-react"
import { criarPagamento, type PagamentoState } from "@/app/actions/pagamento"

export function CertificateForm() {
  const [loading, setLoading] = useState(false)
  const [nome, setNome] = useState("")
  const [cpf, setCpf] = useState("")
  const [contato, setContato] = useState("")
  const [pixData, setPixData] = useState<PagamentoState["pixData"] | null>(null)
  const [copied, setCopied] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState<"waiting" | "confirmed" | null>(null)

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api-certificados-ssrc.fly.dev"

  // Polling para verificar se o pagamento foi confirmado
  useEffect(() => {
    if (!pixData?.transactionId || paymentStatus === "confirmed") return

    setPaymentStatus("waiting")

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`${API_URL}/status/${pixData.transactionId}`)
        if (res.ok) {
          const data = await res.json()
          if (data.pdf_pronto) {
            setPaymentStatus("confirmed")
            clearInterval(interval)
            // Redireciona para página de sucesso
            window.location.href = `/sucesso?id=${pixData.transactionId}`
          }
        }
      } catch {
        // Ignora erros de polling silenciosamente
      }
    }, 5000) // Verifica a cada 5 segundos

    return () => clearInterval(interval)
  }, [pixData, paymentStatus, API_URL])

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    try {
      const formData = new FormData(e.currentTarget)
      const result = await criarPagamento({}, formData)

      if (result?.success && result.pixData) {
        setPixData(result.pixData)
      } else if (result?.error) {
        alert(result.error)
      }
    } catch (error) {
      console.error("Erro no checkout:", error)
      alert("Erro de conexão. Verifique sua internet.")
    } finally {
      setLoading(false)
    }
  }

  async function handleCopyPix() {
    if (!pixData?.brCode) return
    try {
      await navigator.clipboard.writeText(pixData.brCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 3000)
    } catch {
      // Fallback para navegadores mais antigos
      const ta = document.createElement("textarea")
      ta.value = pixData.brCode
      document.body.appendChild(ta)
      ta.select()
      document.execCommand("copy")
      document.body.removeChild(ta)
      setCopied(true)
      setTimeout(() => setCopied(false), 3000)
    }
  }

  // ── Tela do QR Code PIX ──────────────────────────────────────────────
  if (pixData) {
    return (
      <section
        id="pedido"
        aria-labelledby="pix-titulo"
        className="w-full bg-background px-5 py-12"
      >
        <div className="mx-auto max-w-xl">
          <div className="rounded-2xl border-2 border-gold/60 bg-card p-6 shadow-lg sm:p-8">
            <div className="mb-6 text-center">
              <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
                <QrCode className="h-8 w-8 text-green-600" />
              </div>
              <h2
                id="pix-titulo"
                className="font-serif text-2xl leading-tight text-bordo sm:text-3xl"
              >
                Escaneie o QR Code
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Abra o app do seu banco e escaneie o código abaixo para pagar via Pix
              </p>
            </div>

            {/* QR Code */}
            <div className="flex justify-center mb-6">
              <div className="rounded-xl border-2 border-border bg-white p-4 shadow-sm">
                {pixData.brCodeBase64 ? (
                  <img
                    src={pixData.brCodeBase64.startsWith("data:") ? pixData.brCodeBase64 : `data:image/png;base64,${pixData.brCodeBase64}`}
                    alt="QR Code PIX"
                    className="h-56 w-56"
                  />
                ) : (
                  <div className="flex h-56 w-56 items-center justify-center text-muted-foreground">
                    QR Code indisponível
                  </div>
                )}
              </div>
            </div>

            {/* Valor */}
            <div className="mb-5 text-center">
              <p className="text-3xl font-bold text-bordo">R$ 10,00</p>
              <p className="text-xs text-muted-foreground mt-1">Certificado de Peregrinação</p>
            </div>

            {/* Botão Copiar Copia-e-Cola */}
            <button
              onClick={handleCopyPix}
              className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-bordo bg-bordo/5 px-4 py-4 text-base font-bold text-bordo transition-all hover:bg-bordo hover:text-white"
            >
              {copied ? (
                <>
                  <Check className="h-5 w-5" />
                  <span>Código Pix copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="h-5 w-5" />
                  <span>Copiar código Pix</span>
                </>
              )}
            </button>

            {/* Status de espera */}
            <div className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin text-bordo" />
              <span>Aguardando confirmação do pagamento...</span>
            </div>

            <p className="mt-4 text-center text-xs text-amber-600 font-medium">
              ⚠️ Após o pagamento, seu certificado será gerado automaticamente e enviado por e-mail.
            </p>
          </div>
        </div>
      </section>
    )
  }

  // ── Formulário padrão ────────────────────────────────────────────────
  return (
    <section
      id="pedido"
      aria-labelledby="pedido-titulo"
      className="w-full bg-background px-5 py-12"
    >
      <div className="mx-auto max-w-xl">
        <div className="rounded-2xl border-2 border-gold/60 bg-card p-6 shadow-lg sm:p-8">
          <div className="mb-6 text-center">
            <p className="font-serif text-sm uppercase tracking-widest text-gold-dark">
              Faça seu pedido
            </p>
            <h2
              id="pedido-titulo"
              className="mt-2 font-serif text-2xl leading-tight text-bordo sm:text-3xl"
            >
              Como você quer ser lembrado?
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="nome"
                className="text-base font-semibold text-foreground"
              >
                Nome completo
                <span className="block text-sm font-normal text-muted-foreground">
                  (Como sairá no certificado)
                </span>
              </label>
              <input
                id="nome"
                name="nome"
                type="text"
                required
                autoComplete="name"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex.: Maria Aparecida da Silva, Família Carvalho, etc."
                className="h-[60px] w-full rounded-lg border-2 border-border bg-background px-4 text-lg text-foreground placeholder:text-muted-foreground/70 focus:border-bordo focus:outline-none focus:ring-2 focus:ring-bordo/30"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="cpf"
                className="text-base font-semibold text-foreground"
              >
                CPF
                <span className="block text-sm font-normal text-muted-foreground">
                  (Exigido para emissão do Pix)
                </span>
              </label>
              <input
                id="cpf"
                name="cpf"
                type="text"
                required
                inputMode="numeric"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
                placeholder="000.000.000-00"
                className="h-[60px] w-full rounded-lg border-2 border-border bg-background px-4 text-lg text-foreground placeholder:text-muted-foreground/70 focus:border-bordo focus:outline-none focus:ring-2 focus:ring-bordo/30"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="contato"
                className="text-base font-semibold text-foreground"
              >
                Seu E-mail
                <span className="block text-sm font-normal text-muted-foreground">
                  (Para onde enviaremos o PDF)
                </span>
              </label>
              <input
                id="contato"
                name="contato"
                type="email"
                required
                autoComplete="email"
                inputMode="email"
                value={contato}
                onChange={(e) => setContato(e.target.value)}
                placeholder="seuemail@exemplo.com"
                className="h-[60px] w-full rounded-lg border-2 border-border bg-background px-4 text-lg text-foreground placeholder:text-muted-foreground/70 focus:border-bordo focus:outline-none focus:ring-2 focus:ring-bordo/30"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="pulse-cta mt-2 flex min-h-[68px] w-full items-center justify-center gap-3 rounded-xl bg-bordo px-4 text-center text-lg font-bold uppercase tracking-wide text-primary-foreground shadow-lg transition-colors hover:bg-bordo-dark focus:outline-none focus:ring-4 focus:ring-bordo/40 disabled:cursor-not-allowed disabled:opacity-80 sm:text-xl"
            >
              {loading ? (
                <>
                  <Loader2 className="h-6 w-6 animate-spin" aria-hidden="true" />
                  <span>Gerando PIX...</span>
                </>
              ) : (
                <>
                  <Lock className="h-6 w-6" aria-hidden="true" />
                  <span className="text-pretty">
                    Gerar meu certificado — R$ 10,00
                  </span>
                </>
              )}
            </button>

            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                Pagamento via{" "}
                <strong className="text-foreground">Pix</strong> — aprovação na hora.
              </p>
              <p className="text-xs text-amber-600 font-medium">
                ⚠️ Fique de olho na sua caixa de SPAM do e-mail.
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}
