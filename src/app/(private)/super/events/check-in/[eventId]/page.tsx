"use client";

import CheckInPageContent from "@/features/checkin/components/CheckInPageContent";
import { useCheckInAccounts } from "@/features/checkin/hooks/useCheckInAccounts";
import { useCheckInEventInfo } from "@/features/checkin/hooks/useCheckInEventInfo";
import {
  CheckInAccount,
  CheckInEventInfo,
} from "@/features/checkin/types/checkInTypes";
import PageContainer from "@/shared/components/layout/PageContainer";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const SUPER_STORAGE_KEY = "checkin-super-page-size";

function getSuperStoredPageSize(defaultSize = 10) {
  if (typeof window === "undefined") {
    return defaultSize;
  }
  const stored = window.localStorage.getItem(SUPER_STORAGE_KEY);
  return stored ? Number(stored) : defaultSize;
}

export default function CheckInSuperPage() {
  const params = useParams();
  const router = useRouter();
  const rawEventId = params.eventId;
  const eventId = Array.isArray(rawEventId) ? rawEventId[0] : rawEventId;
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(() => getSuperStoredPageSize(10));
  const [onlyWithDebt, setOnlyWithDebt] = useState(false);

  const {
    data: accountsData,
    isLoading: accountsLoading,
    error: accountsError,
    refetch: refetchAccounts,
  } = useCheckInAccounts(eventId ?? "", page, pageSize, onlyWithDebt);

  const {
    data: eventInfo,
    isLoading: eventLoading,
    error: eventError,
    refetch: refetchEvent,
  } = useCheckInEventInfo(eventId ?? "");

  const [tableAccounts, setTableAccounts] = useState<CheckInAccount[]>([]);
  const [eventInfoCache, setEventInfoCache] = useState<CheckInEventInfo | null>(
    null
  );

  useEffect(() => {
    if (accountsData) {
      setTableAccounts(accountsData.accounts);
    }
  }, [accountsData]);

  useEffect(() => {
    if (eventInfo) {
      setEventInfoCache((prev) =>
        prev?.id === eventInfo.id ? prev : eventInfo
      );
    }
  }, [eventInfo]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    window.localStorage.setItem(SUPER_STORAGE_KEY, String(pageSize));
  }, [pageSize]);

  const handleBack = () => {
    router.push("/super/events/check-in");
  };

  const handleCheckInDetails = (accountId: string) => {
    router.push(`/super/events/check-in/${eventId}/details/${accountId}`);
  };

  const renderLoading = () => (
    <div className="space-y-6">
      <Card className="border-0 shadow-sm">
        <CardContent className="p-6 flex flex-col gap-4">
          <Skeleton className="h-48 w-full rounded-xl" />
          <div className="grid gap-4 md:grid-cols-2">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-16 rounded-xl" />
            ))}
          </div>
        </CardContent>
      </Card>
      <Card className="border-0 shadow-sm">
        <CardContent className="p-6">
          <Skeleton className="h-6 w-1/3 mb-4" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-2/3" />
        </CardContent>
      </Card>
    </div>
  );

  const renderError = () => {
    const message =
      (eventError instanceof Error ? eventError.message : null) ||
      (accountsError instanceof Error ? accountsError.message : null) ||
      "Não foi possível carregar as informações para check-in.";

    return (
      <div className="flex flex-col items-center justify-center gap-4 text-center py-12">
        <p className="text-red-600 font-semibold">{message}</p>
        <Button
          variant="outline"
          onClick={() => {
            refetchEvent();
            refetchAccounts();
          }}
        >
          Tentar novamente
        </Button>
      </div>
    );
  };

  return (
    <PageContainer
      title="Check-in"
      description="Confira as contas prontas para fazer o check-in do evento."
      showBackButton
      backButtonAction={handleBack}
    >
      {eventLoading && !eventInfoCache && renderLoading()}
      {(eventError || accountsError) && !eventLoading && renderError()}
      {eventInfoCache && (
        <CheckInPageContent
          event={eventInfoCache}
          accounts={tableAccounts}
          page={page}
          pageCount={accountsData?.pageCount ?? 0}
          onPageChange={setPage}
          pageSize={pageSize}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setPage(1);
          }}
          tableLoading={accountsLoading}
          onlyWithDebt={onlyWithDebt}
          onOnlyWithDebtChange={(value) => {
            setOnlyWithDebt(value);
            setPage(1);
          }}
          onAccountClick={(accountId) =>
            router.push(
              `/super/events/check-in/${eventId}/details/${accountId}`
            )
          }
        />
      )}
    </PageContainer>
  );
}
