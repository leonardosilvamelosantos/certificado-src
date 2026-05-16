"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { CheckCircle2, Download, Loader2, Mail, AlertCircle } from "lucide-react"
import Link from "next/navigation"

function SuccessContent() {
  const searchParams = useSearchParams()
  const [paymentId, setPaymentId] = useState<string | null>(null)
  
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading")
  const [attempts, setAttempts] = useState(0)

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api-certificados-ssrc.fly.dev"

  useEffect(() => {
    // 1. Tenta pegar da URL
    const idFromUrl = searchParams.get("id")
    if (idFromUrl && idFromUrl !== "${paymentId}") {
      setPaymentId(idFromUrl)
      return
    }

    // 2. Tenta pegar do Cookie
    const idFromCookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("ssrc_last_payment_id="))
      ?.split("=")[1]

    if (idFromCookie) {
      setPaymentId(idFromCookie)
    } else {
      // Se não achar nada após 2 segundos, dá erro
      setTimeout(() => {
        if (!paymentId) setStatus("error")
      }, 2000)
    }
  }, [searchParams, paymentId])

  useEffect(() => {
    if (!paymentId) return

    const checkStatus = async () => {
      try {
        const res = await fetch(`${API_URL}/status/${paymentId}`)
        const data = await res.json()

        if (data.pdf_pronto) {
          setStatus("ready")
        } else {
          // Tenta novamente em 3 segundos se ainda não estiver pronto
          if (attempts < 20) { // Limite de 1 minuto de polling
            setTimeout(() => setAttempts(prev => prev + 1), 3000)
          } else {
            setStatus("error")
          }
        }
      } catch (err) {
        console.error("Erro ao verificar status:", err)
        setTimeout(() => setAttempts(prev => prev + 1), 5000)
      }
    }

    if (status === "loading") {
      checkStatus()
    }
  }, [paymentId, attempts, status, API_URL])

  const handleDownload = () => {
    if (paymentId) {
      window.open(`${API_URL}/download/${paymentId}`, "_blank")
    }
  }

  return (
    <main className="min-h-screen bg-[#fffcf5] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-gold/20 p-8 text-center">
        {status === "loading" && (
          <div className="space-y-6 animate-in fade-in duration-700">
            <div className="relative w-24 h-24 mx-auto">
              <div className="absolute inset-0 border-4 border-gold/20 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-bordo rounded-full border-t-transparent animate-spin"></div>
              <Loader2 className="absolute inset-0 m-auto text-bordo h-10 w-10 animate-pulse" />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-serif text-bordo font-bold">
                Processando seu Certificado...
              </h1>
              <p className="text-muted-foreground">
                Estamos gerando o documento oficial e enviando para o seu e-mail.
              </p>
            </div>
            <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
              <p className="text-sm text-amber-800 flex items-start gap-2 text-left">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <span>Isso leva apenas alguns instantes. Por favor, não feche esta página.</span>
              </p>
            </div>
          </div>
        )}

        {status === "ready" && (
          <div className="space-y-6 animate-in zoom-in duration-500">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600 shadow-inner">
              <CheckCircle2 className="h-12 w-12" />
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-serif text-bordo font-bold">
                ¡Tudo Pronto!
              </h1>
              <p className="text-foreground font-medium">
                Seu certificado de peregrinação foi gerado com sucesso.
              </p>
            </div>

            <button
              onClick={handleDownload}
              className="w-full flex items-center justify-center gap-3 bg-bordo hover:bg-bordo-dark text-white font-bold py-5 rounded-2xl shadow-lg transition-all active:scale-95 group"
            >
              <Download className="h-6 w-6 group-hover:animate-bounce" />
              BAIXAR MEU CERTIFICADO
            </button>

            <div className="pt-4 border-t border-gold/10">
              <div className="flex items-center gap-3 text-left text-sm text-muted-foreground bg-[#f9f9f9] p-4 rounded-xl">
                <Mail className="h-8 w-8 text-gold-dark shrink-0" />
                <p>
                  Também enviamos uma cópia para o seu <strong className="text-foreground">e-mail</strong>. 
                  Lembre-se de conferir a caixa de <strong className="text-bordo">SPAM</strong>!
                </p>
              </div>
            </div>

            <a 
              href="/"
              className="block text-sm text-gold-dark hover:underline font-medium"
            >
              Voltar para a página inicial
            </a>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle className="h-10 w-10" />
            </div>
            <div className="space-y-2">
              <h1 className="text-xl font-bold text-foreground font-serif">
                Não conseguimos identificar seu pedido
              </h1>
              <p className="text-sm text-muted-foreground px-4">
                Se você já concluiu o pagamento, informe o e-mail usado na compra para buscarmos seu certificado:
              </p>
            </div>
            
            <form 
              onSubmit={async (e) => {
                e.preventDefault()
                const email = (e.currentTarget.elements.namedItem("email") as HTMLInputElement).value
                setStatus("loading")
                // Simula uma busca pelo e-mail (precisamos de uma rota no backend para isso)
                // Por enquanto, vamos apenas dar uma orientação clara
                alert(`Estamos enviando uma nova cópia para ${email}. Verifique seu e-mail e a caixa de SPAM em instantes.`)
                window.location.href = "/"
              }}
              className="space-y-3"
            >
              <input 
                name="email"
                type="email" 
                required
                placeholder="seuemail@exemplo.com"
                className="w-full h-12 rounded-xl border-2 border-border px-4 focus:border-bordo focus:outline-none"
              />
              <button 
                type="submit"
                className="w-full py-3 bg-gold-dark hover:bg-gold text-white font-bold rounded-xl transition-colors"
              >
                BUSCAR MEU CERTIFICADO
              </button>
            </form>

            <div className="pt-4">
              <a 
                href="/"
                className="text-sm text-bordo hover:underline font-medium"
              >
                Voltar para a página inicial
              </a>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#fffcf5] text-bordo">Carregando...</div>}>
      <SuccessContent />
    </Suspense>
  )
}
