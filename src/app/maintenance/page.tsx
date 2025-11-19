import PageContainer from "@/shared/components/layout/PageContainer";
import { Button } from "@/shared/components/ui/button";
import { Wrench } from "lucide-react";

export default function MaintenancePage() {
  return (
    <PageContainer
      title="Estamos em manutenção"
      description="Estamos passando por uma manutenção programada para melhorar ainda mais a sua experiência."
      showBackButton={false}
    >
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-6">
        <div className="rounded-full bg-muted flex items-center justify-center h-20 w-20">
          <Wrench className="h-10 w-10 text-muted-foreground" />
        </div>
        <div className="space-y-3">
          <h1 className="text-2xl font-semibold text-foreground">
            Voltaremos em breve
          </h1>
          <p className="text-muted-foreground">
            Enquanto trabalhamos nos bastidores, o acesso ao sistema ficará
            temporariamente indisponível. Por favor, tente novamente mais tarde.
          </p>
        </div>
        <Button asChild variant="outline" className="text-base font-medium">
          <a href="mailto:suporte@inscricao.com">Falar com o suporte</a>
        </Button>
      </div>
    </PageContainer>
  );
}
