"use client";

import { Button, Checkbox, DatePicker, Drawer, Switch, Typography } from "antd";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { Download } from "lucide-react";
import { useState } from "react";
import type {
  DownloadListInscriptionsPdfInput,
  InscriptionStatus,
  PaymentMethod,
  StatusPayment,
} from "../../../types/list-inscriptions/pdf/listInscriptionsPdfTypes";

type SheetListInscriptionsProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eventId: string;
  onDownloadPdf: (input: DownloadListInscriptionsPdfInput) => void;
};

export default function SheetListInscriptions({
  open,
  onOpenChange,
  eventId,
  onDownloadPdf,
}: SheetListInscriptionsProps) {
  const [participants, setParticipants] = useState(false);
  const [payment, setPayment] = useState(false);
  const [includeNotAllocated, setIncludeNotAllocated] = useState(true);
  const [status, setStatus] = useState<InscriptionStatus[]>([]);
  const [statusPayment, setStatusPayment] = useState<StatusPayment[]>([]);
  const [methodPayment, setMethodPayment] = useState<PaymentMethod[]>([]);
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [datePreset, setDatePreset] = useState<"1h" | "24h" | "7d" | null>(
    null,
  );

  const applyPreset = (preset: "1h" | "24h" | "7d") => {
    const now = dayjs();
    const start =
      preset === "7d"
        ? now.subtract(7, "day")
        : preset === "24h"
          ? now.subtract(24, "hour")
          : now.subtract(1, "hour");

    setDatePreset(preset);
    setStartDate(start);
    setEndDate(now);
  };

  const handleGenerate = () => {
    const isGuest = includeNotAllocated ? undefined : false;
    const startDateIso = startDate?.toISOString();
    const endDateIso = endDate?.toISOString();

    onDownloadPdf({
      eventId,
      participants,
      payment,
      status: status.length ? status : undefined,
      statusPayment: statusPayment.length ? statusPayment : undefined,
      methodPayment: methodPayment.length ? methodPayment : undefined,
      isGuest,
      startDate: startDateIso,
      endDate: endDateIso,
    });
    onOpenChange(false);
  };

  return (
    <Drawer
      open={open}
      onClose={() => onOpenChange(false)}
      placement="right"
      size={420}
      title="PDF"
      footer={
        <Button type="primary" block onClick={handleGenerate}>
          <span className="inline-flex items-center gap-2">
            <Download className="h-4 w-4" />
            Gerar PDF
          </span>
        </Button>
      }
    >
      <div className="space-y-6">
        <div>
          <Typography.Text type="secondary">Lista de inscritos</Typography.Text>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between gap-4">
            <div>
              <Typography.Text strong>Incluir participantes</Typography.Text>
              <div>
                <Typography.Text type="secondary">
                  Inclui a lista de participantes dentro de cada inscrição.
                </Typography.Text>
              </div>
            </div>
            <Switch checked={participants} onChange={setParticipants} />
          </div>

          <div className="flex items-center justify-between gap-4">
            <div>
              <Typography.Text strong>Incluir pagamentos</Typography.Text>
              <div>
                <Typography.Text type="secondary">
                  Inclui informações de pagamento no PDF.
                </Typography.Text>
              </div>
            </div>
            <Switch checked={payment} onChange={setPayment} />
          </div>

          <div className="flex items-center justify-between gap-4">
            <div>
              <Typography.Text strong>
                Incluir inscrições não alocadas
              </Typography.Text>
              <div>
                <Typography.Text type="secondary">
                  Inclui participantes marcados como N/ Alocado.
                </Typography.Text>
              </div>
            </div>
            <Switch
              checked={includeNotAllocated}
              onChange={setIncludeNotAllocated}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Typography.Text strong>Status da inscrição</Typography.Text>
          <Checkbox.Group
            value={status}
            onChange={(next) => setStatus(next as InscriptionStatus[])}
            options={[
              { label: "Pendente", value: "PENDING" },
              { label: "Em análise", value: "UNDER_REVIEW" },
              { label: "Pago", value: "PAID" },
              { label: "Expirado", value: "EXPIRED" },
              { label: "Cancelado", value: "CANCELLED" },
            ]}
          />
        </div>

        <div className="space-y-2">
          <Typography.Text strong>Status do pagamento</Typography.Text>
          <Checkbox.Group
            value={statusPayment}
            onChange={(next) => setStatusPayment(next as StatusPayment[])}
            options={[
              { label: "Aprovado", value: "APPROVED" },
              { label: "Em análise", value: "UNDER_REVIEW" },
              { label: "Recusado", value: "REFUSED" },
            ]}
          />
        </div>

        <div className="space-y-2">
          <Typography.Text strong>Método de pagamento</Typography.Text>
          <Checkbox.Group
            value={methodPayment}
            onChange={(next) => setMethodPayment(next as PaymentMethod[])}
            options={[
              { label: "Dinheiro", value: "DINHEIRO" },
              { label: "PIX", value: "PIX" },
              { label: "Cartão", value: "CARTAO" },
            ]}
          />
        </div>

        <div className="space-y-2">
          <Typography.Text strong>Período</Typography.Text>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <DatePicker
              className="w-full"
              value={startDate}
              onChange={(value) => {
                setDatePreset(null);
                setStartDate(value);
              }}
              showTime={{ format: "HH:mm" }}
              format="DD/MM/YYYY HH:mm"
              placeholder="Data/hora inicial"
              lang="pt"
              allowClear
            />
            <DatePicker
              className="w-full"
              value={endDate}
              onChange={(value) => {
                setDatePreset(null);
                setEndDate(value);
              }}
              showTime={{ format: "HH:mm" }}
              format="DD/MM/YYYY HH:mm"
              placeholder="Data/hora final"
              allowClear
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              size="small"
              type={datePreset === "1h" ? "primary" : "default"}
              onClick={() => applyPreset("1h")}
            >
              Última 1h
            </Button>
            <Button
              size="small"
              type={datePreset === "24h" ? "primary" : "default"}
              onClick={() => applyPreset("24h")}
            >
              Últimas 24h
            </Button>
            <Button
              size="small"
              type={datePreset === "7d" ? "primary" : "default"}
              onClick={() => applyPreset("7d")}
            >
              Últimos 7 dias
            </Button>
          </div>
        </div>
      </div>
    </Drawer>
  );
}
