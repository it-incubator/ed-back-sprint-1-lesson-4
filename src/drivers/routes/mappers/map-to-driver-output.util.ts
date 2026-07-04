import { WithId } from 'mongodb';
import { Driver } from '../../domain/driver';
import { DriverOutput } from '../output/driver.output';
import { DriverDataOutput } from '../output/driver-data.output';
import { ResourceType } from '../../../core/types/resource-type';

// Маппинг одной сущности водителя в data-элемент JSON:API.
// Переиспользуется и для одиночного ответа, и для списка (через универсальный пагинатор).
export function mapToDriverData(driver: WithId<Driver>): DriverDataOutput {
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
}

export function mapToDriverOutput(driver: WithId<Driver>): DriverOutput {
  return {
    data: mapToDriverData(driver),
  };
}
