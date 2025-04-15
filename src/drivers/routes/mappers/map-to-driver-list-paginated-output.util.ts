import { WithId } from 'mongodb';
import { Driver } from '../../domain/driver';
import { ResourceType } from '../../../core/types/resource-type';
import { DriverListPaginatedOutput } from '../output/driver-list-paginated.output';
import { DriverDataOutput } from '../output/driver-data.output';

export function mapToDriverListPaginatedOutput(
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
}
