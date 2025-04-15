import { Ride } from '../domain/ride';
import { rideCollection } from '../../db/mongo.db';
import { ObjectId, WithId } from 'mongodb';
import { RepositoryNotFoundError } from '../../core/errors/repository-not-found.error';
import { RideQueryInput } from '../routes/input/ride-query.input';

export const ridesRepository = {
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

  async findById(id: string): Promise<WithId<Ride> | null> {
    return rideCollection.findOne({ _id: new ObjectId(id) });
  },
  async findByIdOrFail(id: string): Promise<WithId<Ride>> {
    const res = await rideCollection.findOne({ _id: new ObjectId(id) });

    if (!res) {
      throw new RepositoryNotFoundError('Ride not exist');
    }
    return res;
  },
  async findActiveRideByDriverId(
    driverId: string,
  ): Promise<WithId<Ride> | null> {
    return rideCollection.findOne({ driverId, finishedAt: null });
  },

  async createRide(newRide: Ride): Promise<string> {
    const insertResult = await rideCollection.insertOne(newRide);

    return insertResult.insertedId.toString();
  },

  async finishRide(id: string, finishedAt: Date) {
    const updateResult = await rideCollection.updateOne(
      {
        _id: new ObjectId(id),
      },
      {
        $set: {
          finishedAt,
          updatedAt: new Date(),
        },
      },
    );

    if (updateResult.matchedCount < 1) {
      throw new Error('Ride not exist');
    }

    return;
  },
};
