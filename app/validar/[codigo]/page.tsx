import { CheckCircle2, XCircle, Calendar, User, ShieldCheck } from "lucide-react"
import { notFound } from "next/navigation"

interface ValidationData {
  valido: boolean
  nome?: string
  data?: string
  mensagem?: string
}

async function getValidation(codigo: string): Promise<ValidationData> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://api-certificados-ssrc.fly.dev"
  
  try {
    const res = await fetch(`${apiUrl}/validar/${codigo}`, {
      cache: "no-store", // Garantir que sempre buscamos dados frescos
    })
    
    if (!res.ok) {
      return { valido: false, mensagem: "Erro ao conectar com o servidor." }
    }
    
    return await res.json()
  } catch (error) {
    console.error("Fetch error:", error)
    return { valido: false, mensagem: "Falha na rede ao validar certificado." }
  }
}

export default async function ValidationPage({
  params,
}: {
  params: Promise<{ codigo: string }>
}) {
  const { codigo } = await params
  const data = await getValidation(codigo)

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#FAFAFA] p-5 sm:p-10">
      <div className="w-full max-w-lg">
        {/* Header / Logo Area */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-bordo/10">
            <ShieldCheck className="h-10 w-10 text-bordo" />
          </div>
          <h1 className="font-serif text-3xl font-bold text-bordo">
            Validação de Autenticidade
          </h1>
          <p className="mt-2 text-muted-foreground uppercase tracking-widest text-xs">
            Santuário Santa Rita de Cássia
          </p>
        </div>

        {data.valido ? (
          /* Card Sucesso (Bordô/Dourado) */
          <div className="relative overflow-hidden rounded-2xl border-2 border-gold/50 bg-white p-8 shadow-2xl transition-all hover:shadow-gold/10">
            {/* Faixa lateral decorativa */}
            <div className="absolute top-0 right-0 h-32 w-32 translate-x-16 -translate-y-16 rotate-45 bg-gold/10" />
            
            <div className="flex flex-col items-center text-center">
              <div className="mb-6 rounded-full bg-pix-green/10 p-4">
                <CheckCircle2 className="h-12 w-12 text-pix-green" />
              </div>
              
              <h2 className="font-serif text-2xl font-bold text-foreground">
                Certificado Autêntico
              </h2>
              <div className="my-4 h-1 w-24 bg-gold/30" />
              
              <div className="mt-6 w-full space-y-6">
                <div className="flex items-center gap-4 rounded-xl bg-background p-4 text-left border border-border/50">
                  <User className="h-6 w-6 text-gold-dark" />
                  <div>
                    <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Nome do Peregrino</p>
                    <p className="text-lg font-bold text-foreground">{data.nome}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 rounded-xl bg-background p-4 text-left border border-border/50">
                  <Calendar className="h-6 w-6 text-gold-dark" />
                  <div>
                    <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Data de Emissão</p>
                    <p className="text-lg font-bold text-foreground">
                      {data.data ? new Date(data.data).toLocaleDateString('pt-BR') : '---'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-10 flex items-center justify-center gap-2 rounded-full border border-gold/20 bg-gold/5 px-6 py-2 text-sm font-medium text-gold-dark">
                <ShieldCheck className="h-4 w-4" />
                Documento Verificado Digitalmente
              </div>
            </div>
          </div>
        ) : (
          /* Card Erro */
          <div className="rounded-2xl border-2 border-destructive/20 bg-white p-8 shadow-xl">
            <div className="flex flex-col items-center text-center">
              <div className="mb-6 rounded-full bg-destructive/10 p-4">
                <XCircle className="h-12 w-12 text-destructive" />
              </div>
              
              <h2 className="font-serif text-2xl font-bold text-destructive">
                Certificado Inválido
              </h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                {data.mensagem || "Não conseguimos localizar este registro em nossa base de dados oficial."}
              </p>
              
              <div className="mt-8 w-full">
                <a 
                  href="/"
                  className="inline-flex w-full items-center justify-center rounded-xl bg-bordo py-4 text-sm font-bold uppercase tracking-widest text-primary-foreground transition-colors hover:bg-bordo-dark"
                >
                  Voltar para o Início
                </a>
              </div>
            </div>
          </div>
        )}

        <p className="mt-10 text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} Santuário Santa Rita de Cássia. <br />
          Sistema de Certificação Digital SSRC.
        </p>
      </div>
    </div>
  )
}
