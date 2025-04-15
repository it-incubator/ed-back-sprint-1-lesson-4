import { rideCollection } from '../../db/mongo.db';
import { ObjectId, WithId } from 'mongodb';
import { RepositoryNotFoundError } from '../../core/errors/repository-not-found.error';
import { ResourceType } from '../../core/types/resource-type';
import { RideQueryInput } from '../routes/input/ride-query.input';
import { Ride } from '../domain/ride';
import { RideListPaginatedOutput } from '../routes/output/ride-list-paginated.output';
import { RideOutput } from '../routes/output/ride.output';

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

  async findByIdOrFail(id: string): Promise<WithId<Ride>> {
    const res = await rideCollection.findOne({ _id: new ObjectId(id) });

    if (!res) {
      throw new RepositoryNotFoundError('Ride not exist');
    }
    return res;
  },

  mapToRideListPaginatedOutput(
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
  },
  mapToRideOutputUtil(ride: WithId<Ride>): RideOutput {
    return {
      data: {
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
      },
    };
  },
};
