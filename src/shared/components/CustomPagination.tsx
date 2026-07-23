import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/shared/components/ui/pagination';

type CustomPaginationProps = {
  page: number;
  pageCount: number;
  total: number;
  onPageChange: (page: number) => void;
  label?: string;
};

export function CustomPagination({
  page,
  pageCount,
  total,
  onPageChange,
  label = 'itens',
}: CustomPaginationProps) {
  if (pageCount <= 1) {
    return null;
  }

  return (
    <div className="py-4">
      <div className="flex flex-col items-center gap-4">
        {/* Botões de paginação */}
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => page > 1 && onPageChange(page - 1)}
                href={page > 1 ? '#' : undefined}
                className={page === 1 ? 'pointer-events-none opacity-50' : ''}
              />
            </PaginationItem>

            {/* Versão mobile - apenas página atual */}
            <div className="sm:hidden">
              <PaginationItem>
                <PaginationLink
                  isActive={true}
                  href="#"
                  className="bg-riodavida hover:bg-riodavida-dark pointer-events-none text-white"
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            </div>

            {/* Versão desktop - todas as páginas */}
            <div className="hidden sm:flex">
              {Array.from({ length: pageCount }, (_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    isActive={page === i + 1}
                    href="#"
                    onClick={() => onPageChange(i + 1)}
                    className={
                      page === i + 1
                        ? 'bg-riodavida hover:bg-riodavida-dark text-white'
                        : 'text-riodavida-gray-dark dark:text-riodavida-gray hover:bg-riodavida/5 dark:hover:bg-riodavida/10'
                    }
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
            </div>

            <PaginationItem>
              <PaginationNext
                onClick={() => page < pageCount && onPageChange(page + 1)}
                href={page < pageCount ? '#' : undefined}
                className={
                  page === pageCount ? 'pointer-events-none opacity-50' : ''
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>

        {/* Informações da página - abaixo dos botões */}
        <div className="text-muted-foreground text-center text-sm">
          Página {page} de {pageCount} • Total: {total} {label}
        </div>
      </div>
    </div>
  );
}
