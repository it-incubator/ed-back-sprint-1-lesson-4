import { WithId } from 'mongodb';
import { Ride } from '../../domain/ride';
import { ResourceType } from '../../../core/types/resource-type';
import { RideOutput } from '../output/ride.output';
import { RideDataOutput } from '../output/ride-data.output';

// Маппинг одной поездки в data-элемент JSON:API.
// Переиспользуется и для одиночного ответа, и для списка (через универсальный пагинатор).
export function mapToRideData(ride: WithId<Ride>): RideDataOutput {
  return {
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
  };
}

export function mapToRideOutputUtil(ride: WithId<Ride>): RideOutput {
  return {
    data: mapToRideData(ride),
  };
}
