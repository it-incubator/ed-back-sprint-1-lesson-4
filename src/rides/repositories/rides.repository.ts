import { Ride } from '../domain/ride';
import { rideCollection } from '../../db/collections';
import { ObjectId, WithId } from 'mongodb';

// Command-репозиторий (сторона записи): только доступ к данным для команд,
// НЕ бросает доменных ошибок. Модуль rides работает по подходу "app notification result":
// статус определяет сервис (возвращает Result), поэтому findById возвращает null,
// а finishRide — boolean. Чтение для представления — в rides.query-repository.
export const ridesRepository = {
  // Точечный поиск для бизнес-правил команд (напр. завершение поездки).
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
