"use client";

import { formatDateTime } from "@/shared/utils/formatDate";
import { Image as AntImage, Card, Empty, Pagination, Tag } from "antd";
import { Receipt } from "../../types/list-receipts/listReceipts";

interface ListReceiptsProps {
  receipts: Receipt[];
  total: number;
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
}

export default function ListReceipts({
  receipts,
  total,
  page,
  pageCount,
  onPageChange,
}: ListReceiptsProps) {
  if (!receipts?.length) {
    return (
      <Empty
        description="Nenhum comprovante encontrado"
        style={{ marginTop: 24 }}
      />
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          gap: 16,
        }}
      >
        {receipts.map((receipt) => (
          <Card
            key={receipt.id}
            hoverable
            title={
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 12,
                  width: "100%",
                }}
              >
                <Tag color="blue">{receipt.status}</Tag>
                <span style={{ fontSize: 12, color: "rgba(0,0,0,0.65)" }}>
                  Criado em: {formatDateTime(receipt.createdAt)}
                </span>
              </div>
            }
            styles={{
              body: { padding: 0 },
            }}
          >
            {receipt.imageUrl ? (
              <AntImage
                src={receipt.imageUrl}
                alt={`Comprovante ${receipt.id}`}
                style={{
                  width: "100%",
                  height: 190,
                  objectFit: "cover",
                  cursor: "zoom-in",
                }}
                preview={{
                  mask: "Clique para fechar",
                }}
                fallback="Falha ao carregar imagem"
              />
            ) : (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: 190,
                }}
              >
                <span style={{ fontSize: 12, color: "rgba(0,0,0,0.65)" }}>
                  Nenhum comprovante disponível
                </span>
              </div>
            )}
          </Card>
        ))}
      </div>

      {pageCount > 1 && (
        <Pagination
          current={page}
          pageSize={pageCount > 0 ? Math.ceil(total / pageCount) : 10}
          total={total}
          onChange={onPageChange}
          showSizeChanger={false}
          hideOnSinglePage
          className="flex justify-center"
        />
      )}
    </div>
  );
}
