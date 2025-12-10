import { Badge } from "@/shared/components/ui/badge";
import { Card, CardContent } from "@/shared/components/ui/card";
import type {
  AvulsaRegistrationDetails,
  OnSiteParticipant,
} from "../types/avulsaTypes";

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
  timeStyle: "short",
});

const formatCurrency = (value: number) =>
  currencyFormatter.format(Number.isNaN(value) ? 0 : value);

const formatDate = (value?: string) => {
  if (!value) return "-";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "-";
  return dateFormatter.format(parsed);
};

const computeTotals = (
  participants: OnSiteParticipant[]
): {
  totalGeral: number;
  totalDinheiro: number;
  totalCartao: number;
  totalPix: number;
} => {
  return participants.reduce(
    (acc, participant) => {
      participant.onSiteParticipantPayment.forEach((payment) => {
        const normalized = Number(payment.value) || 0;
        acc.totalGeral += normalized;
        switch (payment.paymentMethod) {
          case "PIX":
            acc.totalPix += normalized;
            break;
          case "CARTAO":
            acc.totalCartao += normalized;
            break;
          case "DINHEIRO":
            acc.totalDinheiro += normalized;
            break;
        }
      });
      return acc;
    },
    {
      totalCartao: 0,
      totalDinheiro: 0,
      totalGeral: 0,
      totalPix: 0,
    }
  );
};

const getParticipantTotal = (participant: OnSiteParticipant) =>
  participant.onSiteParticipantPayment.reduce((sum, payment) => {
    const normalized = Number(payment.value) || 0;
    return sum + normalized;
  }, 0);

interface AvulsaRegistrationDetailsContentProps {
  data: AvulsaRegistrationDetails;
}

export default function AvulsaRegistrationDetailsContent({
  data,
}: AvulsaRegistrationDetailsContentProps) {
  const participants = data.onSiteParticipant ?? [];
  const totals = computeTotals(participants);
  const participantSum = participants.reduce(
    (sum, participant) => sum + getParticipantTotal(participant),
    0
  );

  const totalItems = [
    { label: "Total Geral", value: totals.totalGeral },
    { label: "Dinheiro", value: totals.totalDinheiro },
    { label: "PIX", value: totals.totalPix },
    { label: "Cartão", value: totals.totalCartao },
  ];

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-sm">
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <p className="text-sm text-muted-foreground">Responsável</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {data.name}
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-xs text-muted-foreground">Registrado em</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {formatDate(data.createdAt)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Participantes</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {participants.length}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-4">
        {totalItems.map((item) => (
          <Card key={item.label} className="border-0 shadow-sm">
            <CardContent>
              <p className="text-xs text-muted-foreground">{item.label}</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {formatCurrency(item.value)}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="space-y-4">
        <div className="flex items-baseline justify-between flex-wrap gap-2">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Participantes ({participants.length})
          </h2>
          <p className="text-sm text-muted-foreground">
            Total registrado {formatCurrency(participantSum)}
          </p>
        </div>

        {participants.length === 0 ? (
          <Card className="border-dashed border-muted-foreground bg-muted/40">
            <CardContent className="text-sm text-muted-foreground text-center">
              Ainda não há participantes cadastrados para esta inscrição.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {participants.map((participant) => (
              <Card key={participant.id} className="border-0 shadow-sm">
                <CardContent className="space-y-4">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Participante
                      </p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        {participant.name}
                      </p>
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">
                        {participant.gender}
                      </p>
                    </div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {formatCurrency(getParticipantTotal(participant))}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {participant.onSiteParticipantPayment.map((payment) => (
                      <Badge
                        key={payment.id}
                        variant="secondary"
                        className="text-xs font-medium"
                      >
                        {payment.paymentMethod} •{" "}
                        {formatCurrency(payment.value)}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
