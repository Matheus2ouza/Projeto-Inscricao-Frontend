'use client';

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/shared/components/ui/drawer';
import { Button, Form, Input } from 'antd';
import { File, Loader2 } from 'lucide-react';

interface GenerateRoomPdfDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  participantsCount: number;
  onGeneratePdf: (title: string, observation?: string) => Promise<void>;
  isGenerating: boolean;
}

interface FormValues {
  title: string;
  observation?: string;
}

export default function GenerateRoomPdfDrawer({
  open,
  onOpenChange,
  participantsCount,
  onGeneratePdf,
  isGenerating,
}: GenerateRoomPdfDrawerProps) {
  const [form] = Form.useForm();

  const handleSubmit = async (values: FormValues) => {
    await onGeneratePdf(values.title, values.observation);
    form.resetFields();
  };

  const handleClose = () => {
    if (!isGenerating) {
      onOpenChange(false);
    }
  };

  return (
    <Drawer open={open} onOpenChange={handleClose}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Gerar PDF da Sala</DrawerTitle>
          <DrawerDescription>
            {participantsCount} participante(s) na lista
          </DrawerDescription>
        </DrawerHeader>

        <div className="p-6">
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{
              title: `Sala ${new Date().toLocaleDateString('pt-BR')}`,
            }}
          >
            <Form.Item
              name="title"
              label="Título da Sala"
              rules={[{ required: true, message: 'Informe o título da sala' }]}
            >
              <Input
                placeholder="Ex: Sala 01 - Palestra Principal"
                size="large"
              />
            </Form.Item>

            <Form.Item name="observation" label="Observação (opcional)">
              <Input.TextArea
                rows={4}
                placeholder="Informações adicionais sobre a sala ou observações importantes..."
              />
            </Form.Item>

            <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Total de Participantes:
                </span>
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  {participantsCount}
                </span>
              </div>
            </div>
          </Form>
        </div>

        <DrawerFooter>
          <Button onClick={handleClose} disabled={isGenerating}>
            Cancelar
          </Button>
          <Button
            type="primary"
            icon={
              isGenerating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <File className="h-4 w-4" />
              )
            }
            onClick={() => form.submit()}
            disabled={isGenerating || participantsCount === 0}
            className="bg-red-600 hover:bg-red-700"
          >
            {isGenerating ? 'Gerando...' : 'Gerar PDF'}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
