import { Button } from "@/shared/components/ui/button";
import type { SelectProps } from "antd";
import {
  Card,
  DatePicker,
  Descriptions,
  Input,
  Radio,
  Select,
  Space,
  Tag,
} from "antd";
import dayjs from "dayjs";
import { AlertCircle, Edit3, Save, X } from "lucide-react";
import { useState } from "react";
import { Controller, FormProvider } from "react-hook-form";
import { toast } from "sonner";
import { useFormEditMember } from "../../hook/detailsMember/useFormEditMember";
import { Member } from "../../types/detailsMember/detailsMemberType";

export interface DetailsMemberProps {
  member: Member | null;
}

// Função para formatar gênero
const formatGender = (gender: string): string => {
  return gender === "MASCULINO" ? "Masculino" : "Feminino";
};

// Função para formatar CPF
const formatCPF = (cpf?: string): string => {
  if (!cpf) return "-";
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
};

// Função para formatar data
const formatDate = (date: Date): string => {
  return dayjs(date).format("DD/MM/YYYY");
};

// Função para obter cor do badge de gênero
const getGenderColor = (gender: string): string => {
  return gender === "MASCULINO" ? "blue" : "pink";
};

// Opções para tamanho de camiseta
const shirtSizeOptions: SelectProps["options"] = [
  { label: "PP", value: "PP" },
  { label: "P", value: "P" },
  { label: "M", value: "M" },
  { label: "G", value: "G" },
  { label: "GG", value: "GG" },
  { label: "XG", value: "XG" },
];

// Opções para tipo de camiseta
const shirtTypeOptions: SelectProps["options"] = [
  { label: "Tradicional", value: "TRADICIONAL" },
  { label: "Baby Look", value: "BABYLOOK" },
];

// Função para dividir os erros por vírgula e criar um array
const parseErrorMessages = (errorMessage: string): string[] => {
  return errorMessage.split(", ").map((err) => err.trim());
};

export default function DetailsMember({ member }: DetailsMemberProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  if (!member) {
    return null;
  }

  const { form, onSubmit } = useFormEditMember(member);

  const handleSave = async () => {
    setSubmitError(null);

    // Executar a validação do formulário
    const isValid = await form.trigger();
    if (!isValid) return;

    // Executar o submit através do hook
    const result = await onSubmit();

    if (result.success) {
      toast.success("Membro atualizado!", {
        description: "Dados do membro atualizados com sucesso",
      });
      setIsEditing(false);
    } else {
      // Exibir erro no formulário
      setSubmitError(result.error || "Não foi possível atualizar o membro.");
      toast.error(result.error || "Não foi possível atualizar o membro.");
    }
  };

  const handleCancel = () => {
    form.reset();
    setSubmitError(null);
    setIsEditing(false);
  };

  return (
    <div className="p-6">
      <Card
        title="Detalhes do Membro"
        className="w-full"
        extra={
          !isEditing ? (
            <Button
              size="sm"
              className="rounded-lg bg-blue-500 text-white px-3 py-1 flex items-center gap-2 border-0 hover:bg-blue-600"
              onClick={() => setIsEditing(true)}
              aria-label="Editar"
            >
              <Edit3 className="h-4 w-4" />
              Editar
            </Button>
          ) : (
            <Space size="small">
              <Button
                size="sm"
                className="rounded-lg bg-emerald-500 text-white px-3 py-1 flex items-center gap-2 border-0 hover:bg-emerald-600"
                onClick={handleSave}
                aria-label="Salvar"
              >
                <Save className="h-4 w-4" />
                Salvar
              </Button>
              <Button
                size="sm"
                className="rounded-lg bg-red-500 text-white px-3 py-1 flex items-center gap-2 border-0 hover:bg-red-600"
                onClick={handleCancel}
                aria-label="Cancelar"
              >
                <X className="h-4 w-4" />
                Cancelar
              </Button>
            </Space>
          )
        }
      >
        <FormProvider {...form}>
          <form>
            <Space
              orientation="vertical"
              size="large"
              style={{ width: "100%" }}
            >
              {/* Mensagem de erro do submit */}
              {submitError && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <div className="flex items-start gap-2 text-red-600 dark:text-red-400">
                    <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <div className="flex flex-col gap-1">
                      {parseErrorMessages(submitError).map(
                        (errorLine, index) => (
                          <span key={index} className="text-sm font-medium">
                            • {errorLine}
                          </span>
                        ),
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Dados do Membro */}
              <Descriptions
                title="Dados do Membro"
                bordered
                column={2}
                size="middle"
                className="bg-white/95 dark:bg-white/5"
              >
                <Descriptions.Item label="Nome" span={2}>
                  {isEditing ? (
                    <Controller
                      control={form.control}
                      name="name"
                      render={({ field, fieldState }) => (
                        <div>
                          <Input
                            {...field}
                            placeholder="Digite o nome"
                            className="w-full"
                            status={fieldState.error ? "error" : ""}
                          />
                          {fieldState.error && (
                            <span className="text-xs text-red-500 mt-1">
                              {fieldState.error.message}
                            </span>
                          )}
                        </div>
                      )}
                    />
                  ) : (
                    member.name
                  )}
                </Descriptions.Item>

                <Descriptions.Item label="Nome Preferido" span={2}>
                  {isEditing ? (
                    <Controller
                      control={form.control}
                      name="preferredName"
                      render={({ field }) => (
                        <Input
                          {...field}
                          value={field.value || ""}
                          placeholder="Digite o nome preferido"
                          className="w-full"
                        />
                      )}
                    />
                  ) : (
                    member.preferredName || "-"
                  )}
                </Descriptions.Item>

                <Descriptions.Item label="CPF">
                  {isEditing ? (
                    <Controller
                      control={form.control}
                      name="cpf"
                      render={({ field, fieldState }) => (
                        <div>
                          <Input
                            {...field}
                            value={field.value || ""}
                            placeholder="Digite o CPF"
                            maxLength={11}
                            className="w-full"
                            status={fieldState.error ? "error" : ""}
                          />
                          {fieldState.error && (
                            <span className="text-xs text-red-500 mt-1">
                              {fieldState.error.message}
                            </span>
                          )}
                        </div>
                      )}
                    />
                  ) : (
                    formatCPF(member.cpf)
                  )}
                </Descriptions.Item>

                <Descriptions.Item label="Data de Nascimento">
                  {isEditing ? (
                    <Controller
                      control={form.control}
                      name="birthDate"
                      render={({ field, fieldState }) => (
                        <div>
                          <DatePicker
                            style={{ width: "100%" }}
                            placeholder="Selecione a data de nascimento"
                            format="DD/MM/YYYY"
                            value={field.value ? dayjs(field.value) : null}
                            onChange={(date) => {
                              field.onChange(
                                date ? date.format("YYYY-MM-DD") : "",
                              );
                            }}
                            status={fieldState.error ? "error" : ""}
                          />
                          {fieldState.error && (
                            <span className="text-xs text-red-500 mt-1 block">
                              {fieldState.error.message}
                            </span>
                          )}
                        </div>
                      )}
                    />
                  ) : (
                    formatDate(member.birthDate)
                  )}
                </Descriptions.Item>

                <Descriptions.Item label="Gênero" span={2}>
                  {isEditing ? (
                    <Controller
                      control={form.control}
                      name="gender"
                      render={({ field, fieldState }) => (
                        <div>
                          <Radio.Group
                            {...field}
                            onChange={(e) => field.onChange(e.target.value)}
                            value={field.value}
                          >
                            <Space>
                              <Radio value="MASCULINO">Masculino</Radio>
                              <Radio value="FEMININO">Feminino</Radio>
                            </Space>
                          </Radio.Group>
                          {fieldState.error && (
                            <span className="text-xs text-red-500 mt-1 block">
                              {fieldState.error.message}
                            </span>
                          )}
                        </div>
                      )}
                    />
                  ) : (
                    <Tag color={getGenderColor(member.gender)}>
                      {formatGender(member.gender)}
                    </Tag>
                  )}
                </Descriptions.Item>
              </Descriptions>

              {/* Dados Adicionais */}
              {(member.shirtSize || member.shirtType || isEditing) && (
                <Descriptions
                  title="Dados Adicionais"
                  bordered
                  column={2}
                  size="middle"
                  className="bg-white/95 dark:bg-white/5"
                >
                  <Descriptions.Item label="Tamanho da Camiseta">
                    {isEditing ? (
                      <Controller
                        control={form.control}
                        name="shirtSize"
                        render={({ field }) => (
                          <Select
                            style={{ width: "100%" }}
                            placeholder="Selecione o tamanho"
                            options={shirtSizeOptions}
                            value={field.value || undefined}
                            onChange={(value) => field.onChange(value)}
                            allowClear
                          />
                        )}
                      />
                    ) : (
                      member.shirtSize || "-"
                    )}
                  </Descriptions.Item>

                  <Descriptions.Item label="Tipo da Camiseta">
                    {isEditing ? (
                      <Controller
                        control={form.control}
                        name="shirtType"
                        render={({ field }) => (
                          <Select
                            style={{ width: "100%" }}
                            placeholder="Selecione o tipo"
                            options={shirtTypeOptions}
                            value={field.value || undefined}
                            onChange={(value) => field.onChange(value)}
                            allowClear
                          />
                        )}
                      />
                    ) : member.shirtType === "TRADICIONAL" ? (
                      "Tradicional"
                    ) : member.shirtType === "BABYLOOK" ? (
                      "Baby Look"
                    ) : (
                      "-"
                    )}
                  </Descriptions.Item>
                </Descriptions>
              )}
            </Space>
          </form>
        </FormProvider>
      </Card>
    </div>
  );
}
