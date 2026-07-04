import { WithId } from 'mongodb';
import { Ride } from '../../domain/ride';
import { RideListPaginatedOutput } from '../output/ride-list-paginated.output';
import { mapToPaginatedOutput } from '../../../core/mappers/map-to-paginated-output';
import { mapToRideData } from './map-to-ride-output.util';

export function mapToRideListPaginatedOutput(
  rides: WithId<Ride>[],
  meta: { pageNumber: number; pageSize: number; totalCount: number },
): RideListPaginatedOutput {
  return mapToPaginatedOutput(rides, meta, mapToRideData);
}
