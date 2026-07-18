// features/guest/components/detailsInscription/SearchInscriptionCard.tsx

import { Button } from '@/shared/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { HelpCircle, Search } from 'lucide-react';
import { useEffect, useState } from 'react';

interface SearchInscriptionCardProps {
  confirmationCode: string | null;
  onSearch: (code: string) => void;
  onClear: () => void;
  loading: boolean;
}

export function SearchInscriptionCard({
  confirmationCode,
  onSearch,
  onClear,
  loading,
}: SearchInscriptionCardProps) {
  const [searchCode, setSearchCode] = useState(confirmationCode || '');

  const formatSearchCode = (value: string) => {
    const normalized = value
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '')
      .slice(0, 12);

    if (normalized.length <= 4) return normalized;
    if (normalized.length <= 8)
      return `${normalized.slice(0, 4)}-${normalized.slice(4)}`;
    return `${normalized.slice(0, 4)}-${normalized.slice(4, 8)}-${normalized.slice(8)}`;
  };

  const searchCodeNormalized = searchCode.replace(/[^A-Z0-9]/g, '');

  useEffect(() => {
    if (confirmationCode) {
      setSearchCode(formatSearchCode(confirmationCode));
    }
  }, [confirmationCode]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchCodeNormalized.trim()) return;
    if (searchCodeNormalized.length !== 12) return;
    onSearch(formatSearchCode(searchCodeNormalized));
  };

  return (
    <div className="w-full">
      <Card className="liquid-card w-full gap-2">
        <CardHeader>
          <CardTitle className="text-riodavida-gray-dark dark:text-riodavida-gray text-lg font-semibold">
            Buscar por código
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="w-full space-y-4">
            <div className="w-full space-y-4">
              <div className="flex w-full flex-col gap-3 lg:flex-row lg:items-center">
                <div className="relative w-full">
                  <div className="absolute top-1/2 left-4 -translate-y-1/2 transform">
                    <Search className="text-riodavida h-4 w-4" />
                  </div>
                  <Input
                    type="text"
                    value={searchCode}
                    onChange={(e) =>
                      setSearchCode(formatSearchCode(e.target.value))
                    }
                    placeholder="Digite o código (ex: N4LJ-3QTT-ECGL)"
                    className="border-riodavida/20 focus:border-riodavida focus:ring-riodavida/20 dark:border-riodavida/20 h-10 w-full rounded-md pr-16 pl-10 font-mono text-sm tracking-wider"
                    disabled={loading}
                    maxLength={14}
                  />
                  <div className="absolute top-1/2 right-4 -translate-y-1/2 transform">
                    <div className="flex items-center gap-2">
                      <div className="text-riodavida-gray-dark dark:text-riodavida-gray text-[11px] font-medium">
                        {searchCodeNormalized.length}/12
                      </div>
                      {searchCodeNormalized.length === 12 && (
                        <div className="bg-riodavida-secondary h-2 w-2 animate-pulse rounded-full" />
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex w-full flex-col gap-3 lg:w-auto lg:flex-row">
                  <Button
                    type="submit"
                    disabled={
                      !searchCodeNormalized.trim() ||
                      loading ||
                      searchCodeNormalized.length !== 12
                    }
                    className="bg-riodavida hover:bg-riodavida-dark h-10 w-full text-sm font-semibold text-white lg:w-36"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        <span>Buscando</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <Search className="h-4 w-4" />
                        <span>Consultar</span>
                      </div>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={loading || !searchCode.trim()}
                    onClick={() => {
                      setSearchCode('');
                      onClear();
                    }}
                    className="border-riodavida/30 text-riodavida hover:bg-riodavida/10 hover:text-riodavida-dark h-10 w-full lg:w-28"
                  >
                    Limpar
                  </Button>
                </div>
              </div>
              <div className="border-riodavida/20 bg-riodavida/5 text-riodavida-gray-dark dark:text-riodavida-gray flex items-start gap-2 rounded-md border px-4 py-2 text-sm">
                <HelpCircle className="text-riodavida h-5 w-5 flex-shrink-0" />
                <span className="leading-normal">
                  O código foi enviado para o e-mail inserido no ato da
                  inscrição. Seu formato é parecido com{' '}
                  <strong className="underline underline-offset-auto">
                    NBDT-5Y3Y-RA4M
                  </strong>
                </span>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
