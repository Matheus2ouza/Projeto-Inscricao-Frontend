"use client";

import { useGlobalLoading } from "@/components/GlobalLoading";
import { ComboboxRegion } from "@/features/regions/components/ComboboxRegion";
import { useRegions } from "@/features/regions/hooks/useRegions";
import { Button } from "@/shared/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { useCurrentUser } from "@/shared/context/user-context";
import { cn } from "@/shared/lib/utils";
import type { SelectProps } from "antd";
import { DatePicker, Select, Space } from "antd";
import dayjs from "dayjs";
import { Upload } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { FormProvider } from "react-hook-form";
import { toast } from "sonner";
import useFormCreateEvent from "../../hooks/create/useFormCreateEvent";
import { InscriptionMode } from "../../types/create/createEvent";

const { RangePicker } = DatePicker;

interface RegisterFormEventProps {
  onSubmitSuccess?: () => void;
  roleSegment: "SUPER" | "ADMIN" | "MANAGER";
}

// Chave para armazenar o estado no sessionStorage
const FORM_STORAGE_KEY = "event-form-data";
let cachedImageFile: File | null = null;
let cachedImagePreviewUrl: string | null = null;

const clearCachedImage = () => {
  if (cachedImagePreviewUrl && cachedImagePreviewUrl.startsWith("blob:")) {
    URL.revokeObjectURL(cachedImagePreviewUrl);
  }
  cachedImageFile = null;
  cachedImagePreviewUrl = null;
};

export default function RegisterFormEvent({
  onSubmitSuccess,
  roleSegment,
}: RegisterFormEventProps) {
  const router = useRouter();
  const { user } = useCurrentUser();
  const { setLoading: setGlobalLoading } = useGlobalLoading();
  const { form, onSubmit, dateRange, setDateRange } = useFormCreateEvent();
  const { regions: fetchedRegions, loading: regionsLoading } = useRegions();
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const resolvedRole = (roleSegment ??
    (user?.role === "SUPER" ? "SUPER" : "ADMIN")) as
    | "SUPER"
    | "ADMIN"
    | "MANAGER";

  // Opções para o select de modos de inscrição
  const inscriptionModeOptions: SelectProps["options"] = [
    {
      label: "Com alocação",
      value: InscriptionMode.NORMAL,
    },
    {
      label: "Sem alocação",
      value: InscriptionMode.GUEST,
    },
  ];

  useEffect(() => {
    // Usuários não-super já possuem região definida no contexto
    if (resolvedRole !== "SUPER" && user?.region?.id) {
      const currentRegionId = form.getValues("regionId");

      if (currentRegionId !== user.region.id) {
        form.setValue("regionId", user.region.id);
      }
    }
  }, [resolvedRole, user?.region?.id, form]);

  useEffect(() => {
    setGlobalLoading(regionsLoading);
    return () => {
      setGlobalLoading(false);
    };
  }, [regionsLoading, setGlobalLoading]);

  // Remover preview da imagem ao resetar o formulário
  useEffect(() => {
    const subscription = form.watch((values: { image?: File | null }) => {
      if (!values.image && previewUrl) {
        // Se não há imagem mas há preview, limpar a preview
        setPreviewUrl(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        clearCachedImage();
      }
    });
    return () => subscription.unsubscribe();
  }, [form, previewUrl]);

  const regionOptions = useMemo(() => {
    return fetchedRegions.map((r) => ({
      label: r.name.toUpperCase(),
      value: r.id,
    }));
  }, [fetchedRegions]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const { success, id } = await onSubmit(event);

    if (success) {
      // Mostrar toast de sucesso
      const url = `${window.location.origin}/events/${id}`;
      toast.success("Evento criado!", {
        description: (
          <div className="space-y-2">
            <div className="text-xs break-all">{url}</div>
            <button
              type="button"
              className="px-2 py-1 text-xs rounded bg-primary text-primary-foreground"
              onClick={() => navigator.clipboard.writeText(url)}
            >
              Copiar URL
            </button>
          </div>
        ) as unknown as string,
      });
      if (onSubmitSuccess) {
        onSubmitSuccess();
      }
    }
  };

  // Função para validar o tipo de arquivo
  const isValidImageType = (file: File): boolean => {
    const acceptedTypes = ["image/jpeg", "image/png", "image/webp"];
    return acceptedTypes.includes(file.type);
  };

  // Função para validar o tamanho do arquivo (5MB)
  const isValidFileSize = (file: File): boolean => {
    const maxSize = 5 * 1024 * 1024; // 5MB em bytes
    return file.size <= maxSize;
  };

  // Função para mostrar erro de formato
  const showFormatError = () => {
    toast.error("Formato não suportado", {
      description:
        "Por favor, selecione uma imagem nos formatos JPG, PNG ou WebP.",
      duration: 5000,
    });
  };

  // Função para mostrar erro de tamanho
  const showSizeError = () => {
    toast.error("Arquivo muito grande", {
      description: "A imagem deve ter no máximo 5MB.",
      duration: 5000,
    });
  };

  // Função para lidar com o drag over
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  // Função para lidar com a seleção de arquivo
  const handleFileSelect = useCallback(
    (file: File) => {
      form.setValue("image", file);
      if (cachedImagePreviewUrl && cachedImagePreviewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(cachedImagePreviewUrl);
      }
      cachedImageFile = file;
      const url = URL.createObjectURL(file);
      cachedImagePreviewUrl = url;
      setPreviewUrl(url);
      toast.success("Imagem carregada com sucesso", {
        description: `Arquivo: ${file.name}`,
        duration: 3000,
      });
    },
    [form],
  );

  // Função para lidar com o drag leave
  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  // Função para lidar com o drop
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const files = e.dataTransfer.files;
      if (files && files.length > 0) {
        const file = files[0];

        if (!isValidImageType(file)) {
          showFormatError();
          return;
        }

        if (!isValidFileSize(file)) {
          showSizeError();
          return;
        }

        handleFileSelect(file);
      }
    },
    [handleFileSelect],
  );

  // Função para lidar com o clique na área de upload
  const handleAreaClick = () => {
    fileInputRef.current?.click();
  };

  // Função para lidar com a mudança no input de arquivo
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!isValidImageType(file)) {
        showFormatError();
        e.target.value = "";
        return;
      }

      if (!isValidFileSize(file)) {
        showSizeError();
        e.target.value = "";
        return;
      }

      handleFileSelect(file);
    }
  };

  // Função para remover a imagem
  const handleRemoveImage = () => {
    form.setValue("image", undefined);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    clearCachedImage();
    toast.info("Imagem removida", {
      description: "Você pode adicionar uma nova imagem.",
      duration: 3000,
    });
  };

  const handleCancel = () => {
    // Limpar storage também
    sessionStorage.removeItem(FORM_STORAGE_KEY);

    form.reset({
      name: "",
      regionId: "",
      accountIds: [],
      image: undefined,
    });
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setDateRange({
      from: undefined,
      to: undefined,
    });
    setIsDragging(false);
    clearCachedImage();

    // Redirecionar para a lista de eventos
    router.push(`/${resolvedRole}/events/manager`);
  };

  // Função para lidar com a mudança no RangePicker
  const handleDateRangeChange = (dates: any, dateStrings: [string, string]) => {
    if (dates && dates[0] && dates[1]) {
      setDateRange({
        from: dates[0].toDate(),
        to: dates[1].toDate(),
      });
    } else {
      setDateRange({
        from: undefined,
        to: undefined,
      });
    }
  };

  // Converter DateRange para valores do Ant Design - corrigido o tipo
  const rangePickerValue: [dayjs.Dayjs | null, dayjs.Dayjs | null] | null =
    dateRange?.from && dateRange?.to
      ? [dayjs(dateRange.from), dayjs(dateRange.to)]
      : null;

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-white/95 dark:bg-white/5 backdrop-blur-md rounded-xl shadow-md border border-gray-200/80 dark:border-white/10">
        <div className="p-6">
          <FormProvider {...form}>
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Seção: Informações Básicas */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-foreground">
                  Informações Básicas
                </h2>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                  {/* Coluna 1: Nome do Evento e Região */}
                  <div className="space-y-6 xl:col-span-2">
                    {/* Campo: Nome do Evento */}
                    <div className="space-y-3">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-medium">
                              Nome do Evento *
                            </FormLabel>
                            <p className="text-sm text-muted-foreground mt-1">
                              Escolha um nome claro e descritivo para o seu
                              evento.
                            </p>
                            <FormControl>
                              <Input
                                {...field}
                                type="text"
                                autoComplete="off"
                                placeholder="Digite o nome do evento"
                                className="w-full"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Campo: Região */}
                    {resolvedRole === "SUPER" && (
                      <div className="space-y-3">
                        <FormField
                          control={form.control}
                          name="regionId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-base font-medium">
                                Região do Evento *
                              </FormLabel>
                              <p className="text-sm text-muted-foreground mt-1">
                                Selecione a região onde o evento será realizado.
                              </p>
                              <FormControl>
                                <ComboboxRegion
                                  value={field.value as string}
                                  onChange={field.onChange}
                                  options={regionOptions}
                                  loading={regionsLoading}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}

                    {/* Campo: Contas responsáveis */}
                    <div className="space-y-3">
                      <FormField
                        control={form.control}
                        name="accountIds"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-medium">
                              Contas responsáveis *
                            </FormLabel>
                            <p className="text-sm text-muted-foreground mt-1">
                              Escolha um ou mais usuários que ficarão
                              responsáveis pelo evento.
                            </p>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Coluna 2: Upload de Imagem */}
                  <div className="space-y-6">
                    {/* Campo: Upload de Imagem */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-3">
                        <FormLabel className="text-base font-medium">
                          Imagem de Capa do Evento
                        </FormLabel>
                        {previewUrl && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={handleRemoveImage}
                            className="h-8 px-3"
                          >
                            Limpar imagem
                          </Button>
                        )}
                      </div>
                      <FormField
                        control={form.control}
                        name="image"
                        render={() => (
                          <FormItem>
                            <FormControl>
                              <div className="flex flex-col items-center justify-center w-full">
                                <input
                                  ref={fileInputRef}
                                  type="file"
                                  className="hidden"
                                  accept="image/jpeg, image/png, image/webp"
                                  onChange={handleFileChange}
                                />

                                {!previewUrl ? (
                                  <div
                                    className={cn(
                                      "flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-300",
                                      isDragging
                                        ? "border-primary bg-primary/5"
                                        : "border-border bg-background hover:bg-accent/50",
                                    )}
                                    onClick={handleAreaClick}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                  >
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                      <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                                      <p className="text-sm text-muted-foreground">
                                        <span className="font-semibold">
                                          Clique para upload
                                        </span>{" "}
                                        ou arraste uma imagem
                                      </p>
                                      <p className="text-xs text-muted-foreground mt-1">
                                        PNG, JPG, WEBP até 5MB
                                      </p>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="w-full space-y-3">
                                    <div className="relative w-full h-48 rounded-lg overflow-hidden border">
                                      <Image
                                        src={previewUrl}
                                        alt="Preview"
                                        fill
                                        className="object-cover"
                                      />
                                      <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2 text-xs">
                                        Imagem selecionada
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </FormControl>
                            <FormMessage />
                            <p className="text-sm text-muted-foreground mt-1">
                              Formatos recomendados: JPG, PNG ou WebP. Tamanho
                              ideal: 1200x600 pixels.
                            </p>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Seção: Data do Evento */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-foreground">
                  Data do Evento
                </h2>
                <p className="text-sm text-muted-foreground">
                  Selecione a data inicial e final do evento.
                </p>

                <div className="w-full max-w-lg">
                  {/* Campo: Período do Evento */}
                  <div className="space-y-3">
                    <div className="w-full">
                      <RangePicker
                        value={rangePickerValue}
                        onChange={handleDateRangeChange}
                        format="DD/MM/YYYY"
                        placeholder={["Data inicial", "Data final"]}
                        style={{ width: "100%" }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Seção: Localização */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-foreground">
                  Localização
                </h2>

                {/* Campo: Localização */}
                <div className="space-y-3">
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-medium">
                          Localização do Evento
                        </FormLabel>
                        <p className="text-sm text-muted-foreground mt-1">
                          Informe o endereço ou local onde o evento será
                          realizado.
                        </p>
                        <FormControl>
                          <Input
                            {...field}
                            type="text"
                            placeholder="Digite o endereço ou nome do local"
                            className="w-full"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Seção: Configurações de Inscrição */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-foreground">
                  Configurações de Inscrição
                </h2>
                <p className="text-sm text-muted-foreground">
                  Selecione os modos de inscrição disponíveis para este evento.
                </p>

                {/* Campo: Modos de Inscrição */}
                <div className="space-y-3">
                  <FormField
                    control={form.control}
                    name="allowedInscriptionModes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-medium">
                          Modos de Inscrição *
                        </FormLabel>
                        <FormControl>
                          <Space
                            style={{ width: "100%" }}
                            orientation="vertical"
                          >
                            <Select
                              mode="multiple"
                              allowClear
                              style={{ width: "100%" }}
                              placeholder="Selecione os modos de inscrição"
                              value={field.value}
                              onChange={(value) => field.onChange(value)}
                              options={inscriptionModeOptions}
                              className="w-full"
                            />
                          </Space>
                        </FormControl>
                        <FormMessage />
                        <p className="text-sm text-muted-foreground mt-1">
                          Escolha se o evento aceitará inscrições normais,
                          convidados, ou ambos.
                        </p>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Seção: Configurações */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-foreground">
                  Configurações
                </h2>

                {/* Campo: Abrir inscrições imediatamente */}
                <div className="space-y-3">
                  <FormField
                    control={form.control}
                    name="openImmediately"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Input
                            type="checkbox"
                            checked={field.value}
                            onChange={(e) => field.onChange(e.target.checked)}
                            className="h-4 w-4 mt-1"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-base font-medium">
                            Abrir inscrições imediatamente
                          </FormLabel>
                          <p className="text-sm text-muted-foreground">
                            Se marcado, as inscrições ficarão abertas assim que
                            o evento for criado.
                          </p>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Botões de Ação */}
              <div className="flex gap-4 justify-start pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  className="min-w-24"
                >
                  Cancelar
                </Button>
                <Button type="submit" className="min-w-24 dark:text-white">
                  Criar Evento
                </Button>
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    </div>
  );
}
