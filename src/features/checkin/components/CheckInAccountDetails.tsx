"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { DollarSign, UserCheck, Users } from "lucide-react";
import { CheckInAccountDetailsData } from "../types/checkInTypes";

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

interface CheckInAccountDetailsProps {
  account: CheckInAccountDetailsData;
}

export default function CheckInAccountDetails({
  account,
}: CheckInAccountDetailsProps) {
  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-sm">
        <CardHeader className="px-6 pt-6">
          <CardTitle>Dados da conta</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-wrap items-center gap-6">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                Conta
              </p>
              <p className="text-2xl font-semibold">{account.username}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                E-mail
              </p>
              <p className="text-base">{account.email}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                Status
              </p>
              <span className="text-sm font-semibold uppercase tracking-[0.3em]">
                {account.status}
              </span>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-xl border border-border/50 bg-card px-4 py-3 flex items-center gap-3">
              <Users className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                  Inscrições
                </p>
                <p className="text-lg font-semibold">
                  {account.countInscriptions}
                </p>
              </div>
            </div>
            <div className="rounded-xl border border-border/50 bg-card px-4 py-3 flex items-center gap-3">
              <DollarSign className="h-5 w-5 text-destructive" />
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                  Débitos
                </p>
                <p className="text-lg font-semibold text-destructive">
                  {account.countDebt}
                </p>
              </div>
            </div>
            <div className="rounded-xl border border-border/50 bg-card px-4 py-3 flex items-center gap-3">
              <UserCheck className="h-5 w-5 text-emerald-600" />
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                  Pagamentos
                </p>
                <p className="text-lg font-semibold text-foreground">
                  {account.countPay}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {account.inscriptions.map((inscription) => (
          <Card key={inscription.id} className="border-0 shadow-sm">
            <CardHeader className="px-6 pt-6">
              <CardTitle>Inscrição #{inscription.id}</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex flex-wrap items-center gap-4">
                <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                  Criada em{" "}
                  {new Date(inscription.createdAt).toLocaleDateString("pt-BR")}
                </span>
                <span className="text-xs uppercase tracking-[0.3em]">
                  Status: {inscription.status}
                </span>
                <span className="text-xs uppercase tracking-[0.3em]">
                  Pagou {currencyFormatter.format(inscription.totalPayd)}
                </span>
                <span className="text-xs uppercase tracking-[0.3em]">
                  Débito {currencyFormatter.format(inscription.totalDebt)}
                </span>
              </div>
              <div>
                <p className="text-sm font-semibold text-muted-foreground mb-2">
                  Participantes
                </p>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Gênero</TableHead>
                      <TableHead>Data Nasc.</TableHead>
                      <TableHead>Tipo</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inscription.participants.map((participant) => (
                      <TableRow key={participant.name + participant.birthDate}>
                        <TableCell>{participant.name}</TableCell>
                        <TableCell>{participant.gender}</TableCell>
                        <TableCell>
                          {new Date(participant.birthDate).toLocaleDateString(
                            "pt-BR"
                          )}
                        </TableCell>
                        <TableCell>{participant.typeInscription}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div>
                <p className="text-sm font-semibold text-muted-foreground mb-2">
                  Pagamentos
                </p>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Valor</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Data</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inscription.paymentInscription.map((payment, index) => (
                      <TableRow key={`${payment.image}-${index}`}>
                        <TableCell>
                          {currencyFormatter.format(payment.value)}
                        </TableCell>
                        <TableCell>{payment.status}</TableCell>
                        <TableCell>
                          {new Date(payment.createdAt).toLocaleDateString(
                            "pt-BR"
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
