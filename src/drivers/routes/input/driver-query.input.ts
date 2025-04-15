import { PaginationAndSorting } from '../../../core/types/pagination-and-sorting';
import { DriverSortField } from './driver-sort-field';

export type DriverQueryInput = PaginationAndSorting<DriverSortField> &
  Partial<{
    searchDriverNameTerm: string;
    searchDriverEmailTerm: string;
    searchVehicleMakeTerm: string;
  }>;
