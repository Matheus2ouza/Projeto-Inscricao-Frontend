import useFormCreatePaymentCard from "@/features/payment/hook/registerPaymentDetails/useRegisterPaymentCard";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Separator } from "@/shared/components/ui/separator";
import { getFormatCurrency } from "@/shared/utils/getFormatCurrency";
import { useEffect, useRef, useState } from "react";
import { Controller, useWatch } from "react-hook-form";
import { toast } from "sonner";

type RegisterPaymentCardDialogProps = {
  eventId: string;
  inscriptionsIds: string[];
  totalValue: number;
  onCancel: () => void;
};

type Step = "dados-titular" | "endereco";

export default function RegisterPaymentCard({
  eventId,
  inscriptionsIds,
  totalValue,
  onCancel,
}: RegisterPaymentCardDialogProps) {
  const { form, onSubmit } = useFormCreatePaymentCard();
  const {
    register,
    formState: { errors },
    trigger,
  } = form;

  const [currentStep, setCurrentStep] = useState<Step>("dados-titular");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isCepLoading, setIsCepLoading] = useState(false);

  const [extraAddressDetails, setExtraAddressDetails] = useState({
    bairro: "",
    localidade: "",
  });

  const lastCepFetchedRef = useRef<string | null>(null);
  const inFlightCepRef = useRef<string | null>(null);
  const cepFetchIdRef = useRef(0);

  const postalCode = useWatch({
    control: form.control,
    name: "postalCode",
  });

  const formatCep = (value: string): string => {
    const numbers = value.replace(/\D/g, "").slice(0, 8);
    if (numbers.length <= 5) return numbers;
    return `${numbers.slice(0, 5)}-${numbers.slice(5)}`;
  };

  const formatPhone = (value: string): string => {
    const numbers = value.replace(/\D/g, "").slice(0, 11);
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 7)
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
  };

  const formatCPF = (value: string): string => {
    const numbers = value.replace(/\D/g, "").slice(0, 11);
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6)
      return `${numbers.slice(0, 3)}.${numbers.slice(3)}`;
    if (numbers.length <= 9)
      return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`;
    return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9)}`;
  };

  const nameError = errors.name?.message;
  const emailError = errors.email?.message;
  const telefoneError = errors.telefone?.message;
  const cpfCnpjError = errors.cpfCnpj?.message;
  const postalCodeError = errors.postalCode?.message;
  const addressError = errors.address?.message;
  const addressNumberError = errors.addressNumber?.message;
  const complementError = errors.complement?.message;
  const provinceError = errors.province?.message;
  const cityError = errors.city?.message;

  useEffect(() => {
    const cleanCep = (postalCode ?? "").replace(/\D/g, "");
    if (cleanCep.length !== 8) {
      lastCepFetchedRef.current = null;
      inFlightCepRef.current = null;
      setIsCepLoading(false);
      return;
    }

    if (lastCepFetchedRef.current === cleanCep) return;
    if (inFlightCepRef.current === cleanCep) return;
    inFlightCepRef.current = cleanCep;

    const abortController = new AbortController();
    const fetchId = ++cepFetchIdRef.current;

    (async () => {
      setIsCepLoading(true);
      try {
        const response = await fetch(
          `https://viacep.com.br/ws/${cleanCep}/json/`,
          { signal: abortController.signal },
        );

        if (!response.ok) {
          throw new Error("CEP inválido");
        }

        const data = (await response.json()) as {
          erro?: boolean;
          logradouro?: string;
          complemento?: string;
          ibge?: string;
          localidade?: string;
          uf?: string;
          bairro?: string;
        };

        console.log("[ViaCEP]", {
          cep: cleanCep,
          ok: response.ok,
          status: response.status,
          data,
        });

        if (data.erro) {
          throw new Error("CEP não encontrado");
        }

        lastCepFetchedRef.current = cleanCep;
        if (data.logradouro) {
          form.setValue("address", data.logradouro, { shouldValidate: true });
        }
        if (data.ibge) {
          form.setValue("city", data.ibge, { shouldValidate: true });
        }
        if (data.uf) {
          form.setValue("province", data.uf, { shouldValidate: true });
        }

        setExtraAddressDetails({
          bairro: data.bairro || "",
          localidade: data.localidade || "",
        });
      } catch (error) {
        if (abortController.signal.aborted) return;

        toast.error("Não foi possível buscar o CEP", {
          description:
            error instanceof Error
              ? error.message
              : "Verifique o CEP e tente novamente.",
        });

        form.setValue("address", "", { shouldValidate: true });
        form.setValue("city", "", { shouldValidate: true });
        form.setValue("province", "", { shouldValidate: true });
        setExtraAddressDetails({ bairro: "", localidade: "" });
      } finally {
        if (cepFetchIdRef.current === fetchId) {
          setIsCepLoading(false);
        }
        if (inFlightCepRef.current === cleanCep) {
          inFlightCepRef.current = null;
        }
      }
    })();

    return () => {
      abortController.abort();
      if (inFlightCepRef.current === cleanCep) {
        inFlightCepRef.current = null;
      }
    };
  }, [postalCode, form]);

  const handleNextStep = async () => {
    const fieldsToValidate = ["name", "email", "telefone", "cpfCnpj"] as const;

    const isValid = await trigger(fieldsToValidate);

    if (isValid) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentStep("endereco");
        setIsTransitioning(false);
      }, 300);
    }
  };

  const handlePreviousStep = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentStep("dados-titular");
      setIsTransitioning(false);
      form.setValue("postalCode", "");
      form.setValue("address", "");
      form.setValue("addressNumber", "");
      form.setValue("complement", "");
      form.setValue("province", "");
      form.setValue("city", "");
      setExtraAddressDetails({
        bairro: "",
        localidade: "",
      });
      lastCepFetchedRef.current = null;
      inFlightCepRef.current = null;
    }, 300);
  };

  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (currentStep === "dados-titular") {
      await handleNextStep();
      return;
    }

    if (isCepLoading) {
      toast.error("Aguarde a busca do CEP terminar.");
      return;
    }

    const isValid = await trigger();
    if (!isValid) {
      return;
    }

    const result = await onSubmit(eventId, totalValue, inscriptionsIds);
    if (result.success) {
      if (result.redirectUrl) {
        window.location.assign(result.redirectUrl);
        return;
      }
      toast.error("Link de redirecionamento inválido.");
      return;
    }

    toast.error("Não foi possível registrar o pagamento no cartão", {
      description: result.error,
    });
  };

  return (
    <div className="w-full space-y-6">
      {/* Informações do pagamento */}
      <div className="rounded-xl border bg-muted/20 p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">
              Inscrições selecionadas
            </p>
            <p className="text-sm font-medium">
              {inscriptionsIds.length}{" "}
              {inscriptionsIds.length === 1 ? "inscrição" : "inscrições"}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Valor total</p>
            <p className="text-lg font-semibold">
              {getFormatCurrency(totalValue)}
            </p>
          </div>
        </div>
      </div>

      {/* Barra de progresso */}
      <div className="rounded-xl border p-6 space-y-6">
        {/* Desktop Progress Bar */}
        <div className="hidden md:flex items-center justify-between w-[80%] mx-auto">
          <div className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${
                currentStep === "dados-titular"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              1
            </div>
            <span
              className={`text-sm ${
                currentStep === "dados-titular"
                  ? "font-medium"
                  : "text-muted-foreground"
              }`}
            >
              Dados do titular
            </span>
          </div>
          <div className="h-0.5 flex-1 mx-4 bg-muted" />
          <div className="flex items-center gap-2">
            <span
              className={`text-sm ${
                currentStep === "endereco"
                  ? "font-medium"
                  : "text-muted-foreground"
              }`}
            >
              Endereço
            </span>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${
                currentStep === "endereco"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              2
            </div>
          </div>
        </div>

        {/* Mobile Progress Bar */}
        <div className="flex md:hidden justify-between w-full px-2">
          <div className="flex flex-col items-center gap-1 z-10">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${
                currentStep === "dados-titular"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              1
            </div>
            <span
              className={`text-xs ${
                currentStep === "dados-titular"
                  ? "font-medium"
                  : "text-muted-foreground"
              }`}
            >
              Titular
            </span>
          </div>

          <div className="h-0.5 flex-1 mx-2 bg-muted mt-4" />

          <div className="flex flex-col items-center gap-1 z-10">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${
                currentStep === "endereco"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              2
            </div>
            <span
              className={`text-xs ${
                currentStep === "endereco"
                  ? "font-medium"
                  : "text-muted-foreground"
              }`}
            >
              Endereço
            </span>
          </div>
        </div>

        <form onSubmit={handleFormSubmit} className="flex flex-col gap-6">
          {/* Container principal com altura dinâmica */}
          <div className="relative overflow-hidden">
            {/* Passo 1: Dados do Titular */}
            <div
              className={`transition-all duration-300 ease-in-out ${
                currentStep === "dados-titular"
                  ? "relative translate-x-0 opacity-100"
                  : "absolute top-0 left-0 w-full -translate-x-full opacity-0"
              }`}
            >
              <div className="rounded-xl border p-4 space-y-4">
                <div className="space-y-1">
                  <h3 className="text-sm font-semibold">Dados do titular</h3>
                  <p className="text-xs text-muted-foreground">
                    Use os dados do responsável pelo pagamento.
                  </p>
                </div>

                <Separator />

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="card-name">Nome completo</Label>
                    <Input
                      id="card-name"
                      {...register("name")}
                      placeholder="Seu nome completo"
                      className="md:text-base"
                    />
                    {nameError && (
                      <p className="text-destructive text-xs">{nameError}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="card-email">Email</Label>
                    <Input
                      id="card-email"
                      type="email"
                      {...register("email")}
                      placeholder="seuemail@exemplo.com"
                      className="md:text-base"
                    />
                    {emailError && (
                      <p className="text-destructive text-xs">{emailError}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="card-phone">Telefone</Label>
                    <Controller
                      control={form.control}
                      name="telefone"
                      render={({ field }) => (
                        <Input
                          id="card-phone"
                          type="tel"
                          value={field.value ? formatPhone(field.value) : ""}
                          onChange={(event) =>
                            field.onChange(
                              event.target.value
                                .replace(/\D/g, "")
                                .slice(0, 11),
                            )
                          }
                          placeholder="(11) 99999-8888"
                          maxLength={15}
                          className="md:text-base"
                        />
                      )}
                    />
                    {telefoneError && (
                      <p className="text-destructive text-xs">
                        {telefoneError}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="card-cpf">CPF</Label>
                    <Controller
                      control={form.control}
                      name="cpfCnpj"
                      render={({ field }) => (
                        <Input
                          id="card-cpf"
                          value={field.value ? formatCPF(field.value) : ""}
                          onChange={(event) =>
                            field.onChange(
                              event.target.value
                                .replace(/\D/g, "")
                                .slice(0, 11),
                            )
                          }
                          placeholder="123.456.789-09"
                          maxLength={14}
                          className="md:text-base"
                        />
                      )}
                    />
                    {cpfCnpjError && (
                      <p className="text-destructive text-xs">{cpfCnpjError}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Passo 2: Endereço */}
            <div
              className={`transition-all duration-300 ease-in-out ${
                currentStep === "endereco"
                  ? "relative translate-x-0 opacity-100"
                  : "absolute top-0 left-0 w-full translate-x-full opacity-0"
              }`}
            >
              <div className="rounded-xl border p-4 space-y-4">
                <div className="space-y-1">
                  <h3 className="text-sm font-semibold">
                    Endereço de cobrança
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Preenchido automaticamente ao informar o CEP.
                  </p>
                </div>

                <Separator />

                <div className="grid gap-4 grid-cols-1 md:grid-cols-12">
                  <div className="space-y-2 col-span-1 md:col-span-4">
                    <Label htmlFor="card-postalCode">CEP</Label>
                    <Controller
                      control={form.control}
                      name="postalCode"
                      render={({ field }) => (
                        <Input
                          id="card-postalCode"
                          value={field.value ?? ""}
                          onChange={(event) =>
                            field.onChange(formatCep(event.target.value))
                          }
                          placeholder="00000-000"
                          maxLength={9}
                          className="md:text-base"
                        />
                      )}
                    />
                    {postalCodeError && (
                      <p className="text-destructive text-xs">
                        {postalCodeError}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2 col-span-1 md:col-span-12">
                    <Label htmlFor="card-address">Endereço</Label>
                    <Input
                      id="card-address"
                      {...register("address")}
                      placeholder="Rua / Avenida"
                      className="md:text-base"
                    />
                    {addressError && (
                      <p className="text-destructive text-xs">{addressError}</p>
                    )}
                  </div>

                  <div className="space-y-2 col-span-1 md:col-span-3">
                    <Label htmlFor="card-addressNumber">Número</Label>
                    <Input
                      id="card-addressNumber"
                      {...register("addressNumber")}
                      placeholder="123"
                      className="md:text-base"
                    />
                    {addressNumberError && (
                      <p className="text-destructive text-xs">
                        {addressNumberError}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2 col-span-1 md:col-span-9">
                    <Label htmlFor="card-complement">Complemento</Label>
                    <Input
                      id="card-complement"
                      {...register("complement")}
                      placeholder="Apto / Bloco (opcional)"
                      className="md:text-base"
                    />
                    {complementError && (
                      <p className="text-destructive text-xs">
                        {complementError}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2 col-span-1 md:col-span-5">
                    <Label htmlFor="card-bairro">Bairro</Label>
                    <Input
                      id="card-bairro"
                      value={extraAddressDetails.bairro}
                      readOnly
                      className="bg-muted text-muted-foreground md:text-base"
                    />
                  </div>

                  <div className="space-y-2 col-span-1 md:col-span-5">
                    <Label htmlFor="card-city-display">Cidade</Label>
                    <Input
                      id="card-city-display"
                      value={extraAddressDetails.localidade}
                      readOnly
                      className="bg-muted text-muted-foreground md:text-base"
                    />
                  </div>

                  <div className="space-y-2 col-span-1 md:col-span-2">
                    <Label htmlFor="card-province">UF</Label>
                    <Input
                      id="card-province"
                      {...register("province")}
                      placeholder="SP"
                      className="md:text-base"
                    />
                    {provinceError && (
                      <p className="text-destructive text-xs">
                        {provinceError}
                      </p>
                    )}
                  </div>
                </div>

                <input type="hidden" {...register("city")} />
                {cityError && (
                  <p className="text-destructive text-sm">{cityError}</p>
                )}
              </div>
            </div>
          </div>

          {/* Botões de navegação */}
          <div className="flex items-center justify-end gap-2">
            {currentStep === "dados-titular" ? (
              <>
                <Button type="button" variant="outline" onClick={onCancel}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={isCepLoading}>
                  Continuar para endereço
                </Button>
              </>
            ) : (
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePreviousStep}
                >
                  Voltar para dados
                </Button>
                <Button type="submit" disabled={isCepLoading}>
                  Finalizar pagamento
                </Button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
