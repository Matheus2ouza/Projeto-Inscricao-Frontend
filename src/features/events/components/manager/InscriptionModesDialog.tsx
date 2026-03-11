"use client";

import { InscriptionMode } from "@/features/events/types/manager/eventManagerTypes";
import { Button, Modal, Space, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { Plus } from "lucide-react";

interface InscriptionModesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedModes: InscriptionMode[];
  onAddMode: (mode: InscriptionMode) => void;
}

// Opções para exibição dos modos de inscrição
const inscriptionModeOptions = [
  {
    value: InscriptionMode.NORMAL,
    label: "Normal",
    description: "Inscrições regulares para participantes",
  },
  {
    value: InscriptionMode.GUEST,
    label: "Convidados",
    description: "Inscrições para convidados especiais",
  },
];

export default function InscriptionModesDialog({
  open,
  onOpenChange,
  selectedModes,
  onAddMode,
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
      width: 150,
      align: "right",
      render: (_, record) => {
        const isAlreadyAdded = selectedModes.includes(record.value);
        return (
          <Button
            type="default"
            size="small"
            onClick={() => onAddMode(record.value)}
            disabled={isAlreadyAdded}
            icon={<Plus className="h-4 w-4" />}
            className="flex items-center gap-2"
          >
            {isAlreadyAdded ? "Adicionado" : "Adicionar"}
          </Button>
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
