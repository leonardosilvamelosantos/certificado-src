"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { CheckCircle2, Download, Loader2, Mail, AlertCircle, Search } from "lucide-react"

function SuccessContent() {
  const searchParams = useSearchParams()
  const [paymentId, setPaymentId] = useState<string | null>(null)
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading")
  const [attempts, setAttempts] = useState(0)
  const [searchEmail, setSearchEmail] = useState("")
  const [searching, setSearching] = useState(false)

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api-certificados-ssrc.fly.dev"

  useEffect(() => {
    // 1. Tenta pegar da URL (?id=...)
    const idFromUrl = searchParams.get("id")
    if (idFromUrl) {
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
      // Se não achar nada após 3 segundos, mostra a busca manual
      const timer = setTimeout(() => {
        if (!paymentId) setStatus("error")
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [searchParams, paymentId])

  useEffect(() => {
    if (!paymentId) return

    const checkStatus = async () => {
      try {
        const res = await fetch(`${API_URL}/status/${paymentId}`)
        if (!res.ok) throw new Error("Não encontrado")
        const data = await res.json()

        if (data.pdf_pronto) {
          setStatus("ready")
        } else {
          // Continua tentando se o job estiver na fila
          if (attempts < 30) { 
            setTimeout(() => setAttempts(prev => prev + 1), 3000)
          } else {
            setStatus("error")
          }
        }
      } catch (err) {
        // Se der erro 404, pode ser que o webhook ainda não tenha chegado
        if (attempts < 30) {
           setTimeout(() => setAttempts(prev => prev + 1), 4000)
        } else {
           setStatus("error")
        }
      }
    }

    if (status === "loading" || status === "error") {
      checkStatus()
    }
  }, [paymentId, attempts, status, API_URL])

  const handleManualSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchEmail) return
    setSearching(true)

    try {
      const res = await fetch(`${API_URL}/buscar/${encodeURIComponent(searchEmail)}`)
      if (res.ok) {
        const data = await res.json()
        setPaymentId(data.payment_id)
        if (data.pdf_pronto) {
          setStatus("ready")
        } else {
          setStatus("loading")
          setAttempts(0)
        }
      } else {
        alert("Nenhum certificado encontrado para este e-mail. Verifique se o pagamento foi concluído.")
      }
    } catch (err) {
      alert("Erro ao conectar com o servidor.")
    } finally {
      setSearching(false)
    }
  }

  const handleDownload = () => {
    if (paymentId) {
      window.open(`${API_URL}/download/${paymentId}`, "_blank")
    }
  }

  return (
    <main className="min-h-screen bg-[#fffcf5] flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-gold/20 p-8 text-center">
        {(status === "loading" && paymentId) && (
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
              <p className="text-muted-foreground text-sm">
                Estamos gerando o documento oficial e enviando para o seu e-mail.
              </p>
            </div>
            <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
              <p className="text-xs text-amber-800 flex items-start gap-2 text-left">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>O pagamento foi confirmado! Agora estamos criando o seu PDF personalizado. Isso leva cerca de 20-40 segundos.</span>
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

            <a href="/" className="block text-sm text-gold-dark hover:underline font-medium">
              Voltar para a página inicial
            </a>
          </div>
        )}

        {(status === "error" || (!paymentId && status === "loading")) && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto">
              <Search className="h-8 w-8" />
            </div>
            <div className="space-y-2">
              <h1 className="text-xl font-bold text-foreground font-serif">
                Aguardando Confirmação
              </h1>
              <p className="text-sm text-muted-foreground px-4">
                Se você já pagou, o banco pode levar alguns instantes para nos avisar. Informe seu e-mail para buscarmos seu certificado:
              </p>
            </div>
            
            <form onSubmit={handleManualSearch} className="space-y-3">
              <input 
                type="email" 
                required
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
                placeholder="seuemail@exemplo.com"
                className="w-full h-12 rounded-xl border-2 border-border px-4 focus:border-bordo focus:outline-none"
              />
              <button 
                type="submit"
                disabled={searching}
                className="w-full py-3 bg-bordo hover:bg-bordo-dark text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                {searching ? <Loader2 className="h-5 w-5 animate-spin" /> : "BUSCAR MEU CERTIFICADO"}
              </button>
            </form>

            <p className="text-[10px] text-muted-foreground">
              Dica: O processamento pode levar até 1 minuto após o pagamento.
            </p>

            <div className="pt-4">
              <a href="/" className="text-sm text-bordo hover:underline font-medium">
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
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#fffcf5] text-bordo font-serif">Carregando...</div>}>
      <SuccessContent />
    </Suspense>
  )
}
