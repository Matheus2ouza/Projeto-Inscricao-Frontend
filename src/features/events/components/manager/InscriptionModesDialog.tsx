"use client";

import { InscriptionMode } from "@/features/events/types/manager/eventManagerTypes";
import { Button } from "@/shared/components/ui/button";
import { Modal, Space, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { Plus, Trash2 } from "lucide-react";

interface InscriptionModesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedModes: InscriptionMode[];
  onAddMode: (mode: InscriptionMode) => void;
  onRemoveMode: (mode: InscriptionMode) => void;
}

// Opções para exibição dos modos de inscrição
const inscriptionModeOptions = [
  {
    value: InscriptionMode.NORMAL,
    label: "Normal",
    description:
      "Inscrições regulares para participantes com Contas Pré-Cadastradas",
  },
  {
    value: InscriptionMode.GUEST,
    label: "Não Alocados",
    description: "Inscrições que não necessitam de Contas Pré-Cadastradas",
  },
];

export default function InscriptionModesDialog({
  open,
  onOpenChange,
  selectedModes,
  onAddMode,
  onRemoveMode,
}: InscriptionModesDialogProps) {
  const columns: ColumnsType<(typeof inscriptionModeOptions)[0]> = [
    {
      title: "Modo",
      key: "mode",
      width: 150,
      render: (_, record) => (
        <Tag color="blue" className="font-medium">
          {record.label}
        </Tag>
      ),
    },
    {
      title: "Descrição",
      dataIndex: "description",
      key: "description",
      className: "text-muted-foreground",
    },
    {
      title: "Ação",
      key: "action",
      width: 120,
      align: "center",
      render: (_, record) => {
        const isAlreadyAdded = selectedModes.includes(record.value);

        return (
          <Space size="small">
            <Button
              variant="link"
              className="h-8 w-8 rounded-lg bg-emerald-500 text-white p-0 flex items-center justify-center border-0 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-emerald-500"
              onClick={() => onAddMode(record.value)}
              disabled={isAlreadyAdded}
              aria-label="Adicionar"
            >
              <Plus className="h-4 w-4" />
            </Button>
            <Button
              variant="link"
              className="h-8 w-8 rounded-lg bg-red-500 text-white p-0 flex items-center justify-center border-0 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-red-500"
              onClick={() => onRemoveMode(record.value)}
              disabled={!isAlreadyAdded}
              aria-label="Remover"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </Space>
        );
      },
    },
  ];

  return (
    <Modal
      open={open}
      onCancel={() => onOpenChange(false)}
      title="Gerenciar Modos de Inscrição"
      width="80vw"
      footer={null}
      className="max-h-[80vh]"
      styles={{
        body: {
          maxHeight: "calc(80vh - 110px)",
          overflowY: "auto",
          padding: "16px 0",
        },
      }}
    >
      <Space orientation="vertical" style={{ width: "100%" }}>
        {inscriptionModeOptions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              Nenhum modo de inscrição disponível
            </p>
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={inscriptionModeOptions}
            rowKey="value"
            pagination={false}
            size="middle"
            className="w-full"
            scroll={{ x: "max-content" }}
          />
        )}
      </Space>
    </Modal>
  );
}
