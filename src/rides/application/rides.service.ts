import { RideAttributes } from './dtos/ride-attributes';
import { driversRepository } from '../../drivers/repositories/drivers.repository';
import { ridesRepository } from '../repositories/rides.repository';
import { DomainError } from '../../core/errors/domain.error';
import { DriverErrorCode } from '../../drivers/application/drivers.service';
import { Ride } from '../domain/ride';
import { WithId } from 'mongodb';
import { RideQueryInput } from '../routes/input/ride-query.input';

export enum RideErrorCode {
  AlreadyFinished = 'RIDE_ALREADY_FINISHED',
}

export const ridesService = {
  async findMany(
    queryDto: RideQueryInput,
  ): Promise<{ items: WithId<Ride>[]; totalCount: number }> {
    return ridesRepository.findMany(queryDto);
  },

  async findRidesByDriver(
    queryDto: RideQueryInput,
    driverId: string,
  ): Promise<{ items: WithId<Ride>[]; totalCount: number }> {
    await driversRepository.findByIdOrFail(driverId);

    return ridesRepository.findRidesByDriver(queryDto, driverId);
  },

  async findByIdOrFail(id: string): Promise<WithId<Ride>> {
    return ridesRepository.findByIdOrFail(id);
  },

  async create(dto: RideAttributes): Promise<string> {
    const driver = await driversRepository.findByIdOrFail(dto.driverId);

    // Если у водителя сейчас есть заказ, то создать новую поездку нельзя
    const activeRide = await ridesRepository.findActiveRideByDriverId(
      dto.driverId,
    );

    if (activeRide) {
      throw new DomainError(
        `Driver has an active ride. Complete or cancel the ride first`,
        DriverErrorCode.HasActiveRide,
      );
    }

    const newRide: Ride = {
      clientName: dto.clientName,
      driver: {
        id: dto.driverId,
        name: driver.name,
      },
      vehicle: {
        licensePlate: driver.vehicle.licensePlate,
        name: `${driver.vehicle.make} ${driver.vehicle.model}`,
      },
      price: dto.price,
      currency: dto.currency,
      createdAt: new Date(),
      updatedAt: new Date(),
      startedAt: new Date(),
      finishedAt: null,
      addresses: {
        from: dto.fromAddress,
        to: dto.toAddress,
      },
    };

    return await ridesRepository.createRide(newRide);
  },

  async finishRide(id: string) {
    const ride = await ridesRepository.findByIdOrFail(id);

    if (ride.finishedAt) {
      throw new DomainError(
        `Ride is already finished at ${ride.finishedAt}`,
        RideErrorCode.AlreadyFinished,
      );
    }
    await ridesRepository.finishRide(id, new Date());
  },
};
