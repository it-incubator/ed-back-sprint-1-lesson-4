import { Driver } from '../domain/driver';
import { driverCollection } from '../../db/mongo.db';
import { ObjectId, WithId } from 'mongodb';
import { DriverQueryInput } from '../routes/input/driver-query.input';
import { DriverListPaginatedOutput } from '../routes/output/driver-list-paginated.output';
import { DriverDataOutput } from '../routes/output/driver-data.output';
import { ResourceType } from '../../core/types/resource-type';
import { DriverOutput } from '../routes/output/driver.output';

export const driversQueryRepository = {
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

  mapToDriverListPaginatedOutput(
    drivers: WithId<Driver>[],
    meta: { pageNumber: number; pageSize: number; totalCount: number },
  ): DriverListPaginatedOutput {
    return {
      meta: {
        page: meta.pageNumber,
        pageSize: meta.pageSize,
        pageCount: Math.ceil(meta.totalCount / meta.pageSize),
        totalCount: meta.totalCount,
      },
      data: drivers.map(
        (driver): DriverDataOutput => ({
          type: ResourceType.Drivers,
          id: driver._id.toString(),
          attributes: {
            name: driver.name,
            phoneNumber: driver.phoneNumber,
            email: driver.email,
            vehicle: driver.vehicle,
            createdAt: driver.createdAt,
          },
        }),
      ),
    };
  },

  mapToDriverOutput(driver: WithId<Driver>): DriverOutput {
    return {
      data: {
        type: ResourceType.Drivers,
        id: driver._id.toString(),
        attributes: {
          name: driver.name,
          phoneNumber: driver.phoneNumber,
          email: driver.email,
          vehicle: driver.vehicle,
          createdAt: driver.createdAt,
        },
      },
    };
  },
};
