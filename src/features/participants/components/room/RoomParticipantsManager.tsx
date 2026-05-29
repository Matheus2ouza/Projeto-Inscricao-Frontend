'use client';

import { Button, Card, Checkbox, Form, Input, Modal, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  ArrowDown,
  ArrowUp,
  File,
  Plus,
  Search,
  Trash2,
  UserPlus,
  Users,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import {
  GenerateParticipantsFromRoomPdfResponse,
  ParticipantsRoom,
} from '../../api/actions/reports/generateListParticipantsFromRoom';
import { ListNamesParticipants } from '../../types/room/listParticipantsRoomTypes';
import GenerateRoomPdfDrawer from './GenerateRoomPdfDrawer';

interface RoomParticipantsManagerProps {
  participants: ListNamesParticipants[];
  onRefresh: () => void;
  onGeneratePdf: (params: {
    title: string;
    observation?: string;
    listParticipants: ParticipantsRoom[];
  }) => Promise<GenerateParticipantsFromRoomPdfResponse>;
  isGeneratingPdf: boolean;
}

interface SelectedParticipant extends ListNamesParticipants {
  addedAt: Date;
  isCustom?: boolean;
  originalLocality?: string;
}

export default function RoomParticipantsManager({
  participants,
  onRefresh,
  onGeneratePdf,
  isGeneratingPdf,
}: RoomParticipantsManagerProps) {
  const [selectedParticipantIds, setSelectedParticipantIds] = useState<
    string[]
  >([]);
  const [participantsList, setParticipantsList] = useState<
    SelectedParticipant[]
  >([]);
  const [searchText, setSearchText] = useState('');
  const [pdfDrawerOpen, setPdfDrawerOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [tempIndexValue, setTempIndexValue] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  // Estados para paginação
  const [availablePage, setAvailablePage] = useState(1);
  const [availablePageSize, setAvailablePageSize] = useState(10);
  const [selectedPage, setSelectedPage] = useState(1);
  const [selectedPageSize, setSelectedPageSize] = useState(10);

  // Filtrar participantes não adicionados ainda
  const availableParticipants = useMemo(() => {
    const addedIds = new Set(participantsList.map((p) => p.id));
    return participants.filter((p) => !addedIds.has(p.id));
  }, [participants, participantsList]);

  // Filtrar por busca
  const filteredAvailableParticipants = useMemo(() => {
    if (!searchText) return availableParticipants;
    return availableParticipants.filter((p) =>
      p.name.toLowerCase().includes(searchText.toLowerCase()),
    );
  }, [availableParticipants, searchText]);

  // Adicionar participantes selecionados
  const handleAddParticipants = () => {
    if (selectedParticipantIds.length === 0) {
      toast.warning('Selecione pelo menos um participante');
      return;
    }

    const newParticipants = participants
      .filter((p) => selectedParticipantIds.includes(p.id))
      .map((p) => ({
        ...p,
        addedAt: new Date(),
        isCustom: false,
      }));

    setParticipantsList((prev) => [...prev, ...newParticipants]);
    setSelectedParticipantIds([]);
    toast.success(`${newParticipants.length} participante(s) adicionado(s)`);
  };

  // Adicionar participante personalizado
  const handleAddCustomParticipant = async () => {
    try {
      const values = await form.validateFields();
      const newCustomParticipant: SelectedParticipant = {
        id: `custom-${Date.now()}-${Math.random()}`,
        name: values.name,
        addedAt: new Date(),
        isCustom: true,
        originalLocality: values.locality || 'Acompanhante',
      };

      setParticipantsList((prev) => [...prev, newCustomParticipant]);
      toast.success('Acompanhante adicionado com sucesso');
      form.resetFields();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Erro ao validar formulário:', error);
    }
  };

  // Remover participante da lista
  const handleRemoveParticipant = (id: string) => {
    setParticipantsList((prev) => prev.filter((p) => p.id !== id));
    toast.warning('Participante removido');
  };

  // Remover todos os participantes
  const handleClearAll = () => {
    if (participantsList.length === 0) return;
    setParticipantsList([]);
    toast.success('Lista limpa');
  };

  // Mover participante para cima
  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newList = [...participantsList];
    [newList[index], newList[index - 1]] = [newList[index - 1], newList[index]];
    setParticipantsList(newList);
    toast.success('Participante movido para cima');
  };

  // Mover participante para baixo
  const handleMoveDown = (index: number) => {
    if (index === participantsList.length - 1) return;
    const newList = [...participantsList];
    [newList[index], newList[index + 1]] = [newList[index + 1], newList[index]];
    setParticipantsList(newList);
    toast.success('Participante movido para baixo');
  };

  // Mover para posição específica
  const handleMoveToPosition = (currentIndex: number, newPosition: number) => {
    if (newPosition < 1 || newPosition > participantsList.length) {
      toast.error(
        `Posição inválida. Deve ser entre 1 e ${participantsList.length}`,
      );
      return;
    }

    const targetIndex = newPosition - 1;
    if (currentIndex === targetIndex) return;

    const newList = [...participantsList];
    const [movedItem] = newList.splice(currentIndex, 1);
    newList.splice(targetIndex, 0, movedItem);
    setParticipantsList(newList);
    toast.success(`Participante movido para posição ${newPosition}`);
  };

  // Iniciar edição do índice
  const startEditIndex = (index: number) => {
    setEditingIndex(index);
    setTempIndexValue((index + 1).toString());
  };

  // Salvar edição do índice
  const saveEditIndex = (currentIndex: number) => {
    const newPosition = parseInt(tempIndexValue, 10);
    if (
      !isNaN(newPosition) &&
      newPosition >= 1 &&
      newPosition <= participantsList.length
    ) {
      handleMoveToPosition(currentIndex, newPosition);
    } else {
      toast.error(
        `Posição inválida. Digite um número entre 1 e ${participantsList.length}`,
      );
    }
    setEditingIndex(null);
    setTempIndexValue('');
  };

  // Cancelar edição
  const cancelEditIndex = () => {
    setEditingIndex(null);
    setTempIndexValue('');
  };

  // Ordenar por nome
  const handleSortByName = () => {
    const sortedList = [...participantsList].sort((a, b) =>
      a.name.localeCompare(b.name, 'pt-BR'),
    );
    setParticipantsList(sortedList);
    toast.success('Lista ordenada por nome');
  };

  // Abrir drawer para gerar PDF
  const handleOpenPdfDrawer = () => {
    if (participantsList.length === 0) {
      toast.warning('Adicione pelo menos um participante para gerar o PDF');
      return;
    }
    setPdfDrawerOpen(true);
  };

  // Gerar PDF - usando o tipo correto do arquivo de API
  const handleGeneratePdf = async (title: string, observation?: string) => {
    // Converter a lista para o formato esperado pelo backend
    const listForPdf: ParticipantsRoom[] = participantsList.map((p) => {
      if (p.isCustom) {
        return {
          id: p.id,
          name: p.name,
          isCustom: true,
          locality: p.originalLocality || 'Acompanhante',
        };
      }
      return {
        id: p.id,
      };
    });

    await onGeneratePdf({
      title,
      observation,
      listParticipants: listForPdf,
    });
    setPdfDrawerOpen(false);
  };

  // Handle key press no input de índice
  const handleIndexKeyPress = (
    e: React.KeyboardEvent<HTMLInputElement>,
    currentIndex: number,
  ) => {
    if (e.key === 'Enter') {
      saveEditIndex(currentIndex);
    } else if (e.key === 'Escape') {
      cancelEditIndex();
    }
  };

  // Colunas da tabela de participantes disponíveis
  const availableColumns: ColumnsType<ListNamesParticipants> = [
    {
      title: '',
      key: 'selection',
      width: 48,
      render: (_, record) => (
        <Checkbox
          checked={selectedParticipantIds.includes(record.id)}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedParticipantIds((prev) => [...prev, record.id]);
            } else {
              setSelectedParticipantIds((prev) =>
                prev.filter((id) => id !== record.id),
              );
            }
          }}
        />
      ),
    },
    {
      title: 'Nome',
      key: 'name',
      dataIndex: 'name',
      render: (name: string) => (
        <span className="font-medium text-gray-900 dark:text-white">
          {name}
        </span>
      ),
    },
  ];

  // Colunas da tabela de participantes selecionados
  const selectedColumns: ColumnsType<SelectedParticipant> = [
    {
      title: '#',
      key: 'index',
      width: 80,
      render: (_, __, index) => {
        const isEditing = editingIndex === index;
        return isEditing ? (
          <Input
            size="small"
            value={tempIndexValue}
            onChange={(e) => setTempIndexValue(e.target.value)}
            onBlur={() => saveEditIndex(index)}
            onKeyDown={(e) => handleIndexKeyPress(e, index)}
            className="w-16 text-center"
            autoFocus
          />
        ) : (
          <span
            className="cursor-pointer font-medium text-blue-600 hover:text-blue-800 hover:underline"
            onClick={() => startEditIndex(index)}
          >
            {index + 1}
          </span>
        );
      },
    },
    {
      title: 'Nome',
      key: 'name',
      dataIndex: 'name',
      render: (name: string, record: SelectedParticipant) => (
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-900 dark:text-white">
            {name}
          </span>
          {record.isCustom && (
            <Tag color="orange" className="text-xs">
              Acompanhante
            </Tag>
          )}
        </div>
      ),
    },
    {
      title: 'Localidade',
      key: 'locality',
      width: 150,
      render: (_, record) => (
        <span className="text-gray-600 dark:text-gray-400">
          {record.originalLocality || (record.isCustom ? 'Acompanhante' : '-')}
        </span>
      ),
    },
    {
      title: 'Ordem',
      key: 'order',
      width: 100,
      align: 'center',
      render: (_, record, index) => (
        <div className="flex justify-center gap-1">
          <Button
            type="text"
            size="small"
            icon={<ArrowUp className="h-3 w-3" />}
            onClick={() => handleMoveUp(index)}
            disabled={index === 0}
            className="hover:text-blue-600"
          />
          <Button
            type="text"
            size="small"
            icon={<ArrowDown className="h-3 w-3" />}
            onClick={() => handleMoveDown(index)}
            disabled={index === participantsList.length - 1}
            className="hover:text-blue-600"
          />
        </div>
      ),
    },
    {
      title: 'Ações',
      key: 'actions',
      width: 80,
      align: 'center',
      render: (_, record) => (
        <Button
          type="text"
          danger
          icon={<Trash2 className="h-4 w-4" />}
          onClick={() => handleRemoveParticipant(record.id)}
          size="small"
        />
      ),
    },
  ];

  return (
    <>
      <GenerateRoomPdfDrawer
        open={pdfDrawerOpen}
        onOpenChange={setPdfDrawerOpen}
        participantsCount={participantsList.length}
        onGeneratePdf={handleGeneratePdf}
        isGenerating={isGeneratingPdf}
      />

      {/* Modal para adicionar acompanhante */}
      <Modal
        title="Adicionar Participante Personalizado"
        open={isModalOpen}
        onOk={handleAddCustomParticipant}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
        }}
        okText="Adicionar"
        cancelText="Cancelar"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Nome do Participante"
            rules={[{ required: true, message: 'Por favor, informe o nome' }]}
          >
            <Input placeholder="Ex: João Silva" />
          </Form.Item>
          <Form.Item name="locality" label="Localidade (opcional)">
            <Input placeholder="Ex: Teresina" />
          </Form.Item>
        </Form>
      </Modal>

      <div className="space-y-6">
        {/* Cards de resumo */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <Card className="border-0 bg-gradient-to-br from-blue-50 to-white shadow-sm dark:from-blue-900/20 dark:to-gray-800">
            <div className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold tracking-wider text-blue-600 uppercase dark:text-blue-400">
                    Participantes Disponíveis
                  </p>
                  <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                    {availableParticipants.length}
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-800">
                  <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </div>
          </Card>

          <Card className="border-0 bg-gradient-to-br from-green-50 to-white shadow-sm dark:from-green-900/20 dark:to-gray-800">
            <div className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold tracking-wider text-green-600 uppercase dark:text-green-400">
                    Participantes no Quarto
                  </p>
                  <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                    {participantsList.length}
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-800">
                  <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Lista de participantes disponíveis */}
        <Card
          title={
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              <span>Participantes Disponíveis</span>
              <Tag color="blue">{availableParticipants.length}</Tag>
            </div>
          }
          className="border-0 shadow-md"
          extra={
            <div className="flex gap-2">
              <Input
                placeholder="Buscar participante..."
                prefix={<Search className="h-4 w-4 text-gray-400" />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                allowClear
                className="w-64"
              />
              <Button
                type="primary"
                icon={<Plus className="h-4 w-4" />}
                onClick={handleAddParticipants}
                disabled={selectedParticipantIds.length === 0}
              >
                Adicionar ({selectedParticipantIds.length})
              </Button>
            </div>
          }
        >
          <Table
            columns={availableColumns}
            dataSource={filteredAvailableParticipants}
            rowKey="id"
            size="middle"
            pagination={{
              current: availablePage,
              pageSize: availablePageSize,
              showSizeChanger: true,
              showTotal: (total) => `${total} participantes`,
              pageSizeOptions: ['10', '20', '50', '100'],
              onChange: (page, pageSize) => {
                setAvailablePage(page);
                setAvailablePageSize(pageSize);
              },
              onShowSizeChange: (current, size) => {
                setAvailablePageSize(size);
                setAvailablePage(1);
              },
            }}
            locale={{ emptyText: 'Nenhum participante disponível' }}
          />
        </Card>

        {/* Lista de participantes selecionados */}
        <Card
          title={
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              <span>Participantes no Quarto</span>
              <Tag color="green">{participantsList.length}</Tag>
            </div>
          }
          className="border-0 shadow-md"
          extra={
            <div className="flex gap-2">
              <Button
                icon={<UserPlus className="h-4 w-4" />}
                onClick={() => setIsModalOpen(true)}
              >
                Participante Personalizado
              </Button>
              <Button
                onClick={handleSortByName}
                disabled={participantsList.length === 0}
                icon={<ArrowUp className="h-4 w-4" />}
              >
                Ordenar por Nome
              </Button>
              <Button
                danger
                onClick={handleClearAll}
                disabled={participantsList.length === 0}
                icon={<Trash2 className="h-4 w-4" />}
              >
                Limpar Lista
              </Button>
              <Button
                type="primary"
                icon={<File className="h-4 w-4" />}
                onClick={handleOpenPdfDrawer}
                disabled={participantsList.length === 0 || isGeneratingPdf}
                className="bg-red-600 hover:bg-red-700"
              >
                {isGeneratingPdf ? 'Gerando...' : 'Gerar PDF'}
              </Button>
            </div>
          }
        >
          <Table
            columns={selectedColumns}
            dataSource={participantsList}
            rowKey="id"
            size="middle"
            pagination={{
              current: selectedPage,
              pageSize: selectedPageSize,
              showSizeChanger: true,
              showTotal: (total) => `${total} participantes`,
              pageSizeOptions: ['10', '20', '50', '100'],
              onChange: (page, pageSize) => {
                setSelectedPage(page);
                setSelectedPageSize(pageSize);
              },
              onShowSizeChange: (current, size) => {
                setSelectedPageSize(size);
                setSelectedPage(1);
              },
            }}
            locale={{ emptyText: 'Nenhum participante adicionado' }}
          />
        </Card>
      </div>
    </>
  );
}
