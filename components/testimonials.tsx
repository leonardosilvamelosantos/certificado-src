export function Testimonials() {
  const items = [
    {
      title: "Pronto para Impressão",
      description: "O arquivo em PDF possui alta resolução, perfeito para você imprimir no tamanho que desejar com qualidade."
    },
    {
      title: "Faça um Quadro",
      description: "Muitos devotos emolduram o certificado para criar um lindo quadro, guardando essa recordação especial em casa."
    },
    {
      title: "Para Toda a Família",
      description: "Você pode emitir o certificado no nome da sua família, eternizando a devoção de todos."
    }
  ]

  return (
    <section className="w-full bg-background px-5 py-10">
      <div className="mx-auto max-w-xl">
        <h2 className="mb-6 text-center font-serif text-2xl text-bordo">
          Vantagens do Certificado Digital
        </h2>
        <div className="flex flex-col gap-5">
          {items.map((t) => (
            <div
              key={t.title}
              className="rounded-xl border border-gold/40 bg-card p-5 shadow-sm"
            >
              <h3 className="mb-2 text-lg font-semibold text-bordo">
                {t.title}
              </h3>
              <p className="text-pretty text-base leading-relaxed text-foreground">
                {t.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
