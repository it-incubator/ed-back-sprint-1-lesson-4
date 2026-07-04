import { ObjectId, WithId } from 'mongodb';
import { Driver } from '../domain/driver';
import { driverCollection } from '../../db/collections';
import { DriverQueryInput } from '../routes/input/driver-query.input';
import { DriverListPaginatedOutput } from '../routes/output/driver-list-paginated.output';
import { DriverDataOutput } from '../routes/output/driver-data.output';
import { DriverOutput } from '../routes/output/driver.output';
import { ResourceType } from '../../core/types/resource-type';
import { mapToPaginatedOutput } from '../../core/mappers/map-to-paginated-output';

// Query-репозиторий (сторона чтения): читает данные для представления и
// сразу отдаёт готовые JSON:API-модели. Команды (запись) идут через drivers.repository.
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

    // Поиск по имени/email объединяем через $or: совпадение хотя бы по одному полю.
    if (searchDriverNameTerm || searchDriverEmailTerm) {
      filter.$or = [];
      if (searchDriverNameTerm) {
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

  // Маппинг одной сущности в data-элемент JSON:API — переиспользуется списком и одиночным ответом.
  mapToDriverData(driver: WithId<Driver>): DriverDataOutput {
    return {
      type: ResourceType.Drivers,
      id: driver._id.toString(),
      attributes: {
        name: driver.name,
        phoneNumber: driver.phoneNumber,
        email: driver.email,
        vehicle: driver.vehicle,
        createdAt: driver.createdAt,
      },
    };
  },

  mapToDriverOutput(driver: WithId<Driver>): DriverOutput {
    return { data: this.mapToDriverData(driver) };
  },

  mapToDriverListPaginatedOutput(
    drivers: WithId<Driver>[],
    meta: { pageNumber: number; pageSize: number; totalCount: number },
  ): DriverListPaginatedOutput {
    return mapToPaginatedOutput(drivers, meta, (driver) =>
      this.mapToDriverData(driver),
    );
  },
};
