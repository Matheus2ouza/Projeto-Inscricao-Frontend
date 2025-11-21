"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { useGlobalLoading } from "@/components/GlobalLoading";
import { ComboboxAccount } from "@/features/accounts/components/ComboboxAccount";
import { ComboboxRegion } from "@/features/regions/components/ComboboxRegion";
import { useRegions } from "@/features/regions/hooks/useRegions";
import { CalendarRanger } from "@/shared/components/calendar-ranger";
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
import { MapPin, Upload } from "lucide-react";
import { FormProvider } from "react-hook-form";
import { toast } from "sonner";
import useFormCreateEvent from "../hooks/useFormCreateEvent";

interface RegisterFormEventProps {
  onSubmitSuccess?: () => void;
  roleSegment: "admin" | "super" | "manager";
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
  const searchParams = useSearchParams();
  const { user } = useCurrentUser();
  const { setLoading: setGlobalLoading } = useGlobalLoading();
  const { form, onSubmit, dateRange, setDateRange } = useFormCreateEvent();
  const { regions: fetchedRegions, loading: regionsLoading } = useRegions();
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [hasProcessedLocationParams, setHasProcessedLocationParams] =
    useState(false);
  const resolvedRole = (roleSegment ??
    (user?.role?.toLowerCase() === "super" ? "super" : "admin")) as
    | "super"
    | "admin"
    | "manager";

  useEffect(() => {
    // Usuários não-super já possuem região definida no contexto
    if (resolvedRole !== "super" && user?.region?.id) {
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

  // Salvar o estado do formulário no sessionStorage antes de navegar
  const saveFormState = useCallback(() => {
    const formData = form.getValues();
    const preview = cachedImagePreviewUrl ?? previewUrl;
    const state = {
      name: formData.name,
      regionId: formData.regionId,
      accountIds: Array.isArray(formData.accountIds) ? formData.accountIds : [],
      dateRange: dateRange,
      openImmediately: formData.openImmediately,
      previewUrl: preview, // Salvar a URL da preview
      hasImage: Boolean(cachedImageFile ?? formData.image), // Marcar que há uma imagem
    };
    sessionStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(state));
  }, [form, dateRange, previewUrl]);

  // Restaurar o estado do formulário do sessionStorage
  const restoreFormState = useCallback(() => {
    try {
      const saved = sessionStorage.getItem(FORM_STORAGE_KEY);
      if (saved) {
        const state = JSON.parse(saved);

        // Restaurar campos básicos
        if (state.name) form.setValue("name", state.name);
        if (state.regionId) form.setValue("regionId", state.regionId);
        if (Array.isArray(state.accountIds)) {
          form.setValue("accountIds", state.accountIds);
        }
        if (state.openImmediately !== undefined) {
          form.setValue("openImmediately", state.openImmediately);
        }

        // Restaurar dateRange (converte strings em Date)
        if (state.dateRange) {
          const parsedDateRange = {
            from: state.dateRange.from
              ? new Date(state.dateRange.from)
              : undefined,
            to: state.dateRange.to ? new Date(state.dateRange.to) : undefined,
          };
          setDateRange(parsedDateRange);
        }

        // Restaurar imagem do cache se disponível
        if (cachedImageFile) {
          form.setValue("image", cachedImageFile);
          if (!cachedImagePreviewUrl && state.previewUrl) {
            cachedImagePreviewUrl = state.previewUrl;
          }
          if (cachedImagePreviewUrl) {
            setPreviewUrl(cachedImagePreviewUrl);
          }
        }

        // Limpar o storage após restaurar
        sessionStorage.removeItem(FORM_STORAGE_KEY);
      }
    } catch (error) {
      console.error("Erro ao restaurar estado do formulário:", error);
      sessionStorage.removeItem(FORM_STORAGE_KEY);
    }
  }, [form, setDateRange]);

  // Processar dados de localização do sessionStorage
  const processLocationData = useCallback(() => {
    try {
      const locationData = sessionStorage.getItem("temp-location-data");
      if (locationData) {
        const { locationData: location } = JSON.parse(locationData);

        if (location && location.lat && location.lng && location.address) {
          form.setValue("location", {
            lat: parseFloat(location.lat),
            lng: parseFloat(location.lng),
            address: location.address,
          });

          toast.success("Localização definida com sucesso");
        }

        // Limpar os dados temporários após processar
        sessionStorage.removeItem("temp-location-data");
      }
    } catch (error) {
      console.error("Erro ao processar dados de localização:", error);
      sessionStorage.removeItem("temp-location-data");
    }
  }, [form]);

  // Efeito para capturar os parâmetros da URL quando voltamos da página de localização
  useEffect(() => {
    const lat = searchParams.get("lat");
    const lng = searchParams.get("lng");
    const address = searchParams.get("address");

    // Restaurar estado primeiro
    restoreFormState();

    // Processar dados de localização do sessionStorage
    processLocationData();

    // Só processa os parâmetros da URL se ainda não foram processados e se existem valores
    if (!hasProcessedLocationParams && lat && lng && address) {
      form.setValue("location", {
        lat: parseFloat(lat),
        lng: parseFloat(lng),
        address: address,
      });

      setHasProcessedLocationParams(true);

      // Limpar os parâmetros da URL para evitar repetição
      const newUrl = window.location.pathname;
      window.history.replaceState({}, "", newUrl);

      toast.success("Localização definida com sucesso");
    }
  }, [
    searchParams,
    form,
    hasProcessedLocationParams,
    restoreFormState,
    processLocationData,
  ]);

  // Restaurar estado quando o componente montar
  useEffect(() => {
    restoreFormState();
    setHasProcessedLocationParams(false);

    // Também processar dados de localização ao montar
    processLocationData();
  }, [restoreFormState, processLocationData]);

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

    // Limpar storage antes do submit
    sessionStorage.removeItem(FORM_STORAGE_KEY);
    sessionStorage.removeItem("temp-location-data"); // Limpar também dados de localização

    const { success, id } = await onSubmit(event);
    if (success && id) {
      // Se tiver uma função de callback, execute
      if (onSubmitSuccess) onSubmitSuccess();
      clearCachedImage();

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

      router.push(`/${resolvedRole}/events/manager`);
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
    [form]
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
    [handleFileSelect]
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

  const handleSelectLocation = () => {
    // Salvar estado antes de navegar
    saveFormState();

    const locationValue = form.getValues("location");
    const params = new URLSearchParams();

    if (locationValue?.lat && locationValue?.lng) {
      params.append("lat", locationValue.lat.toString());
      params.append("lng", locationValue.lng.toString());
    }
    if (locationValue?.address) {
      params.append("address", locationValue.address);
    }

    router.push(
      `/${resolvedRole}/events/manager/create/location?${params.toString()}`
    );
  };

  // Limpar todos os dados ao cancelar
  const handleCancel = () => {
    // Limpar storage também
    sessionStorage.removeItem(FORM_STORAGE_KEY);
    sessionStorage.removeItem("temp-location-data");

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
                    {resolvedRole === "super" && (
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
                            <FormControl>
                              <ComboboxAccount
                                value={
                                  Array.isArray(field.value) ? field.value : []
                                }
                                onChange={(selected) => {
                                  field.onChange(selected);
                                }}
                                showRole
                                roles={
                                  roleSegment === "super"
                                    ? ["SUPER", "ADMIN", "MANAGER"]
                                    : ["ADMIN", "MANAGER"]
                                }
                              />
                            </FormControl>
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
                                        : "border-border bg-background hover:bg-accent/50"
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
                      <CalendarRanger
                        dateRange={dateRange}
                        onDateRangeChange={setDateRange}
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
                  <FormLabel className="text-base font-medium">
                    Localização do Evento *
                  </FormLabel>
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="space-y-3">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={handleSelectLocation}
                              className="w-full h-12 border-dashed"
                            >
                              <MapPin className="h-4 w-4 mr-2" />
                              {field.value?.address
                                ? "Alterar Localização"
                                : "Selecionar Localização"}
                            </Button>

                            {field.value?.address && (
                              <div className="p-4 border rounded-lg bg-muted/50">
                                <div className="flex items-start gap-3">
                                  <MapPin className="h-4 w-4 text-primary mt-0.5" />
                                  <div className="flex-1">
                                    <p className="text-sm font-medium text-foreground">
                                      Local selecionado:
                                    </p>
                                    <p className="text-sm text-muted-foreground mt-1">
                                      {field.value.address}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <p className="text-sm text-muted-foreground">
                    Clique no botão acima para abrir o mapa e selecionar a
                    localização exata do evento.
                  </p>
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
