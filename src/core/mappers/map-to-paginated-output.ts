import { PaginatedOutput } from '../types/paginated.output';

// Универсальный маппер списка с пагинацией: считает meta (page/pageSize/pageCount/totalCount)
// и мапит каждый элемент функцией mapItem в нужный data-элемент.
// Используется и drivers, и rides — без дублирования кода пагинации.
export function mapToPaginatedOutput<TItem, TData>(
  items: TItem[],
  meta: { pageNumber: number; pageSize: number; totalCount: number },
  mapItem: (item: TItem) => TData,
): { meta: PaginatedOutput; data: TData[] } {
  return {
    meta: {
      page: meta.pageNumber,
      pageSize: meta.pageSize,
      pageCount: Math.ceil(meta.totalCount / meta.pageSize),
      totalCount: meta.totalCount,
    },
    data: items.map(mapItem),
  };
}
