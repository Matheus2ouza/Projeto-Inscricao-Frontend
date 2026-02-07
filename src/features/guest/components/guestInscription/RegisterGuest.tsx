"use client";

import { useFormCreateGuestInscription } from "@/features/guest/hook/guestInscription/useFormCreateGuestInscription";
import {
  Event,
  InscriptionStatus,
  RegisterGuestInscriptionResponse,
} from "@/features/guest/types/guestInscription/guestInscriptionTypes";
import { GuestInscriptionAlready } from "@/shared/components/GuestInscriptionAlready";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/shared/components/ui/alert";
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
import { Input } from "@/shared/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import { Switch } from "@/shared/components/ui/switch";
import { cn } from "@/shared/lib/utils";
import { formatDate } from "@/shared/utils/formatDate";
import { getFormatCurrency } from "@/shared/utils/getFormatCurrency";
import { getWithExpiry, setWithExpiry } from "@/shared/utils/storageWithExpiry";
import {
  AlertCircle,
  Calendar,
  Check,
  ChevronsUpDown,
  Clock,
  Copy,
  User,
  Users,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface RegisterGuestProps {
  event: Event | null;
  onViewInscription: () => void;
}

export function RegisterGuest({
  event,
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

  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [openGender, setOpenGender] = useState(false);
  const [openGenderParticipant, setOpenGenderParticipant] = useState(false);
  const [openShirtSize, setOpenShirtSize] = useState(false);
  const [openShirtType, setOpenShirtType] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [successData, setSuccessData] =
    useState<RegisterGuestInscriptionResponse | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [paymentCountdownSeconds, setPaymentCountdownSeconds] = useState<
    number | null
  >(null);
  const [alreadyDialogOpen, setAlreadyDialogOpen] = useState(false);
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

  const formatCountdown = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

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

  const {
    control,
    handleSubmit,
    isSubmitting,
    typeInscriptions,
    formData,
    handleInputChange,
    form,
  } = useFormCreateGuestInscription({
    eventId: event.id,
    onSuccess: (response) => {
      setSuccessData(response);
      setSuccessModalOpen(true);
    },
  });

  const calculateMaxAge = (ruleDate?: Date) => {
    if (!ruleDate) return "Qualquer idade";

    const today = new Date();
    const rule = new Date(ruleDate);
    const age = today.getFullYear() - rule.getFullYear();

    const hasHadBirthday =
      today.getMonth() > rule.getMonth() ||
      (today.getMonth() === rule.getMonth() &&
        today.getDate() >= rule.getDate());

    return hasHadBirthday ? age : age - 1;
  };

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
      <Card className="border-0 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <div className="flex flex-col lg:flex-row">
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
                      <div className="text-5xl font-semibold text-muted-foreground mb-2">
                        {event.name.charAt(0)}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Sem imagem
                      </p>
                    </div>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent lg:hidden" />
                <div className="absolute bottom-0 left-0 p-6 lg:hidden">
                  <h1 className="text-2xl font-bold text-white uppercase shadow-sm">
                    {event.name}
                  </h1>
                </div>
              </AspectRatio>
            </div>

            {/* Informações do Evento (Desktop) */}
            <div className="flex-1 p-6 lg:p-8 space-y-6">
              <div className="hidden lg:block">
                <h1 className="text-3xl font-bold tracking-tight uppercase text-foreground">
                  {event.name}
                </h1>
              </div>

              <div className="flex flex-wrap items-center gap-6 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-primary/10 rounded-full text-primary">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-medium uppercase tracking-wider">
                      Início
                    </span>
                    <span className="text-sm font-semibold text-foreground">
                      {formatDate(event.startDate)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-primary/10 rounded-full text-primary">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-medium uppercase tracking-wider">
                      Fim
                    </span>
                    <span className="text-sm font-semibold text-foreground">
                      {formatDate(event.endDate)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between gap-4">
                  <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Tipos de inscrição
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {event.typeInscriptions.length}
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
                              ? "border-amber-200/70 bg-amber-50/60 dark:border-amber-900/60 dark:bg-amber-950/30"
                              : "border-gray-200/70 bg-gray-50/60 dark:border-gray-700/60 dark:bg-gray-900/30",
                          )}
                        >
                          <div className="flex items-start justify-between gap-2 mb-3">
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <div className="text-sm font-medium truncate">
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
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {type.rule
                                  ? `Até ${calculateMaxAge(type.rule)} anos`
                                  : "Qualquer idade"}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center justify-between pt-3 border-t">
                            <div className="text-xs text-muted-foreground whitespace-nowrap">
                              {type.specialType
                                ? "Necessita aprovação"
                                : "Inscrição direta"}
                            </div>
                            <div className="text-sm font-semibold whitespace-nowrap">
                              {getFormatCurrency(type.value)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Layout para mobile - Lista vertical (mantido como estava) */}
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
                              <div className="text-sm font-medium truncate">
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
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {type.rule
                                ? `Até ${calculateMaxAge(type.rule)} anos`
                                : "Qualquer idade"}
                            </div>
                          </div>

                          <div className="text-sm font-semibold whitespace-nowrap flex-shrink-0 ml-4">
                            {getFormatCurrency(type.value)}
                          </div>
                        </div>
                      ))}
                    </div>

                    {event.typeInscriptions.some((t) => t.specialType) && (
                      <Alert className="border-amber-200/70 bg-amber-50/60 text-amber-950 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-50 mt-4">
                        <AlertCircle className="h-4 w-4 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <AlertTitle className="text-sm font-medium">
                            Tipos especiais
                          </AlertTitle>
                          <AlertDescription className="text-sm">
                            <span className="block break-words">
                              As inscrições marcadas como{" "}
                              <strong>"Especial"</strong>
                              necessitam de aprovação. Após a inscrição, os
                              organizadores analisarão sua solicitação.
                            </span>
                          </AlertDescription>
                        </div>
                      </Alert>
                    )}
                  </>
                ) : (
                  <div className="text-sm text-muted-foreground">
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
        <form onSubmit={handleSubmit} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <User className="w-5 h-5 text-primary" />
                Dados para Inscrição
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
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

              {!formData.isResponsibleParticipant && (
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
              )}

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
                        placeholder="(99) 99999-9999"
                        {...field}
                        onChange={handleInputChange}
                        maxLength={15}
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
                      <Input placeholder="Sua cidade/região" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="isResponsibleParticipant"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm mt-4">
                    <div className="space-y-0.5">
                      <FormLabel>A inscrição é para outra pessoa?</FormLabel>
                      <div className="text-xs text-muted-foreground">
                        Marque se você estiver inscrevendo um terceiro
                      </div>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Se for inscrição para outra pessoa, mostra campos do participante */}
              {formData.isResponsibleParticipant && (
                <div className="space-y-4 pt-4 border-t mt-4 animate-in fade-in slide-in-from-top-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Users className="w-4 h-4 text-primary" />
                    Dados do Participante
                  </h3>

                  <FormField
                    control={control}
                    name="participantName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome do Participante</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Nome do participante"
                            {...field}
                          />
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
                            placeholder="Como o participante quer ser chamado"
                            {...field}
                          />
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
                          <FormLabel>Nascimento</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="DD/MM/AAAA"
                              {...field}
                              onChange={handleInputChange}
                              maxLength={10}
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
                          <Popover
                            open={openGenderParticipant}
                            onOpenChange={setOpenGenderParticipant}
                          >
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  role="combobox"
                                  aria-expanded={openGenderParticipant}
                                  type="button"
                                  className={cn(
                                    "w-full justify-between",
                                    !field.value && "text-muted-foreground",
                                  )}
                                >
                                  {field.value
                                    ? genderOptions.find(
                                        (gender) =>
                                          gender.value === field.value,
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
                                          setOpenGenderParticipant(false);
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

                    <FormField
                      control={control}
                      name="shirtType"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Modelo da camisa</FormLabel>
                          <Popover
                            open={openShirtType}
                            onOpenChange={setOpenShirtType}
                          >
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  role="combobox"
                                  aria-expanded={openShirtType}
                                  type="button"
                                  className={cn(
                                    "w-full justify-between",
                                    !field.value && "text-muted-foreground",
                                  )}
                                >
                                  {field.value
                                    ? shirtTypeOptions.find(
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
                                  Nenhum modelo encontrado.
                                </CommandEmpty>
                                <CommandList>
                                  <CommandGroup>
                                    {shirtTypeOptions.map((type) => (
                                      <CommandItem
                                        key={type.value}
                                        value={type.value}
                                        onSelect={() => {
                                          field.onChange(type.value);
                                          setOpenShirtType(false);
                                        }}
                                      >
                                        <Check
                                          className={cn(
                                            "mr-2 h-4 w-4",
                                            type.value === field.value
                                              ? "opacity-100"
                                              : "opacity-0",
                                          )}
                                        />
                                        {type.label}
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
                </div>
              )}

              {/* Se for inscrição para si mesmo (não é para outra pessoa), mostra nascimento e genero aqui */}
              {!formData.isResponsibleParticipant && (
                <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-4">
                  <FormField
                    control={control}
                    name="birthDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nascimento</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="DD/MM/AAAA"
                            {...field}
                            onChange={handleInputChange}
                            maxLength={10}
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
              )}

              {!formData.isResponsibleParticipant && (
                <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-4">
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

                  <FormField
                    control={control}
                    name="shirtType"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Modelo da camisa</FormLabel>
                        <Popover
                          open={openShirtType}
                          onOpenChange={setOpenShirtType}
                        >
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={openShirtType}
                                type="button"
                                className={cn(
                                  "w-full justify-between",
                                  !field.value && "text-muted-foreground",
                                )}
                              >
                                {field.value
                                  ? shirtTypeOptions.find(
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
                                Nenhum modelo encontrado.
                              </CommandEmpty>
                              <CommandList>
                                <CommandGroup>
                                  {shirtTypeOptions.map((type) => (
                                    <CommandItem
                                      key={type.value}
                                      value={type.value}
                                      onSelect={() => {
                                        field.onChange(type.value);
                                        setOpenShirtType(false);
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          type.value === field.value
                                            ? "opacity-100"
                                            : "opacity-0",
                                        )}
                                      />
                                      {type.label}
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
              )}
              <div className="space-y-4 border-t pt-6">
                <div className="text-lg font-semibold">Tipo de Inscrição</div>

                {formData.birthDate && formData.birthDate.length === 10 ? (
                  <FormField
                    control={control}
                    name="typeInscriptionId"
                    render={({ field }) => (
                      <FormItem className="flex flex-col w-full">
                        <FormLabel>Selecione o tipo</FormLabel>
                        <Popover open={open} onOpenChange={setOpen}>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={open}
                                type="button"
                                className={cn(
                                  "w-full justify-between",
                                  !field.value && "text-muted-foreground",
                                )}
                              >
                                {field.value
                                  ? (() => {
                                      const type = typeInscriptions.find(
                                        (t) =>
                                          (t.id || t.description) ===
                                          field.value,
                                      );
                                      return type
                                        ? `${type.description} - ${getFormatCurrency(
                                            type.value,
                                          )} (Max: ${calculateMaxAge(
                                            type.rule,
                                          )} anos)`
                                        : "Selecione o tipo de inscrição";
                                    })()
                                  : "Selecione o tipo de inscrição"}
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
                                  Nenhum tipo encontrado.
                                </CommandEmpty>
                                <CommandGroup>
                                  {typeInscriptions.length > 0 ? (
                                    typeInscriptions.map((type) => (
                                      <CommandItem
                                        value={type.description}
                                        key={type.id || type.description}
                                        onSelect={() => {
                                          field.onChange(
                                            type.id || type.description,
                                          );
                                          setOpen(false);
                                        }}
                                      >
                                        <Check
                                          className={cn(
                                            "mr-2 h-4 w-4",
                                            (type.id || type.description) ===
                                              field.value
                                              ? "opacity-100"
                                              : "opacity-0",
                                          )}
                                        />
                                        {type.description} -{" "}
                                        {getFormatCurrency(type.value)} (Max:{" "}
                                        {calculateMaxAge(type.rule)} anos)
                                      </CommandItem>
                                    ))
                                  ) : (
                                    <div className="py-6 text-center text-sm text-muted-foreground">
                                      Nenhum tipo disponível para esta idade
                                    </div>
                                  )}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ) : (
                  <div className="p-4 text-center border rounded-lg bg-muted/50 text-muted-foreground text-sm">
                    Preencha a data de nascimento para ver os tipos de inscrição
                    disponíveis.
                  </div>
                )}
              </div>

              <div className="border-t pt-6">
                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay com blur sutil */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setSuccessModalOpen(false)}
          />

          {/* Modal */}
          <div className="relative w-full max-w-md animate-in fade-in-0 zoom-in-95">
            <div className="relative overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-gray-900">
              {/* Botão de fechar no canto superior direito */}
              <button
                onClick={() => setSuccessModalOpen(false)}
                className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
                aria-label="Fechar modal"
              >
                <svg
                  className="h-4 w-4 text-gray-500 dark:text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              {/* Header */}
              <div className="p-8 pt-12 text-center">
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
                  {successData?.status === InscriptionStatus.UNDER_REVIEW
                    ? "Em Análise"
                    : "Inscrição Reservada"}
                </h3>

                <p className="text-gray-500 dark:text-gray-400 ">
                  {successData?.status === InscriptionStatus.UNDER_REVIEW
                    ? "Sua inscrição entrou em analise, aguarde o retorno dos organizadores."
                    : "Sua inscrição foi reservada."}
                </p>
              </div>

              {/* Conteúdo */}
              <div className="px-8 pb-8 space-y-6">
                {successData?.status === InscriptionStatus.PENDING &&
                  paymentCountdownSeconds !== null && (
                    <div className="rounded-xl border border-green-200/70 dark:border-green-800/40 bg-green-50/70 dark:bg-green-900/20 px-4 py-3">
                      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-green-800 dark:text-green-200">
                        <Clock className="h-4 w-4" />
                        Tempo restante para pagamento
                      </div>
                      <div className="mt-1 text-center text-3xl font-extrabold tabular-nums text-green-900 dark:text-green-100">
                        {formatCountdown(paymentCountdownSeconds)}
                      </div>
                    </div>
                  )}

                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-5">
                  ,
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium uppercase tracking-wider text-gray-600 dark:text-gray-400">
                      Código de inscrição
                    </span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(
                          successData?.confirmationCode || "",
                        );
                        setIsCopied(true);
                        setTimeout(() => setIsCopied(false), 2000);
                      }}
                      className={cn(
                        "text-sm font-medium transition-colors flex items-center gap-1",
                        isCopied
                          ? "text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
                          : "text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300",
                      )}
                    >
                      {isCopied ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                      {isCopied ? "Copiado!" : "Copiar"}
                    </button>
                  </div>
                  <div className="font-mono text-xl font-bold tracking-wider text-center py-2 px-3 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                    {successData?.confirmationCode}
                  </div>
                  {/* LINHA ADICIONADA CONFORME SOLICITADO */}
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                    Este código é único e com ele você pode encontrar sua
                    inscrição a qualquer momento.
                  </p>
                </div>

                {/* Status e informações */}
                <div className="space-y-4">
                  {successData?.status === InscriptionStatus.PENDING && (
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800/30 rounded-xl">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5">
                          <svg
                            className="h-5 w-5 text-green-600 dark:text-green-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-green-800 dark:text-green-300">
                            Próximo passo
                          </p>
                          <p className="text-sm text-green-700 dark:text-green-400 mt-1">
                            Sua Inscrição foi registrada, para garantir sua
                            participação é necessário realizar o pagamento da
                            sua inscrição dentro de <strong>30 minutos</strong>.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {successData?.status === InscriptionStatus.UNDER_REVIEW && (
                    <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/30 rounded-xl">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5">
                          <svg
                            className="h-5 w-5 text-amber-600 dark:text-amber-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
                            Aguarde a análise
                          </p>
                          <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">
                            Infelizmente, sua inscrição entrou em análise assim
                            que for validade pelos organizadores receberá um
                            e-mail com o resultado da análise.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Botões de ação */}
                <div className="space-y-3 pt-4">
                  <div className="flex gap-3">
                    <Button onClick={onViewInscription} className="flex-1">
                      {successData?.status === InscriptionStatus.PENDING
                        ? "Seguir para Pagamento"
                        : "Visualizar Inscrição"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
