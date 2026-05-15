import { ShieldCheck, Mail, BadgeCheck } from "lucide-react"

export function TrustSection() {
  return (
    <section className="w-full bg-secondary px-5 py-10">
      <div className="mx-auto max-w-xl">
        <ul className="flex flex-col gap-5">
          <li className="flex items-start gap-4">
            <ShieldCheck
              className="mt-1 h-7 w-7 flex-shrink-0 text-bordo"
              aria-hidden="true"
            />
            <div>
              <p className="text-base font-semibold text-foreground">
                Pagamento 100% Seguro
              </p>
              <p className="text-base leading-relaxed text-muted-foreground">
                Processado pela Asaas, com Pix instantâneo.
              </p>
            </div>
          </li>
          <li className="flex items-start gap-4">
            <Mail
              className="mt-1 h-7 w-7 flex-shrink-0 text-bordo"
              aria-hidden="true"
            />
            <div>
              <p className="text-base font-semibold text-foreground">
                Entrega automática
              </p>
              <p className="text-base leading-relaxed text-muted-foreground">
                Você recebe o PDF no seu e-mail logo após o pagamento.
              </p>
            </div>
          </li>
          <li className="flex items-start gap-4">
            <BadgeCheck
              className="mt-1 h-7 w-7 flex-shrink-0 text-bordo"
              aria-hidden="true"
            />
            <div>
              <p className="text-base font-semibold text-foreground">
                Documento oficial
              </p>
              <p className="text-base leading-relaxed text-muted-foreground">
                Assinado pelo Pe. Reitor do Santuário, com selo de autenticidade.
              </p>
            </div>
          </li>
        </ul>
      </div>
    </section>
  )
}
