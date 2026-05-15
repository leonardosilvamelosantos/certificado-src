"use client"

import { useState, type FormEvent } from "react"
import { Lock, Loader2 } from "lucide-react"

export function CertificateForm() {
  const [loading, setLoading] = useState(false)
  const [nome, setNome] = useState("")
  const [contato, setContato] = useState("")

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    // Simula chamada de pagamento (substituir pela integração Asaas/Pix)
    await new Promise((r) => setTimeout(r, 1800))
    // Aqui você redirecionaria para o checkout real
    // window.location.href = checkoutUrl
    setLoading(false)
  }

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
                  <span>Processando pagamento...</span>
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
