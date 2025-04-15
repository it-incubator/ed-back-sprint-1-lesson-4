import { WithId } from 'mongodb';
import { Ride } from '../../domain/ride';
import { RideListPaginatedOutput } from '../output/ride-list-paginated.output';
import { ResourceType } from '../../../core/types/resource-type';

export function mapToRideListPaginatedOutput(
  rides: WithId<Ride>[],
  meta: { pageNumber: number; pageSize: number; totalCount: number },
): RideListPaginatedOutput {
  return {
    meta: {
      page: meta.pageNumber,
      pageSize: meta.pageSize,
      pageCount: Math.ceil(meta.totalCount / meta.pageSize),
      totalCount: meta.totalCount,
    },
    data: rides.map((ride) => ({
      type: ResourceType.Rides,
      id: ride._id.toString(),
      attributes: {
        clientName: ride.clientName,
        driver: ride.driver,
        vehicle: ride.vehicle,
        price: ride.price,
        currency: ride.currency,
        startedAt: ride.startedAt,
        finishedAt: ride.finishedAt,
        addresses: ride.addresses,
      },
    })),
  };
}
