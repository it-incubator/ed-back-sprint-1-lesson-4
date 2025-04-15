import { WithId } from 'mongodb';
import { Driver } from '../../domain/driver';
import { DriverOutput } from '../output/driver.output';
import { ResourceType } from '../../../core/types/resource-type';

export function mapToDriverOutput(driver: WithId<Driver>): DriverOutput {
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
}
