import { Driver } from '../domain/driver';
import { driverCollection } from '../../db/mongo.db';
import { ObjectId, WithId } from 'mongodb';
import { RepositoryNotFoundError } from '../../core/errors/repository-not-found.error';
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

    if (searchDriverNameTerm) {
      filter.name = { $regex: searchDriverNameTerm, $options: 'i' };
    }

    if (searchDriverEmailTerm) {
      filter.email = { $regex: searchDriverEmailTerm, $options: 'i' };
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
      throw new RepositoryNotFoundError('Driver not exist');
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
      throw new RepositoryNotFoundError('Driver not exist');
    }

    return;
  },

  async delete(id: string): Promise<void> {
    const deleteResult = await driverCollection.deleteOne({
      _id: new ObjectId(id),
    });

    if (deleteResult.deletedCount < 1) {
      throw new RepositoryNotFoundError('Driver not exist');
    }

    return;
  },
};
