"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/shared/components/ui/pagination";
import { Users } from "lucide-react";
import { GuestParticipant } from "../../types/list-guest-participants/guestParticipantsTypes";

interface ListGuestParticipantsProps {
  guestParticipants: GuestParticipant[];
  countGuestParticipants: number;
  countGuestParticipantsMale: number;
  countGuestParticipantsFemale: number;
  total: number;
  page: number;
  pageSize: number;
  pageCount: number;
  onPageChange: (page: number) => void;
}

const calculateAge = (birthDate: Date | string) => {
  const today = new Date();
  const birth = new Date(birthDate);
  if (Number.isNaN(birth.getTime())) return null;

  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
};

function PercentCircle({ percent, color }: { percent: number; color: string }) {
  const pct = Math.max(0, Math.min(100, percent));

  return (
    <div className="relative w-12 h-12">
      <svg
        className="w-12 h-12 -rotate-90"
        viewBox="0 0 36 36"
        aria-hidden="true"
      >
        <circle
          cx="18"
          cy="18"
          r="14"
          fill="transparent"
          stroke="hsl(var(--muted))"
          strokeWidth="6"
        />
        <circle
          cx="18"
          cy="18"
          r="14"
          fill="transparent"
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
          pathLength={100}
          strokeDasharray={`${pct} 100`}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-[11px] font-semibold text-foreground">
          {Math.round(pct)}%
        </span>
      </div>
    </div>
  );
}

export default function ListGuestParticipants({
  guestParticipants,
  countGuestParticipants,
  countGuestParticipantsMale,
  countGuestParticipantsFemale,
  total,
  page,
  pageSize,
  pageCount,
  onPageChange,
}: ListGuestParticipantsProps) {
  if (!guestParticipants.length) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Card className="border-0 shadow-lg w-full max-w-md">
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-white">
              Nenhum participante encontrado
            </h3>
            <p className="text-muted-foreground">
              Não há participantes convidados cadastrados para este evento.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const malePercent =
    countGuestParticipants > 0
      ? (countGuestParticipantsMale / countGuestParticipants) * 100
      : 0;
  const femalePercent =
    countGuestParticipants > 0
      ? (countGuestParticipantsFemale / countGuestParticipants) * 100
      : 0;

  const startItem = total > 0 ? (page - 1) * pageSize + 1 : 0;
  const endItem = total > 0 ? Math.min(page * pageSize, total) : 0;

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card className="border-0 shadow-sm bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-900/20 dark:to-gray-800">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-xs uppercase tracking-wider font-semibold text-emerald-600 dark:text-emerald-400">
                  Participantes
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  {countGuestParticipants}
                </p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-800 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-900/20 dark:to-gray-800">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-xs uppercase tracking-wider font-semibold text-indigo-600 dark:text-indigo-400">
                  Masculino
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  {countGuestParticipantsMale}
                </p>
              </div>
              <PercentCircle percent={malePercent} color="#3b82f6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-pink-50 to-white dark:from-pink-900/20 dark:to-gray-800">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-xs uppercase tracking-wider font-semibold text-pink-600 dark:text-pink-400">
                  Feminino
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  {countGuestParticipantsFemale}
                </p>
              </div>
              <PercentCircle percent={femalePercent} color="#ec4899" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 shadow-md bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
        <CardHeader className="pb-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
              Participantes convidados
            </CardTitle>
            {total > 0 && (
              <div className="text-sm text-muted-foreground">
                Mostrando {startItem}-{endItem} de {total}
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <div className="max-h-[520px] overflow-auto">
              <table className="min-w-full text-sm">
                <thead className="sticky top-0 bg-white dark:bg-gray-800 z-10 text-muted-foreground border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    <th className="hidden sm:table-cell px-6 py-4 text-left font-semibold text-base">
                      Nome
                    </th>
                    <th className="hidden sm:table-cell px-6 py-4 text-left font-semibold text-base">
                      Tipo de Inscrição
                    </th>
                    <th className="hidden md:table-cell px-6 py-4 text-left font-semibold text-base">
                      Camiseta
                    </th>
                    <th className="hidden lg:table-cell px-6 py-4 text-center font-semibold text-base">
                      Idade
                    </th>
                    <th className="hidden lg:table-cell px-6 py-4 text-center font-semibold text-base">
                      Gênero
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {guestParticipants.map((participant) => {
                    const age = calculateAge(participant.birthDate);
                    const preferredName =
                      participant.preferredName &&
                      participant.preferredName !== participant.name
                        ? participant.preferredName
                        : null;

                    return (
                      <tr
                        key={participant.id}
                        className="border-b border-gray-100 dark:border-gray-800 hover:bg-muted/50 transition-colors"
                      >
                        <td className="px-4 sm:px-6 py-4">
                          <div className="min-w-0">
                            <div className="font-medium text-gray-900 dark:text-white truncate">
                              {participant.name}
                            </div>
                            {preferredName && (
                              <div className="text-xs text-muted-foreground truncate">
                                {preferredName}
                              </div>
                            )}
                            <div className="sm:hidden mt-2">
                              <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
                                <div className="rounded-md bg-muted/30 py-1.5">
                                  <dt className="text-[10px] uppercase tracking-wide text-muted-foreground">
                                    Inscrição
                                  </dt>
                                  <dd className="mt-0.5 text-xs font-medium text-foreground truncate">
                                    {participant.typeInscription}
                                  </dd>
                                </div>
                                <div className="rounded-md bg-muted/30 py-1.5">
                                  <dt className="text-[10px] uppercase tracking-wide text-muted-foreground">
                                    Camiseta
                                  </dt>
                                  <dd className="mt-0.5 text-xs font-medium text-foreground truncate">
                                    {(participant.shirtSize || "-") +
                                      " / " +
                                      (participant.shirtType || "-")}
                                  </dd>
                                </div>
                                <div className="rounded-md bg-muted/30 py-1.5">
                                  <dt className="text-[10px] uppercase tracking-wide text-muted-foreground">
                                    Idade
                                  </dt>
                                  <dd className="mt-0.5 text-xs font-medium text-foreground truncate">
                                    {age == null ? "-" : `${age} anos`}
                                  </dd>
                                </div>
                                <div className="rounded-md bg-muted/30 py-1.5">
                                  <dt className="text-[10px] uppercase tracking-wide text-muted-foreground">
                                    Gênero
                                  </dt>
                                  <dd className="mt-0.5 text-xs font-medium text-foreground truncate">
                                    {participant.gender || "-"}
                                  </dd>
                                </div>
                              </dl>
                            </div>
                          </div>
                        </td>
                        <td className="hidden sm:table-cell px-6 py-4">
                          <span className="text-muted-foreground font-medium uppercase">
                            {participant.typeInscription}
                          </span>
                        </td>
                        <td className="hidden md:table-cell px-6 py-4">
                          <div className="flex flex-col">
                            <span className="text-muted-foreground font-medium uppercase">
                              {participant.shirtSize || "-"}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {participant.shirtType || "-"}
                            </span>
                          </div>
                        </td>
                        <td className="hidden lg:table-cell px-6 py-4 text-center">
                          <span className="text-muted-foreground font-medium uppercase">
                            {age == null ? "-" : `${age} anos`}
                          </span>
                        </td>
                        <td className="hidden lg:table-cell px-6 py-4 text-center">
                          <span className="text-muted-foreground">
                            {participant.gender}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>

      {pageCount > 1 && (
        <div className="mt-8 border-t pt-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              Página {page} de {pageCount}
            </p>
            <Pagination>
              <PaginationContent className="flex-wrap justify-center">
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => page > 1 && onPageChange(page - 1)}
                    href={page > 1 ? "#" : undefined}
                    className={
                      page === 1 ? "pointer-events-none opacity-50" : ""
                    }
                  />
                </PaginationItem>

                {Array.from({ length: pageCount }, (_, index) => (
                  <PaginationItem key={index}>
                    <PaginationLink
                      isActive={page === index + 1}
                      href="#"
                      onClick={() => onPageChange(index + 1)}
                    >
                      {index + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    onClick={() => page < pageCount && onPageChange(page + 1)}
                    href={page < pageCount ? "#" : undefined}
                    className={
                      page === pageCount ? "pointer-events-none opacity-50" : ""
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      )}
    </>
  );
}
