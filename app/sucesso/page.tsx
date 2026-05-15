import { CheckCircle2, MailWarning, ArrowRight } from "lucide-react"

export default function SucessoPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#FAFAFA] p-5 sm:p-10">
      <div className="w-full max-w-lg">
        <div className="rounded-2xl border-2 border-gold/50 bg-white p-8 shadow-2xl text-center">
          <div className="mb-6 flex justify-center">
            <div className="rounded-full bg-pix-green/10 p-5">
              <CheckCircle2 className="h-16 w-16 text-pix-green" />
            </div>
          </div>
          
          <h1 className="font-serif text-3xl font-bold text-foreground mb-2">
            Pagamento Confirmado!
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Seu certificado de peregrinação já está sendo gerado pelo nosso sistema.
          </p>

          <div className="rounded-xl bg-amber-50 border border-amber-200 p-6 text-left shadow-sm">
            <div className="flex items-start gap-4">
              <MailWarning className="h-8 w-8 text-amber-500 shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-amber-900 text-lg mb-1">
                  Atenção ao seu E-mail
                </h3>
                <p className="text-amber-800 leading-relaxed">
                  O PDF do seu certificado será enviado para o e-mail que você cadastrou em alguns minutos. 
                  <br /><br />
                  <strong className="bg-amber-200/50 px-1">⚠️ IMPORTANTE: Por favor, verifique também a sua caixa de SPAM ou Lixo Eletrônico</strong>, pois o e-mail pode ser direcionado para lá acidentalmente.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-10">
            <a 
              href="/"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-bordo py-4 text-sm font-bold uppercase tracking-widest text-primary-foreground transition-colors hover:bg-bordo-dark"
            >
              Voltar ao Início
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
