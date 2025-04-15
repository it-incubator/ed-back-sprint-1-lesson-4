import { DriverDataOutput } from './driver-data.output';
import { PaginatedOutput } from '../../../core/types/paginated.output';

export type DriverListPaginatedOutput = {
  meta: PaginatedOutput;
  data: DriverDataOutput[];
};
