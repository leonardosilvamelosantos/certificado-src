import { SiteHeader } from "@/components/site-header"
import { HeroSection } from "@/components/hero-section"
import { CertificateForm } from "@/components/certificate-form"
import { TrustSection } from "@/components/trust-section"
import { Testimonials } from "@/components/testimonials"
import { SiteFooter } from "@/components/site-footer"

export default function Page() {
  return (
    <main className="min-h-screen bg-background">
      <SiteHeader />
      <HeroSection />
      <CertificateForm />
      <TrustSection />
      <Testimonials />
      <SiteFooter />
    </main>
  )
}
