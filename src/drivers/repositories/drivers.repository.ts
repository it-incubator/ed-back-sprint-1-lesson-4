import { Driver } from '../domain/driver';
import { driverCollection } from '../../db/collections';
import { ObjectId, WithId } from 'mongodb';
import { NotFoundException } from '../../core/exceptions/not-found.exception';
import { DriverAttributes } from '../application/dtos/driver-attributes';

// Command-репозиторий (сторона записи CQRS): только изменения данных + точечный
// findById для бизнес-правил команд. Чтение для представления — в drivers.query-repository.
export const driversRepository = {
  // Используется командами других модулей (напр. проверка водителя при создании поездки).
  async findById(id: string): Promise<WithId<Driver> | null> {
    return driverCollection.findOne({ _id: new ObjectId(id) });
  },

  async create(newDriver: Driver): Promise<string> {
    const insertResult = await driverCollection.insertOne(newDriver);

    return insertResult.insertedId.toString();
  },

  async update(id: string, dto: DriverAttributes): Promise<void> {
    const updateResult = await driverCollection.updateOne(
      {
        _id: new ObjectId(id),
      },
      {
        $set: {
          name: dto.name,
          phoneNumber: dto.phoneNumber,
          email: dto.email,
          vehicle: {
            make: dto.vehicleMake,
            model: dto.vehicleModel,
            year: dto.vehicleYear,
            licensePlate: dto.vehicleLicensePlate,
            description: dto.vehicleDescription,
            features: dto.vehicleFeatures,
          },
        },
      },
    );

    if (updateResult.matchedCount < 1) {
      throw new NotFoundException('Driver not exist');
    }

    return;
  },

  async delete(id: string): Promise<void> {
    const deleteResult = await driverCollection.deleteOne({
      _id: new ObjectId(id),
    });

    if (deleteResult.deletedCount < 1) {
      throw new NotFoundException('Driver not exist');
    }

    return;
  },
};
