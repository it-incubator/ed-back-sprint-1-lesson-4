import { WithId } from 'mongodb';
import { Driver } from '../../domain/driver';
import { DriverListPaginatedOutput } from '../output/driver-list-paginated.output';
import { mapToPaginatedOutput } from '../../../core/mappers/map-to-paginated-output';
import { mapToDriverData } from './map-to-driver-output.util';

export function mapToDriverListPaginatedOutput(
  drivers: WithId<Driver>[],
  meta: { pageNumber: number; pageSize: number; totalCount: number },
): DriverListPaginatedOutput {
  return mapToPaginatedOutput(drivers, meta, mapToDriverData);
}
