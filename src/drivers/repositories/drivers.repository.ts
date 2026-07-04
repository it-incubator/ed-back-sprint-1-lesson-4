import { Driver } from '../domain/driver';
import { driverCollection } from '../../db/collections';
import { ObjectId, WithId } from 'mongodb';
import { NotFoundException } from '../../core/exceptions/not-found.exception';
import { DriverAttributes } from '../application/dtos/driver-attributes';
import { DriverQueryInput } from '../routes/input/driver-query.input';

export const driversRepository = {
  async findMany(
    queryDto: DriverQueryInput,
  ): Promise<{ items: WithId<Driver>[]; totalCount: number }> {
    const {
      pageNumber,
      pageSize,
      sortBy,
      sortDirection,
      searchDriverNameTerm,
      searchDriverEmailTerm,
      searchVehicleMakeTerm,
    } = queryDto;

    const skip = (pageNumber - 1) * pageSize;
    const filter: any = {};

    // Поиск по имени/email объединяем через $or: совпадение хотя бы по одному полю.
    if (searchDriverNameTerm || searchDriverEmailTerm) {
      filter.$or = [];
      if (searchDriverNameTerm) {
        // Встроенные операторы mongodb: $regex + $options 'i' — поиск без учёта регистра.
        filter.$or.push({
          name: { $regex: searchDriverNameTerm, $options: 'i' },
        });
      }
      if (searchDriverEmailTerm) {
        filter.$or.push({
          email: { $regex: searchDriverEmailTerm, $options: 'i' },
        });
      }
    }

    if (searchVehicleMakeTerm) {
      filter['vehicle.make'] = { $regex: searchVehicleMakeTerm, $options: 'i' };
    }

    const items = await driverCollection
      .find(filter)
      .sort({ [sortBy]: sortDirection })
      .skip(skip)
      .limit(pageSize)
      .toArray();

    const totalCount = await driverCollection.countDocuments(filter);

    return { items, totalCount };
  },

  async findById(id: string): Promise<WithId<Driver> | null> {
    return driverCollection.findOne({ _id: new ObjectId(id) });
  },

  async findByIdOrFail(id: string): Promise<WithId<Driver>> {
    const res = await driverCollection.findOne({ _id: new ObjectId(id) });

    if (!res) {
      throw new NotFoundException('Driver not exist');
    }
    return res;
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
