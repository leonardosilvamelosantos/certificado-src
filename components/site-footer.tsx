export function SiteFooter() {
  return (
    <footer className="w-full border-t-2 border-gold/40 bg-card px-5 py-8">
      <div className="mx-auto max-w-xl text-center">
        <p className="font-serif text-base font-semibold text-bordo">
          VIVA SANTA RITA
        </p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Santa Rita de Caldas — Minas Gerais
        </p>
        <p className="mt-4 text-xs text-muted-foreground">
          © {new Date().getFullYear()} — Todos os direitos reservados.
        </p>
      </div>
    </footer>
  )
}
