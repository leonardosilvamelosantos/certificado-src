"use client"

import { useParams } from "next/navigation"
import { CheckCircle, ShieldCheck } from "lucide-react"

export default function ValidarCertificadoPage() {
  const params = useParams()
  const codigo = params.codigo as string

  // Decodifica o nome do certificado se estiver codificado na URL
  // Formato esperado: /validar/[codigo] onde codigo pode ser um ID ou nome codificado
  const nomeDecodificado = decodeURIComponent(codigo || "")

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-cream px-4 py-12">
      <div className="w-full max-w-md">
        {/* Selo de autenticidade */}
        <div className="mb-6 flex justify-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-green-100">
            <ShieldCheck className="h-14 w-14 text-green-600" strokeWidth={1.5} />
          </div>
        </div>

        {/* Card de validação */}
        <div className="rounded-2xl border-2 border-gold/30 bg-background p-6 text-center shadow-lg">
          <div className="mb-4 flex items-center justify-center gap-2 text-green-600">
            <CheckCircle className="h-6 w-6" />
            <span className="text-lg font-semibold">Certificado Autêntico</span>
          </div>

          <h1 className="font-serif text-2xl font-bold text-bordo">
            Certificado de Peregrinação
          </h1>

          <p className="mt-1 text-sm uppercase tracking-widest text-gold-dark">
            Santa Rita de Caldas — 2026
          </p>

          <div className="my-6 h-px bg-border" />

          {nomeDecodificado && (
            <div className="mb-4">
              <p className="text-sm text-muted-foreground">Emitido para</p>
              <p className="mt-1 font-serif text-xl font-semibold text-foreground">
                {nomeDecodificado}
              </p>
            </div>
          )}

          <p className="text-sm leading-relaxed text-muted-foreground">
            Este certificado foi oficialmente emitido pelo Santuário de Santa Rita de Caldas 
            e confirma a participação na peregrinação.
          </p>

          <div className="my-6 h-px bg-border" />

          {/* Código de verificação */}
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="text-xs text-muted-foreground">Código de verificação</p>
            <p className="mt-1 font-mono text-sm font-medium text-foreground">
              {codigo?.slice(0, 8).toUpperCase() || "—"}
            </p>
          </div>
        </div>

        {/* Rodapé */}
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Santuário de Santa Rita de Caldas
          <br />
          <span className="font-serif font-semibold text-bordo">
            VIVA SANTA RITA
          </span>
        </p>
      </div>
    </main>
  )
}
