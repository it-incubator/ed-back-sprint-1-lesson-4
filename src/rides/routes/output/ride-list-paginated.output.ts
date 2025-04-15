import { PaginatedOutput } from '../../../core/types/paginated.output';
import { RideDataOutput } from './ride-data.output';

export type RideListPaginatedOutput = {
  meta: PaginatedOutput;
  data: RideDataOutput[];
};
