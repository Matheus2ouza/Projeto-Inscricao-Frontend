"use client";

import { GroupInscriptionForm } from "@/features/inscriptionGrup/components/GroupInscriptionForm";
import { GroupInscriptionInfo } from "@/features/inscriptionGrup/components/GroupInscriptionInfo";
import { useFormInscriptionGrup } from "@/features/inscriptionGrup/hooks/useFormInscriptionGrup";
import { Button } from "@/shared/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useParams } from "next/navigation";

export default function GroupInscriptionPage() {
  const params = useParams();
  const eventId = params.eventId as string;

  const hookData = useFormInscriptionGrup({ eventId });

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="outline"
          size="icon"
          onClick={() => window.history.back()}
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Inscrição em Grupo
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Inscreva várias pessoas de uma só vez usando nosso template
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <GroupInscriptionForm hookData={hookData} eventId={eventId} />
        </div>
        {/* Informações - agora ocupa 1 coluna */}
        <div className="space-y-6">
          <GroupInscriptionInfo />
        </div>
      </div>
    </div>
  );
}
