export function Testimonials() {
  const items = [
    {
      quote:
        "Emoldurei o meu na sala. Toda vez que olho, lembro do dia que subi até o Santuário.",
      author: "Dona Lurdes, 68 anos",
    },
    {
      quote:
        "Foi a melhor recordação que trouxe da peregrinação. Vale cada centavo.",
      author: "Sr. Antônio, 72 anos",
    },
  ]

  return (
    <section className="w-full bg-background px-5 py-10">
      <div className="mx-auto max-w-xl">
        <h2 className="mb-6 text-center font-serif text-2xl text-bordo">
          Um troféu da sua fé.
        </h2>
        <div className="flex flex-col gap-5">
          {items.map((t) => (
            <figure
              key={t.author}
              className="rounded-xl border border-gold/40 bg-card p-5 shadow-sm"
            >
              <blockquote className="text-pretty text-lg leading-relaxed text-foreground">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-3 text-sm font-semibold text-gold-dark">
                — {t.author}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
