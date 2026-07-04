import { Ride } from '../domain/ride';
import { rideCollection } from '../../db/collections';
import { ObjectId, WithId } from 'mongodb';
import { RideQueryInput } from '../routes/input/ride-query.input';

// Репозиторий отвечает ТОЛЬКО за доступ к данным (CRUD) и НЕ бросает доменных ошибок.
// Модуль rides работает по подходу "app notification result": решение о статусе
// принимает сервис (возвращает Result), поэтому findById возвращает null,
// а finishRide — boolean (найдено/обновлено).
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

  // Активная поездка водителя — без даты завершения. driverId лежит в поддокументе driver.id.
  async findActiveRideByDriverId(
    driverId: string,
  ): Promise<WithId<Ride> | null> {
    return rideCollection.findOne({ 'driver.id': driverId, finishedAt: null });
  },

  async createRide(newRide: Ride): Promise<WithId<Ride>> {
    const insertResult = await rideCollection.insertOne(newRide);

    return { ...newRide, _id: insertResult.insertedId };
  },

  // Возвращает true, если поездка найдена и обновлена, иначе false.
  async finishRide(id: string, finishedAt: Date): Promise<boolean> {
    const updateResult = await rideCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          finishedAt,
          updatedAt: new Date(),
        },
      },
    );

    return updateResult.matchedCount > 0;
  },
};
