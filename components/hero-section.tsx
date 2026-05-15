import Image from "next/image"

export function HeroSection() {
  return (
    <section className="w-full bg-background px-5 pb-8 pt-10 sm:pt-14">
      <div className="mx-auto flex max-w-xl flex-col items-center text-center">
        <p className="font-serif text-sm uppercase tracking-[0.25em] text-gold-dark">
          Edição Oficial 2026
        </p>

        <h1 className="mt-4 text-balance font-serif text-3xl leading-tight text-bordo sm:text-4xl md:text-5xl">
          Sua jornada de fé merece ser eternizada.
        </h1>

        <p className="mt-5 text-pretty text-lg leading-relaxed text-foreground sm:text-xl">
          Apenas quem chegou até aqui pode ter o{" "}
          <strong>Certificado Oficial do Santuário</strong>. Por apenas{" "}
          <strong className="text-bordo">R$ 10,00</strong>, receba seu documento
          digital em alta resolução.
        </p>

        <div className="mt-8 w-full">
          <div className="relative mx-auto w-full overflow-hidden rounded-xl border-4 border-gold bg-white p-2 shadow-xl">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/certificado_base.png-mKUdQIOxAeL9wUK93ZyGJoqgUde45F.jpeg"
              alt="Modelo do Certificado de Peregrinação ao Santuário de Santa Rita de Caldas, com bordas douradas, rosas e imagem de Santa Rita."
              width={1200}
              height={680}
              priority
              sizes="(max-width: 640px) 92vw, 560px"
              className="h-auto w-full rounded-md"
            />
          </div>
          <p className="mt-3 text-sm italic text-muted-foreground">
            Modelo ilustrativo do certificado que você vai receber em PDF.
          </p>
        </div>

        <a
          href="#pedido"
          className="mt-8 flex min-h-[60px] w-full items-center justify-center rounded-xl border-2 border-bordo bg-transparent px-6 text-lg font-bold text-bordo transition-colors hover:bg-bordo hover:text-primary-foreground sm:w-auto sm:px-10"
        >
          Quero o meu certificado
        </a>
      </div>
    </section>
  )
}
