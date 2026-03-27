"use client";

import { useFormCreateGuestInscription } from "@/features/guest/hook/guestInscription/useFormCreateGuestInscription";
import type { ImageSwatches } from "@/features/guest/hook/guestInscription/useImagePalette";
import {
  guestInscriptionSchema,
  GuestInscriptionSchemaType,
} from "@/features/guest/schema/guestInscription/guestInscriptionSchema";
import {
  Event,
  InscriptionStatus,
  RegisterGuestInscriptionResponse,
} from "@/features/guest/types/guestInscription/guestInscriptionTypes";
import { GuestInscriptionAlready } from "@/shared/components/GuestInscriptionAlready";
import { AspectRatio } from "@/shared/components/ui/aspect-ratio";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/shared/components/ui/command";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import { cn } from "@/shared/lib/utils";
import { formatDate } from "@/shared/utils/formatDate";
import { getFormatCurrency } from "@/shared/utils/getFormatCurrency";
import { getInitial } from "@/shared/utils/getInitials";
import { getWithExpiry, setWithExpiry } from "@/shared/utils/storageWithExpiry";
import { zodResolver } from "@hookform/resolvers/zod";
import { DatePicker, Input } from "antd";
import dayjs from "dayjs";
import {
  AlertCircle,
  Calendar,
  Check,
  ChevronsUpDown,
  Info,
  User,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { InscriptionSuccessModal } from "./InscriptionSuccessModal";
import { InscriptionTypeSelector } from "./InscriptionTypeCard";

interface RegisterGuestProps {
  event: Event | null;
  palette: string[];
  isDark: boolean;
  swatches?: ImageSwatches;
  onViewInscription: () => void;
}

export function RegisterGuest({
  event,
  palette,
  isDark,
  swatches,
  onViewInscription,
}: RegisterGuestProps) {
  if (!event) {
    return (
      <div className="rounded-2xl border border-gray-200/80 dark:border-white/10 bg-white/90 dark:bg-white/5 backdrop-blur-md p-10 text-center">
        <h2 className="text-2xl font-semibold mb-2 text-gray-900 dark:text-white">
          Evento não encontrado
        </h2>
        <p className="text-muted-foreground">
          O evento solicitado não está disponível.
        </p>
      </div>
    );
  }

  const [open, setOpen] = useState(false);
  const [openGender, setOpenGender] = useState(false);
  const [openShirtSize, setOpenShirtSize] = useState(false);
  const [openShirtType, setOpenShirtType] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [successData, setSuccessData] =
    useState<RegisterGuestInscriptionResponse | null>(null);
  const [paymentCountdownSeconds, setPaymentCountdownSeconds] = useState<
    number | null
  >(null);
  const [alreadyDialogOpen, setAlreadyDialogOpen] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [typeInscriptionId, setTypeInscriptionId] = useState<string>("");
  const [infoPopoverOpen, setInfoPopoverOpen] = useState(false);
  const throttleKey = "guest_inscription_already_throttle_5m";

  useEffect(() => {
    if (
      !successModalOpen ||
      successData?.status !== InscriptionStatus.PENDING
    ) {
      setPaymentCountdownSeconds(null);
      return;
    }

    setPaymentCountdownSeconds(30 * 60);
    const intervalId = window.setInterval(() => {
      setPaymentCountdownSeconds((prev) => {
        if (prev === null) return prev;
        return prev > 0 ? prev - 1 : 0;
      });
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [successModalOpen, successData?.status]);

  useEffect(() => {
    if (successModalOpen) {
      setAlreadyDialogOpen(false);
      return;
    }

    const cached = getWithExpiry<{
      eventId: string;
      confirmationCode: string;
      thereIsPayment?: boolean;
    }>("guest_inscription");

    if (
      !cached ||
      cached.eventId !== event.id ||
      !cached.confirmationCode ||
      cached.thereIsPayment
    ) {
      setAlreadyDialogOpen(false);
      return;
    }

    const throttled = getWithExpiry<boolean>(throttleKey);
    if (throttled) {
      setAlreadyDialogOpen(false);
      return;
    }

    setAlreadyDialogOpen(true);
  }, [event.id, successModalOpen, throttleKey]);

  const genderOptions = [
    { value: "MASCULINO", label: "Masculino" },
    { value: "FEMININO", label: "Feminino" },
  ];
  const shirtSizeOptions = [
    { value: "PP", label: "PP" },
    { value: "P", label: "P" },
    { value: "M", label: "M" },
    { value: "G", label: "G" },
    { value: "GG", label: "GG" },
    { value: "XG", label: "XG" },
  ];
  const shirtTypeOptions = [
    { value: "TRADICIONAL", label: "Tradicional" },
    { value: "BABYLOOK", label: "Babylook" },
  ];

  type GuestFormValues = GuestInscriptionSchemaType & {
    typeInscriptionId: string;
  };

  const formSchema = useMemo(
    () =>
      guestInscriptionSchema.extend({
        typeInscriptionId: z
          .string()
          .trim()
          .min(1, "Selecione o tipo de inscrição"),
      }),
    [],
  );

  const { initialValues, submit } = useFormCreateGuestInscription(
    event.id,
    typeInscriptionId,
  );

  const form = useForm<GuestFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...initialValues,
      birthDate: "",
      typeInscriptionId: "",
    },
    mode: "onSubmit",
  });

  const formData = form.watch();
  const isSubmitting = form.formState.isSubmitting;
  const control = form.control;

  useEffect(() => {
    const current = formData.typeInscriptionId?.trim() ?? "";
    if (current === typeInscriptionId) return;
    setTypeInscriptionId(current);
  }, [formData.typeInscriptionId, typeInscriptionId]);

  const typeInscriptions = useMemo(() => {
    const birthDate = formData.birthDate?.trim();
    if (!birthDate || birthDate.length !== 10) return event.typeInscriptions;

    const birth = new Date(birthDate);
    if (Number.isNaN(birth.getTime())) return event.typeInscriptions;

    return event.typeInscriptions.filter((t) => {
      if (!t.rule) return true;
      const ruleDate = new Date(t.rule as unknown as string);
      if (Number.isNaN(ruleDate.getTime())) return true;
      return birth.getTime() >= ruleDate.getTime();
    });
  }, [event.typeInscriptions, formData.birthDate]);

  useEffect(() => {
    const current = form.getValues("typeInscriptionId")?.trim();
    if (!current) return;

    const stillValid = typeInscriptions.some(
      (t) => (t.id || t.description) === current,
    );
    if (stillValid) return;

    form.setValue("typeInscriptionId", "");
    setTypeInscriptionId("");
  }, [form, typeInscriptions]);

  const formatCpf = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    const part1 = digits.slice(0, 3);
    const part2 = digits.slice(3, 6);
    const part3 = digits.slice(6, 9);
    const part4 = digits.slice(9, 11);

    let out = part1;
    if (part2) out += `.${part2}`;
    if (part3) out += `.${part3}`;
    if (part4) out += `-${part4}`;
    return out;
  };

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    const ddd = digits.slice(0, 2);
    const first = digits.slice(2, 7);
    const last = digits.slice(7, 11);

    if (!ddd) return "";
    if (digits.length <= 2) return `(${ddd}`;
    if (digits.length <= 7) return `(${ddd}) ${first}`;
    return `(${ddd}) ${first}-${last}`;
  };

  const onSubmit = form.handleSubmit(async (values) => {
    setSubmitError(null);

    const result = await submit(values);
    if (result.error) {
      setSubmitError(result.error);
      return;
    }

    if (result.success) {
      setWithExpiry("guest_inscription", {
        eventId: event.id,
        confirmationCode: result.success.confirmationCode,
        thereIsPayment: event.paymentEnabled,
      });

      setSuccessData(result.success);
      setSuccessModalOpen(true);
    }
  });

  const calculateMaxAge = (ruleDate?: Date) => {
    if (!ruleDate) return "";

    const today = new Date();
    const rule = new Date(ruleDate);
    const age = today.getFullYear() - rule.getFullYear();

    const hasHadBirthday =
      today.getMonth() > rule.getMonth() ||
      (today.getMonth() === rule.getMonth() &&
        today.getDate() >= rule.getDate());

    return hasHadBirthday ? age : age - 1;
  };

  const preferredSwatch = useMemo(() => {
    if (!swatches) return null;

    return (
      (isDark ? swatches.DarkVibrant : swatches.LightVibrant) ??
      swatches.Vibrant ??
      swatches.Muted ??
      swatches.DarkMuted ??
      swatches.LightMuted
    );
  }, [isDark, swatches]);

  const recommendedTitleColor =
    preferredSwatch?.titleTextColor ?? (isDark ? "#ffffff" : "#111111");
  const recommendedBodyColor =
    preferredSwatch?.bodyTextColor ??
    (isDark ? "rgba(255,255,255,0.78)" : "#374151");

  if (!event) {
    return (
      <div className="rounded-2xl border border-gray-200/80 dark:border-white/10 bg-white/90 dark:bg-white/5 backdrop-blur-md p-10 text-center">
        <h2 className="text-2xl font-semibold mb-2 text-gray-900 dark:text-white">
          Evento não encontrado
        </h2>
        <p className="text-muted-foreground">
          O evento solicitado não está disponível.
        </p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="rounded-2xl border border-gray-200/80 dark:border-white/10 bg-white/90 dark:bg-white/5 backdrop-blur-md p-10 text-center">
        <h2 className="text-2xl font-semibold mb-2 text-gray-900 dark:text-white">
          Evento não encontrado
        </h2>
        <p className="text-muted-foreground">
          O evento solicitado não está disponível.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <GuestInscriptionAlready
        open={alreadyDialogOpen}
        onOpenChange={(open: boolean) => {
          if (!open) {
            setWithExpiry(throttleKey, true, 5 * 60 * 1000);
          }
          setAlreadyDialogOpen(open);
        }}
        onView={() => {
          setWithExpiry(throttleKey, true, 5 * 60 * 1000);
          setAlreadyDialogOpen(false);
          onViewInscription();
        }}
      />
      {/* Event Details Card */}
      <Card
        className={`border-0 shadow-sm overflow-hidden backdrop-blur-md border ${isDark ? "bg-white/20 border-white/30" : "bg-black/5 border-black/10"}`}
      >
        <CardContent className="p-0">
          <div className="flex flex-col lg:flex-row p-2">
            {/* Imagem do Evento */}
            <div className="w-full lg:w-1/3">
              <AspectRatio
                ratio={16 / 9}
                className="relative overflow-hidden rounded-2xl"
              >
                {event.imageUrl ? (
                  <Image
                    src={event.imageUrl}
                    alt={event.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 300px"
                    priority
                  />
                ) : (
                  <div className="h-full w-full bg-muted flex items-center justify-center">
                    <div className="text-center">
                      <div
                        className="text-5xl font-semibold text-muted-foreground mb-2"
                        style={{ color: recommendedBodyColor }}
                      >
                        {getInitial(event.name)}
                      </div>
                      <p
                        className="text-sm text-muted-foreground"
                        style={{ color: recommendedBodyColor }}
                      >
                        Sem imagem
                      </p>
                    </div>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent lg:hidden" />
                <div className="absolute bottom-0 left-0 p-6 lg:hidden">
                  <h1
                    className="text-xl font-bold text-white uppercase shadow-sm"
                    style={{ color: recommendedTitleColor }}
                  >
                    {event.name}
                  </h1>
                </div>
              </AspectRatio>
            </div>

            {/* Informações do Evento (Desktop) */}
            <div className="flex-1 p-6 lg:p-8 space-y-6">
              <div className="hidden lg:block">
                <h1
                  className="text-4xl font-bold tracking-tight uppercase text-foreground [text-shadow:0_1px_4px_rgba(0,0,0,0.4)]"
                  style={{ color: recommendedTitleColor }}
                >
                  {event.name}
                </h1>
              </div>

              <div
                className="flex flex-wrap items-center gap-6 text-muted-foreground"
                style={{ color: recommendedBodyColor }}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="p-2 bg-primary/10 rounded-full"
                    style={{ color: palette[0] }}
                  >
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-medium uppercase tracking-wider">
                      Início
                    </span>
                    <span
                      className="text-sm font-semibold text-foreground"
                      style={{ color: recommendedTitleColor }}
                    >
                      {formatDate(event.startDate)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className="p-2 bg-primary/10 rounded-full"
                    style={{ color: palette[0] }}
                  >
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-medium uppercase tracking-wider">
                      Fim
                    </span>
                    <span
                      className="text-sm font-semibold text-foreground"
                      style={{ color: recommendedTitleColor }}
                    >
                      {formatDate(event.endDate)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between gap-4">
                  <div
                    className="text-xs font-medium uppercase tracking-wider text-muted-foreground"
                    style={{ color: recommendedBodyColor }}
                  >
                    Tipos de inscrição
                  </div>
                </div>

                {event.typeInscriptions.length > 0 ? (
                  <>
                    {/* Layout para desktop - Grid lado a lado */}
                    <div className="hidden lg:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {event.typeInscriptions.map((type) => (
                        <div
                          key={type.id || type.description}
                          className={cn(
                            "rounded-lg border p-4 transition-all hover:shadow-sm",
                            type.specialType
                              ? "border-amber-200/30 bg-amber-50/10"
                              : "border-white/20 bg-white/5",
                          )}
                        >
                          <div className="flex items-start justify-between gap-2 mb-3">
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <div
                                  className="text-sm font-medium truncate"
                                  style={{ color: recommendedTitleColor }}
                                >
                                  {type.description}
                                </div>
                                {type.specialType && (
                                  <Badge
                                    variant="outline"
                                    className={cn(
                                      "shrink-0 text-xs",
                                      type.specialType
                                        ? "border-amber-300 bg-amber-100 text-amber-800 dark:border-amber-700 dark:bg-amber-950/50 dark:text-amber-300"
                                        : "",
                                    )}
                                  >
                                    Especial
                                  </Badge>
                                )}
                                {type.specialType && (
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-5 w-5 p-0 text-muted-foreground hover:text-amber-600"
                                        style={{ color: recommendedBodyColor }}
                                      >
                                        <Info className="h-3.5 w-3.5" />
                                      </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-80 p-4">
                                      <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                          <AlertCircle className="h-4 w-4 text-amber-500" />
                                          <h4 className="font-semibold text-sm">
                                            Inscrição Especial
                                          </h4>
                                        </div>
                                        <p
                                          className="text-sm text-muted-foreground"
                                          style={{
                                            color: recommendedBodyColor,
                                          }}
                                        >
                                          Esta é uma inscrição marcada como{" "}
                                          <strong>&quot;Especial&quot;</strong>{" "}
                                          e necessita de aprovação. Após a
                                          inscrição, os organizadores analisarão
                                          sua solicitação.
                                        </p>
                                        <p
                                          className="text-xs text-muted-foreground mt-2"
                                          style={{
                                            color: recommendedBodyColor,
                                          }}
                                        >
                                          Você receberá uma notificação quando
                                          sua inscrição for aprovada.
                                        </p>
                                      </div>
                                    </PopoverContent>
                                  </Popover>
                                )}
                              </div>
                              <div
                                className="text-xs text-muted-foreground"
                                style={{ color: recommendedBodyColor }}
                              >
                                {type.rule &&
                                  `Até ${calculateMaxAge(type.rule)} anos`}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center justify-between pt-3 border-t">
                            <div
                              className="text-xs text-muted-foreground whitespace-nowrap"
                              style={{ color: recommendedBodyColor }}
                            >
                              {type.specialType
                                ? "Necessita aprovação"
                                : "Inscrição direta"}
                            </div>
                            <div
                              className="text-sm font-semibold whitespace-nowrap"
                              style={{ color: recommendedTitleColor }}
                            >
                              {getFormatCurrency(type.value)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Layout para mobile - Lista vertical */}
                    <div className="lg:hidden rounded-lg border bg-muted/20 overflow-hidden">
                      {event.typeInscriptions.map((type) => (
                        <div
                          key={type.id || type.description}
                          className={cn(
                            "flex items-center justify-between gap-4 px-4 py-3 border-b last:border-b-0",
                            type.specialType
                              ? "bg-amber-50/60 dark:bg-amber-950/30"
                              : "",
                          )}
                        >
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <div
                                className="text-sm font-medium truncate"
                                style={{ color: recommendedTitleColor }}
                              >
                                {type.description}
                              </div>
                              {type.specialType && (
                                <Badge
                                  variant="secondary"
                                  className={cn(
                                    "shrink-0",
                                    type.specialType
                                      ? "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200"
                                      : "",
                                  )}
                                >
                                  Especial
                                </Badge>
                              )}
                              {type.specialType && (
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <Button
                                      className="h-5 w-5"
                                      variant="ghost"
                                      style={{ color: recommendedBodyColor }}
                                    >
                                      <Info className="h-3.5 w-3.5" />
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-80 p-4">
                                    <div className="space-y-2">
                                      <div className="flex items-center gap-2">
                                        <AlertCircle className="h-4 w-4" />
                                        <h4 className="font-semibold text-sm">
                                          Inscrição Especial
                                        </h4>
                                      </div>
                                      <p
                                        className="text-sm"
                                        style={{ color: recommendedBodyColor }}
                                      >
                                        Esta é uma inscrição marcada como{" "}
                                        <strong>&quot;Especial&quot;</strong> e
                                        necessita de aprovação. Após a
                                        inscrição, os organizadores analisarão
                                        sua solicitação.
                                      </p>
                                      <p
                                        className="text-xs mt-2"
                                        style={{ color: recommendedBodyColor }}
                                      >
                                        Você receberá uma notificação quando sua
                                        inscrição for aprovada.
                                      </p>
                                    </div>
                                  </PopoverContent>
                                </Popover>
                              )}
                            </div>
                            <div
                              className="text-xs text-muted-foreground"
                              style={{ color: recommendedBodyColor }}
                            >
                              {type.rule &&
                                `Até ${calculateMaxAge(type.rule)} anos`}
                            </div>
                          </div>

                          <div
                            className="text-sm font-semibold whitespace-nowrap flex-shrink-0 ml-4"
                            style={{ color: recommendedTitleColor }}
                          >
                            {getFormatCurrency(type.value)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div
                    className="text-sm text-muted-foreground"
                    style={{ color: recommendedBodyColor }}
                  >
                    Nenhum tipo de inscrição disponível.
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Inscription Form */}
      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-8">
          <Card
            className={`backdrop-blur-md border ${isDark ? "bg-white/20 border-white/20" : "bg-black/5 border-black/10"}`}
          >
            <CardHeader>
              <CardTitle
                className="flex items-center gap-2 text-xl [text-shadow:0_1px_4px_rgba(0,0,0,0.4)]"
                style={{ color: recommendedTitleColor }}
              >
                <User
                  className="w-5 h-5 [text-shadow:0_1px_4px_rgba(0,0,0,0.4)]"
                  style={{ color: recommendedTitleColor }}
                />
                Dados para Inscrição
              </CardTitle>
            </CardHeader>
            <CardContent
              className={`space-y-6 ${isDark ? "dark-inputs" : "light-inputs"}
                ${
                  isDark
                    ? "[&_input]:bg-white/20 [&_input]:text-white [&_input]:border-white/20 [&_label]:text-white/80"
                    : "[&_input]:bg-white [&_input]:text-gray-900 [&_input]:border-gray-200 [&_label]:text-gray-700"
                }`}
            >
              <FormField
                control={control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome Completo</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite seu nome" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="preferredName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Como quer ser chamado</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Como você quer ser chamado"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail</FormLabel>
                    <FormControl>
                      <Input placeholder="seu@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="(99) 9XXXX-XXXX"
                        {...field}
                        onChange={(e) =>
                          field.onChange(formatPhone(e.target.value))
                        }
                        maxLength={15}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="cpf"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CPF</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="000.000.000-00"
                        {...field}
                        onChange={(e) =>
                          field.onChange(formatCpf(e.target.value))
                        }
                        maxLength={14}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="locality"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Localidade</FormLabel>
                    <FormControl>
                      <Input placeholder="Sua cidade" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={control}
                  name="birthDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data de Nascimento</FormLabel>
                      <FormControl>
                        <DatePicker
                          {...field}
                          value={field.value ? dayjs(field.value) : null}
                          onChange={(date, dateString) => {
                            // Converte para string no formato YYYY-MM-DD
                            const formattedDate = date
                              ? date.format("YYYY-MM-DD")
                              : "";
                            field.onChange(formattedDate);
                          }}
                          format="DD/MM/YYYY"
                          placeholder="Selecione a data"
                          style={{ width: "100%" }}
                          className="w-full"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Gênero</FormLabel>
                      <Popover open={openGender} onOpenChange={setOpenGender}>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={openGender}
                              type="button"
                              className={cn(
                                "w-full justify-between",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              {field.value
                                ? genderOptions.find(
                                    (gender) => gender.value === field.value,
                                  )?.label
                                : "Selecione"}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent
                          className="w-[var(--radix-popover-trigger-width)] p-0"
                          align="start"
                          onOpenAutoFocus={(e) => e.preventDefault()}
                        >
                          <Command>
                            <CommandList>
                              <CommandEmpty>
                                Nenhum gênero encontrado.
                              </CommandEmpty>
                              <CommandGroup>
                                {genderOptions.map((gender) => (
                                  <CommandItem
                                    value={gender.label}
                                    key={gender.value}
                                    onSelect={() => {
                                      field.onChange(gender.value);
                                      setOpenGender(false);
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        gender.value === field.value
                                          ? "opacity-100"
                                          : "opacity-0",
                                      )}
                                    />
                                    {gender.label}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={control}
                  name="shirtSize"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Tamanho da camisa</FormLabel>
                      <Popover
                        open={openShirtSize}
                        onOpenChange={setOpenShirtSize}
                      >
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={openShirtSize}
                              type="button"
                              className={cn(
                                "w-full justify-between",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              {field.value
                                ? shirtSizeOptions.find(
                                    (s) => s.value === field.value,
                                  )?.label
                                : "Selecione"}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent
                          className="w-[var(--radix-popover-trigger-width)] p-0"
                          align="start"
                          onOpenAutoFocus={(e) => e.preventDefault()}
                        >
                          <Command>
                            <CommandEmpty>
                              Nenhum tamanho encontrado.
                            </CommandEmpty>
                            <CommandList>
                              <CommandGroup>
                                {shirtSizeOptions.map((size) => (
                                  <CommandItem
                                    key={size.value}
                                    value={size.value}
                                    onSelect={() => {
                                      field.onChange(size.value);
                                      setOpenShirtSize(false);
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        size.value === field.value
                                          ? "opacity-100"
                                          : "opacity-0",
                                      )}
                                    />
                                    {size.label}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-y-4 border-t pt-6">
                <div
                  className="text-lg font-semibold"
                  style={{ color: recommendedBodyColor }}
                >
                  Tipo de Inscrição
                </div>

                <InscriptionTypeSelector
                  types={typeInscriptions}
                  selectedTypeId={typeInscriptionId}
                  onSelect={(typeId) => {
                    setTypeInscriptionId(typeId);
                    form.setValue("typeInscriptionId", typeId);
                  }}
                  hasBirthDate={
                    !!(formData.birthDate && formData.birthDate.length === 10)
                  }
                  calculateMaxAge={calculateMaxAge}
                />
              </div>
              <div className="border-t pt-6">
                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  style={{
                    backgroundColor: palette[0],
                  }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Enviando..." : "Realizar Inscrição"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>

      {successModalOpen && (
        <InscriptionSuccessModal
          isOpen={successModalOpen}
          onClose={() => setSuccessModalOpen(false)}
          onViewInscription={onViewInscription}
          successData={successData}
          paymentCountdownSeconds={paymentCountdownSeconds}
        />
      )}
    </div>
  );
}
