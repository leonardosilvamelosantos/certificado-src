import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-6">
      <div className="flex flex-col items-center gap-4 text-center">
        <Loader2 className="h-12 w-12 animate-spin text-bordo" />
        <h1 className="font-serif text-2xl font-bold text-bordo">
          Verificando autenticidade...
        </h1>
        <p className="text-muted-foreground">
          Aguarde um momento enquanto validamos o certificado.
        </p>
      </div>
    </div>
  )
}
