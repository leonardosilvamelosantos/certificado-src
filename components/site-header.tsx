import { Cross } from "lucide-react"

export function SiteHeader() {
  return (
    <header className="w-full border-b-2 border-gold/40 bg-card">
      <div className="mx-auto flex max-w-xl items-center justify-center gap-3 px-5 py-4">
        <Cross className="h-6 w-6 text-bordo" aria-hidden="true" />
        <div className="text-center">
          <p className="font-serif text-base font-semibold leading-tight text-bordo sm:text-lg">
            Santa Rita de Cássia
          </p>
          <p className="text-xs uppercase tracking-widest text-gold-dark">
            PADROEIRA DAS CAUSAS IMPOSSÍVEIS
          </p>
        </div>
      </div>
    </header>
  )
}
