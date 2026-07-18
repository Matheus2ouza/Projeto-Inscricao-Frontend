'use client';

import { TicketPaymentDialog } from '@/features/tickets/components/public/checkout/TicketPaymentDialog';
import { useCheckoutSaleTicket } from '@/features/tickets/hooks/public/checkout/useCheckoutSaleTicket';
import type { CheckoutBuyerFormValues } from '@/features/tickets/schema/public/checkout/preSale.schema';
import type { TicketsByEventResponse } from '@/features/tickets/types/analysis/ticketsTypes';
import { Button } from '@/shared/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Separator } from '@/shared/components/ui/separator';
import { Check, Copy, DollarSign } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';

type CheckoutSaleTicketContentProps = {
  eventId: string;
  event: TicketsByEventResponse;
};

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

export function CheckoutSaleTicketContent({
  eventId,
  event,
}: CheckoutSaleTicketContentProps) {
  const router = useRouter();
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const {
    form,
    handleSubmit,
    summaryItems,
    totalAmount,
    receiptImage,
    handleProofSubmit,
    handleRemoveReceipt,
    isDialogOpen,
    setIsDialogOpen,
    canSubmit,
    showEmptySelection,
    parsedSelection,
    isSubmitting,
  } = useCheckoutSaleTicket(eventId, event, {
    onSuccess: () => {
      setIsDialogOpen(false);
      setIsSuccessDialogOpen(true);
    },
  });

  const bankData = {
    beneficiary: 'IGREJA EM CASTANHAL',
    bank: 'Banco Bradesco',
    agency: '6667-2',
    account: '6779-2',
    pixKey: 'ofertaigcastanhal@gmail.com',
  };

  const whatsappMessage = encodeURIComponent(
    'Olá Matheus Furtado, preciso de ajuda com a compra dos tickets.',
  );
  const whatsappLink = `https://wa.me/5591992587483?text=${whatsappMessage}`;

  const handleCopy = (value: string, field: string) => {
    navigator.clipboard.writeText(value);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const summaryCard = useMemo(() => {
    return (
      <Card className="border-border/40 border shadow-sm">
        <CardHeader>
          <CardTitle>Resumo do pedido</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {summaryItems.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              Nenhum ticket selecionado. Volte e escolha ao menos um ticket.
            </p>
          ) : (
            <div className="space-y-3">
              {summaryItems.map((item) => (
                <div
                  key={item.id}
                  className="border-border/40 flex items-center justify-between rounded-lg border p-3"
                >
                  <div>
                    <p className="text-foreground text-sm font-medium">
                      {item.name}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {item.quantity}x {currencyFormatter.format(item.price)}
                    </p>
                  </div>
                  <span className="text-foreground font-semibold">
                    {currencyFormatter.format(item.quantity * item.price)}
                  </span>
                </div>
              ))}
            </div>
          )}
          <div className="border-border/60 flex items-center justify-between border-t pt-4">
            <div>
              <p className="text-muted-foreground text-xs tracking-wide uppercase">
                Total
              </p>
              <p className="text-2xl font-semibold">
                {currencyFormatter.format(totalAmount)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-muted-foreground text-xs">
                Tickets selecionados
              </p>
              <p className="text-xl font-semibold">
                {summaryItems.reduce((sum, item) => sum + item.quantity, 0)}
              </p>
            </div>
          </div>
          <Separator className="my-3" />
          <div className="border-border/60 rounded-lg border bg-yellow-50/90 p-4 text-sm text-yellow-900 dark:bg-yellow-900/30 dark:text-yellow-200">
            <p className="mb-1 font-semibold">Importante</p>
            Após enviar o comprovante, nossa equipe valida o pagamento. Se
            aprovado, os tickets são enviados para o e-mail informado. Caso seja
            recusado, você receberá um e-mail e, se informou telefone, poderemos
            avisar por lá também.
          </div>
        </CardContent>
      </Card>
    );
  }, [summaryItems, totalAmount]);

  const handleSuccessDialogChange = (open: boolean) => {
    setIsSuccessDialogOpen(open);
    if (!open) {
      router.push(`/events/tickets/${eventId}`);
    }
  };

  return (
    <div className="space-y-6">
      {showEmptySelection && (
        <Card className="border-border/60 border-dashed">
          <CardContent className="space-y-4 p-6 text-center">
            <p className="text-lg font-semibold">Nenhum ticket selecionado</p>
            <p className="text-muted-foreground text-sm">
              Volte para a página anterior e escolha os tickets que deseja
              comprar.
            </p>
            <Button onClick={() => router.push(`/events/tickets/${eventId}`)}>
              Escolher tickets
            </Button>
          </CardContent>
        </Card>
      )}

      {!!parsedSelection.length && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-6">
            <Card className="border-0 shadow-sm">
              <CardContent className="flex flex-col gap-6 p-6 md:flex-row md:items-stretch">
                <div className="relative w-full md:w-1/2">
                  {event.imageUrl ? (
                    <div className="relative h-56 w-full overflow-hidden rounded-xl">
                      <Image
                        src={event.imageUrl}
                        alt={event.name}
                        fill
                        priority
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw,
                          (max-width: 1200px) 70vw,
                          50vw"
                      />
                    </div>
                  ) : (
                    <div className="bg-muted flex h-56 w-full items-center justify-center rounded-xl">
                      <span className="text-muted-foreground text-sm">
                        Evento sem imagem
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex-1 space-y-3">
                  <div>
                    <p className="text-muted-foreground text-xs tracking-wide uppercase">
                      Checkout de tickets
                    </p>
                    <h2 className="text-2xl font-semibold">{event.name}</h2>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    Revise seus dados pessoais, anexe o comprovante de pagamento
                    e finalize o pedido.
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="lg:hidden">{summaryCard}</div>

            <Card className="border-border/40 border shadow-sm">
              <CardHeader>
                <CardTitle>Dados para pagamento</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted/40 rounded-lg p-3">
                  <p className="text-muted-foreground text-xs uppercase">
                    Valor Final
                  </p>
                  <p className="text-2xl font-semibold">
                    {currencyFormatter.format(totalAmount)}
                  </p>
                  <p className="text-muted-foreground mt-1 text-xs">
                    Realize o pagamento na conta abaixo.
                  </p>
                </div>
                <Separator />
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <Label className="text-sm">Favorecido</Label>
                      <p className="text-sm font-medium">
                        {bankData.beneficiary}
                      </p>
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        handleCopy(bankData.beneficiary, 'beneficiary')
                      }
                    >
                      {copiedField === 'beneficiary' ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <Label className="text-sm">Banco</Label>
                      <p className="text-sm font-medium">{bankData.bank}</p>
                    </div>
                    <div>
                      <Label className="text-sm">Agência</Label>
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-medium">{bankData.agency}</p>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleCopy(bankData.agency, 'agency')}
                        >
                          {copiedField === 'agency' ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm">Conta</Label>
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-medium">
                          {bankData.account}
                        </p>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleCopy(bankData.account, 'account')
                          }
                        >
                          {copiedField === 'account' ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <Label className="text-sm">Chave PIX</Label>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="min-w-0 flex-1 text-sm font-medium break-all">
                          {bankData.pixKey}
                        </p>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="flex-shrink-0"
                          onClick={() => handleCopy(bankData.pixKey, 'pix')}
                        >
                          {copiedField === 'pix' ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/40 border shadow-sm">
              <CardHeader>
                <CardTitle>Dados do comprador</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <FormField<CheckoutBuyerFormValues, 'firstName'>
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nome</FormLabel>
                            <FormControl>
                              <Input placeholder="Seu nome" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField<CheckoutBuyerFormValues, 'lastName'>
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Sobrenome</FormLabel>
                            <FormControl>
                              <Input placeholder="Sobrenome" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField<CheckoutBuyerFormValues, 'email'>
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="voce@email.com"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField<CheckoutBuyerFormValues, 'phone'>
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Telefone{' '}
                            <span className="text-muted-foreground text-xs">
                              (opcional)
                            </span>
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="(00) 00000-0000" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="border-border/70 space-y-4 rounded-lg border border-dashed p-4">
                      <div className="flex flex-col gap-1">
                        <p className="text-sm font-medium">
                          Comprovante de pagamento
                        </p>
                        <p className="text-muted-foreground text-xs">
                          Anexe o comprovante emitido após o pagamento.
                        </p>
                      </div>
                      {receiptImage ? (
                        <div className="flex flex-col gap-3">
                          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-sm font-medium text-green-600">
                              Comprovante anexado
                            </p>
                            <div className="flex items-center gap-2">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => setIsDialogOpen(true)}
                              >
                                Trocar arquivo
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={handleRemoveReceipt}
                              >
                                Remover
                              </Button>
                            </div>
                          </div>
                          <div className="relative h-48 w-full overflow-hidden rounded-lg border">
                            <Image
                              src={receiptImage}
                              alt="Comprovante enviado"
                              fill
                              className="bg-muted object-contain"
                              sizes="(max-width: 768px) 100vw, 50vw"
                              unoptimized
                            />
                          </div>
                        </div>
                      ) : (
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={() => {
                            setIsDialogOpen(true);
                          }}
                        >
                          Anexar comprovante
                        </Button>
                      )}
                    </div>

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={!canSubmit}
                    >
                      {isSubmitting ? 'Enviando pedido...' : 'Finalizar pedido'}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>

          <aside className="space-y-4">
            <div className="hidden lg:block">
              <div className="sticky top-6">{summaryCard}</div>
            </div>
          </aside>
        </div>
      )}

      <TicketPaymentDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        totalValue={totalAmount}
        onSubmitPayment={handleProofSubmit}
      />
      <Dialog
        open={isSuccessDialogOpen}
        onOpenChange={handleSuccessDialogChange}
      >
        <DialogContent className="border-0 shadow-xl sm:max-w-md">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="flex size-14 items-center justify-center rounded-full bg-green-50 text-green-700 shadow-inner">
              <DollarSign />
            </div>
            <div>
              <DialogTitle className="text-2xl font-semibold">
                Pagamento registrado!
              </DialogTitle>
            </div>
          </div>
          <div className="text-muted-foreground space-y-4 text-sm">
            <p>
              Recebemos seu comprovante. Nossa equipe vai analisar e, após a
              aprovação, os tickets serão enviados para o e-mail informado em
              até
              <span className="text-primary font-semibold"> 24 horas.</span>
            </p>
            <p>
              Fique de olho no seu e-mail (inclusive na caixa de spam). Em caso
              de dúvidas, entre em contato com o nosso suporte pelo WhatsApp.
            </p>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-green-50 px-4 py-2 font-bold text-green-600 uppercase"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="currentColor"
                aria-hidden
              >
                <path d="M16.83 14.17c-.28-.14-1.66-.82-1.92-.91-.26-.09-.45-.14-.64.14-.19.29-.73.91-.9 1.1-.17.19-.34.21-.62.07-.28-.14-1.2-.44-2.29-1.4-.85-.75-1.42-1.68-1.59-1.96-.17-.29-.02-.45.13-.59.13-.13.29-.34.43-.52.14-.17.19-.29.28-.48.09-.19.04-.36-.02-.5-.07-.14-.64-1.54-.87-2.1-.23-.55-.46-.48-.64-.49h-.54c-.19 0-.5.07-.76.36-.26.29-1 1-1 2.43 0 1.43 1.03 2.82 1.18 3 .14.19 2.02 3.08 4.92 4.32.69.3 1.23.48 1.65.61.69.22 1.31.19 1.8.12.55-.08 1.66-.68 1.89-1.34.23-.66.23-1.24.16-1.36-.06-.12-.26-.19-.54-.32z" />
                <path d="M12 2a9.99 9.99 0 0 0-8.56 15.13L2 22l4.99-1.31A10 10 0 1 0 12 2zm0 18a7.96 7.96 0 0 1-4.07-1.11l-.29-.17-2.96.77.79-2.89-.18-.3A7.97 7.97 0 1 1 12 20z" />
              </svg>
              Suporte
            </a>
          </div>
          <DialogFooter>
            <Button
              onClick={() => handleSuccessDialogChange(false)}
              className="w-full"
            >
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
