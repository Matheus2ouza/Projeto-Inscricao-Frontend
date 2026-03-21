"use client";

import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import Pagination from "antd/lib/pagination";
import { Download, Users } from "lucide-react";
import { useState } from "react";
import { GenerateParticipantsByLocalityPdfResponse } from "../../api/list-participants/actions/generateParticipantsByLocalityPdf";
import { GenerateParticipantsByLocalityXlsxResponse } from "../../api/list-participants/actions/generateParticipantsByLocalityXlsx";
import { Participant } from "../../types/list-participants/listParticipantsTypes";
import PdfGeneratorDrawer from "./PdfGeneratorDrawer";

interface ListParticipantsProps {
  participants: Participant[];
  countParticipants: number;
  countParticipantsMale: number;
  countParticipantsFemale: number;
  total: number;
  page: number;
  pageSize: number;
  pageCount: number;
  onPageChange: (page: number) => void;

  // export
  onGenerateParticipantsByLocalityPdf: (params: {
    separate: boolean;
    reduced: boolean;
  }) => Promise<GenerateParticipantsByLocalityPdfResponse>;

  onGenerateParticipantsByLocalityXlsx: (params: {
    separate: boolean;
  }) => Promise<GenerateParticipantsByLocalityXlsxResponse>;

  isGeneratingParticipantsByLocalityPdf: boolean;
  isGeneratingParticipantsByLocalityXlsx: boolean;
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

// Função para obter cor do badge de gênero
const getGenderColor = (gender?: string): string => {
  if (!gender) return "default";
  return gender === "Masculino"
    ? "blue"
    : gender === "Feminino"
      ? "pink"
      : "default";
};

// Função para formatar tipo de inscrição
const formatTypeInscription = (type?: string): string => {
  if (!type) return "-";
  return type;
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

export default function ListParticipants({
  participants,
  countParticipants,
  countParticipantsMale,
  countParticipantsFemale,
  total,
  page,
  pageSize,
  pageCount,
  onPageChange,
  onGenerateParticipantsByLocalityPdf,
  onGenerateParticipantsByLocalityXlsx,
  isGeneratingParticipantsByLocalityPdf,
  isGeneratingParticipantsByLocalityXlsx,
}: ListParticipantsProps) {
  const [pdfDrawerOpen, setPdfDrawerOpen] = useState(false);
  const generatingReport =
    isGeneratingParticipantsByLocalityPdf ||
    isGeneratingParticipantsByLocalityXlsx;

  if (!participants.length) {
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
              Não há participantes cadastrados para este evento.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const malePercent =
    countParticipants > 0
      ? (countParticipantsMale / countParticipants) * 100
      : 0;
  const femalePercent =
    countParticipants > 0
      ? (countParticipantsFemale / countParticipants) * 100
      : 0;

  const startItem = total > 0 ? (page - 1) * pageSize + 1 : 0;
  const endItem = total > 0 ? Math.min(page * pageSize, total) : 0;

  // Colunas da tabela
  const columns: ColumnsType<Participant> = [
    {
      title: "Nome",
      key: "name",
      width: 250,
      render: (_, record) => {
        const preferredName =
          record.preferredName && record.preferredName !== record.name
            ? record.preferredName
            : null;

        return (
          <div className="min-w-0">
            <div className="font-medium text-gray-900 dark:text-white truncate">
              {record.name}
            </div>
            {preferredName && (
              <div className="text-xs text-muted-foreground truncate">
                {preferredName}
              </div>
            )}
          </div>
        );
      },
    },
    {
      title: "Tipo de Inscrição",
      key: "typeInscription",
      align: "left",
      width: 150,
      render: (_, record) => (
        <span className="text-muted-foreground font-medium uppercase">
          {formatTypeInscription(record.typeInscription)}
        </span>
      ),
    },
    {
      title: "Camiseta",
      key: "shirt",
      align: "left",
      width: 120,
      render: (_, record) => (
        <div className="flex flex-col">
          <span className="text-muted-foreground font-medium uppercase">
            {record.shirtSize || "-"}
          </span>
          <span className="text-xs text-muted-foreground">
            {record.shirtType || "-"}
          </span>
        </div>
      ),
    },
    {
      title: "Idade",
      key: "age",
      align: "center",
      width: 80,
      render: (_, record) => {
        const age = calculateAge(record.birthDate);
        return (
          <span className="text-muted-foreground font-medium uppercase">
            {age == null ? "-" : `${age} anos`}
          </span>
        );
      },
    },
    {
      title: "Gênero",
      key: "gender",
      align: "center",
      width: 100,
      render: (_, record) => (
        <Tag color={getGenderColor(record.gender)}>{record.gender}</Tag>
      ),
    },
  ];

  return (
    <>
      <PdfGeneratorDrawer
        open={pdfDrawerOpen}
        onOpenChange={setPdfDrawerOpen}
        generatingPdf={isGeneratingParticipantsByLocalityPdf}
        generatingXlsx={isGeneratingParticipantsByLocalityXlsx}
        onGenerateParticipantsByLocalityPdf={
          onGenerateParticipantsByLocalityPdf
        }
        onGenerateParticipantsByLocalityXlsx={
          onGenerateParticipantsByLocalityXlsx
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card className="border-0 shadow-sm bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-900/20 dark:to-gray-800">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-xs uppercase tracking-wider font-semibold text-emerald-600 dark:text-emerald-400">
                  Participantes
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  {countParticipants}
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
                  {countParticipantsMale}
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
                  {countParticipantsFemale}
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
              Lista de Participantes
            </CardTitle>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
              {total > 0 && (
                <div className="text-sm text-muted-foreground">
                  Mostrando {startItem}-{endItem} de {total}
                </div>
              )}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setPdfDrawerOpen(true)}
                disabled={generatingReport}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                {generatingReport ? "Baixando..." : "Baixar Lista"}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table
              columns={columns}
              dataSource={participants}
              rowKey="id"
              pagination={false}
              size="middle"
              className="w-full"
              scroll={{ x: "max-content" }}
            />
          </div>
        </CardContent>
      </Card>

      {pageCount > 1 && (
        <Pagination
          current={page}
          pageSize={pageSize}
          total={total}
          onChange={onPageChange}
          showSizeChanger={false}
          hideOnSinglePage
          className="flex justify-center mt-4"
        />
      )}
    </>
  );
}
