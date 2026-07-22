'use client';

import { LocalityToAccountCombobox } from '@/features/locality/components/LocalityToAccountCombobox';
import { Button } from '@/shared/components/ui/button';
import { Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { Eye } from 'lucide-react';
import { useState } from 'react';
import { useMembers } from '../hook/useMembers';
import { Member, genderType } from '../types/membersType';
import MemberCreateModal from './MemberCreateModal';

type MembersTableProps = {
  onViewDetailsMember: (memberId: string) => void;
};

// Função para formatar CPF
const formatCPF = (cpf?: string): string => {
  if (!cpf) return '-';
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

// Função para formatar gênero
const formatGender = (gender: genderType): string => {
  return gender === 'MASCULINO' ? 'Masculino' : 'Feminino';
};

// Função para obter cor do badge de gênero
const getGenderColor = (gender: genderType): string => {
  return gender === 'MASCULINO' ? 'blue' : 'pink';
};

export default function MembersTable({
  onViewDetailsMember,
}: MembersTableProps) {
  const [open, setOpen] = useState(false);
  const [selectedLocalityId, setSelectedLocalityId] = useState<string>('');

  // Hook de membros com filtro por localidade
  const { members, total, page, loading, error, setPage, refresh } = useMembers(
    {
      initialPage: 1,
      pageSize: 10,
      localityId: selectedLocalityId || undefined,
      autoFetch: true,
    },
  );

  // Função para calcular o índice global
  const calculateGlobalIndex = (index: number): number => {
    return (page - 1) * 10 + index + 1;
  };

  // Colunas da tabela
  const columns: ColumnsType<Member> = [
    {
      title: '#',
      key: 'index',
      width: 60,
      align: 'center',
      render: (_, __, index) => calculateGlobalIndex(index),
    },
    {
      title: 'Nome',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'CPF',
      key: 'cpf',
      render: (_, record) => formatCPF(record.cpf),
    },
    {
      title: 'Gênero',
      key: 'gender',
      align: 'center',
      render: (_, record) => (
        <Tag color={getGenderColor(record.gender)}>
          {formatGender(record.gender)}
        </Tag>
      ),
      filters: [
        { text: 'Masculino', value: 'MASCULINO' },
        { text: 'Feminino', value: 'FEMININO' },
      ],
      onFilter: (value, record) => record.gender === value,
    },
    {
      title: 'Localidade',
      key: 'locality',
      align: 'center',
      render: (_, record) => record.locality || '-',
      sorter: (a, b) => {
        const localityA = a.locality || '';
        const localityB = b.locality || '';
        return localityA.localeCompare(localityB);
      },
    },
    {
      title: 'Ações',
      key: 'actions',
      width: 100,
      align: 'center',
      render: (_, record) => (
        <Button
          variant="link"
          size="sm"
          className="bg-riodavida hover:bg-riodavida-dark flex h-6 w-6 items-center justify-center rounded-lg border-0 p-0 text-white"
          onClick={() => onViewDetailsMember(record.id)}
          aria-label="Detalhes"
        >
          <Eye className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Filtro de localidade e botão criar membro */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="w-full max-w-sm">
            <label className="text-riodavida-gray-dark dark:text-riodavida-gray mb-2 block text-sm font-medium">
              Filtrar por Localidade
            </label>
            <LocalityToAccountCombobox
              value={selectedLocalityId}
              onChange={setSelectedLocalityId}
              placeholder="Selecione uma localidade"
            />
            {!selectedLocalityId && (
              <p className="text-muted-foreground mt-2 text-sm">
                Selecione uma localidade para visualizar os membros.
              </p>
            )}
          </div>
          <Button
            variant="default"
            className="bg-riodavida hover:bg-riodavida-dark shrink-0 text-white"
            onClick={() => setOpen(true)}
          >
            Criar Membro
          </Button>
        </div>

        {/* Tabela */}
        <div className="liquid-card overflow-hidden rounded-lg">
          {loading ? (
            <div className="flex items-center justify-center p-12">
              <div className="border-riodavida/30 border-t-riodavida h-8 w-8 animate-spin rounded-full border-4" />
            </div>
          ) : error ? (
            <div className="text-destructive p-6 text-center">
              <p>Erro ao carregar membros: {error.message}</p>
              <Button
                onClick={refresh}
                className="bg-riodavida hover:bg-riodavida-dark mt-4 text-white"
              >
                Tentar Novamente
              </Button>
            </div>
          ) : members.length === 0 ? (
            <div className="text-muted-foreground p-12 text-center">
              {selectedLocalityId
                ? 'Nenhum membro encontrado para esta localidade.'
                : 'Selecione uma localidade para visualizar os membros.'}
            </div>
          ) : (
            <Table
              columns={columns}
              dataSource={members}
              rowKey="id"
              pagination={{
                current: page,
                pageSize: 10,
                total: total,
                onChange: setPage,
                showSizeChanger: false,
                showTotal: (total) => `Total de ${total} membros`,
              }}
              size="middle"
              className="w-full"
              scroll={{ x: 'max-content' }}
            />
          )}
        </div>

        {/* Modal de criação */}
        <MemberCreateModal
          open={open}
          onClose={() => setOpen(false)}
          onSuccess={refresh}
        />
      </div>
    </div>
  );
}
