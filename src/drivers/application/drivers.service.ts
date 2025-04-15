import { driversRepository } from '../repositories/drivers.repository';
import { WithId } from 'mongodb';
import { Driver } from '../domain/driver';
import { ridesRepository } from '../../rides/repositories/rides.repository';
import { DomainError } from '../../core/errors/domain.error';
import { DriverAttributes } from './dtos/driver-attributes';
import { DriverQueryInput } from '../routes/input/driver-query.input';

export enum DriverErrorCode {
  HasActiveRide = 'DRIVER_HAS_ACTIVE_RIDE',
}

export const driversService = {
  async findMany(
    queryDto: DriverQueryInput,
  ): Promise<{ items: WithId<Driver>[]; totalCount: number }> {
    return driversRepository.findMany(queryDto);
  },

  async findByIdOrFail(id: string): Promise<WithId<Driver>> {
    return driversRepository.findByIdOrFail(id);
  },

  async create(dto: DriverAttributes): Promise<string> {
    const newDriver: Driver = {
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
      createdAt: new Date(),
    };

    return driversRepository.create(newDriver);
  },

  async update(id: string, dto: DriverAttributes): Promise<void> {
    await driversRepository.update(id, dto);
    return;
  },

  async delete(id: string): Promise<void> {
    const activeRide = await ridesRepository.findActiveRideByDriverId(id);

    if (activeRide) {
      throw new DomainError(
        `Driver has an active ride. Complete or cancel the ride first`,
        DriverErrorCode.HasActiveRide,
      );
    }

    await driversRepository.delete(id);
    return;
  },
};
