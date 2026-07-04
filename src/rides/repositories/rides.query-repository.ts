import { ObjectId, WithId } from 'mongodb';
import { Ride } from '../domain/ride';
import { rideCollection } from '../../db/collections';
import { RideQueryInput } from '../routes/input/ride-query.input';
import { RideListPaginatedOutput } from '../routes/output/ride-list-paginated.output';
import { RideDataOutput } from '../routes/output/ride-data.output';
import { RideOutput } from '../routes/output/ride.output';
import { ResourceType } from '../../core/types/resource-type';
import { mapToPaginatedOutput } from '../../core/mappers/map-to-paginated-output';

// Query-репозиторий (сторона чтения): читает поездки для представления и
// отдаёт готовые JSON:API-модели. Команды (запись) идут через rides.repository.
export const ridesQueryRepository = {
  async findMany(
    queryDto: RideQueryInput,
  ): Promise<{ items: WithId<Ride>[]; totalCount: number }> {
    const { pageNumber, pageSize, sortBy, sortDirection } = queryDto;
    const filter = {};
    const skip = (pageNumber - 1) * pageSize;

    const [items, totalCount] = await Promise.all([
      rideCollection
        .find(filter)
        .sort({ [sortBy]: sortDirection })
        .skip(skip)
        .limit(pageSize)
        .toArray(),
      rideCollection.countDocuments(filter),
    ]);

    return { items, totalCount };
  },

  async findRidesByDriver(
    queryDto: RideQueryInput,
    driverId: string,
  ): Promise<{ items: WithId<Ride>[]; totalCount: number }> {
    const { pageNumber, pageSize, sortBy, sortDirection } = queryDto;
    // driverId лежит в поддокументе driver.id.
    const filter = { 'driver.id': driverId };
    const skip = (pageNumber - 1) * pageSize;

    const [items, totalCount] = await Promise.all([
      rideCollection
        .find(filter)
        .sort({ [sortBy]: sortDirection })
        .skip(skip)
        .limit(pageSize)
        .toArray(),
      rideCollection.countDocuments(filter),
    ]);

    return { items, totalCount };
  },

  async findById(id: string): Promise<WithId<Ride> | null> {
    return rideCollection.findOne({ _id: new ObjectId(id) });
  },

  // Маппинг одной поездки в data-элемент JSON:API — переиспользуется списком и одиночным ответом.
  mapToRideData(ride: WithId<Ride>): RideDataOutput {
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
  },

  mapToRideOutput(ride: WithId<Ride>): RideOutput {
    return { data: this.mapToRideData(ride) };
  },

  mapToRideListPaginatedOutput(
    rides: WithId<Ride>[],
    meta: { pageNumber: number; pageSize: number; totalCount: number },
  ): RideListPaginatedOutput {
    return mapToPaginatedOutput(rides, meta, (ride) =>
      this.mapToRideData(ride),
    );
  },
};
