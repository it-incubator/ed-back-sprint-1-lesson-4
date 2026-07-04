import { RideAttributes } from './dtos/ride-attributes';
import { driversRepository } from '../../drivers/repositories/drivers.repository';
import { ridesRepository } from '../repositories/rides.repository';
import { Ride } from '../domain/ride';
import { WithId } from 'mongodb';
import {
  domainResult,
  notFoundResult,
  Result,
  successResult,
} from '../../core/result/result';
import { RideErrorCode } from '../enums/domain.code';
import { DriverErrorCode } from '../../drivers/enums/domain.codes';

// BLL модуля поездок (сторона команд CQRS). Подход обработки ошибок —
// "app notification result": сервис НЕ бросает исключения на ожидаемые ошибки,
// а ВОЗВРАЩАЕТ объект Result со статусом и данными. Хендлер по статусу решает,
// что отдать клиенту. Чтение для представления — в rides.query-repository.
export const ridesService = {
  async create(dto: RideAttributes): Promise<Result<WithId<Ride>>> {
    const driver = await driversRepository.findById(dto.driverId);

    if (!driver) {
      return notFoundResult('Driver not exist');
    }

    // Если у водителя сейчас есть заказ, то создать новую поездку нельзя
    const activeRide = await ridesRepository.findActiveRideByDriverId(
      dto.driverId,
    );

    if (activeRide) {
      return domainResult(
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
      updatedAt: null,
      startedAt: new Date(),
      finishedAt: null,
      addresses: {
        from: dto.fromAddress,
        to: dto.toAddress,
      },
    };

    // Репозиторий возвращает уже сохранённую сущность — повторный запрос в БД не нужен.
    const createdRide = await ridesRepository.createRide(newRide);

    return successResult(createdRide);
  },

  async finishRide(id: string): Promise<Result<null>> {
    const ride = await ridesRepository.findById(id);

    if (!ride) {
      return notFoundResult('Ride not exist');
    }

    if (ride.finishedAt) {
      return domainResult(
        `Ride is already finished at ${ride.finishedAt}`,
        RideErrorCode.AlreadyFinished,
      );
    }

    await ridesRepository.finishRide(id, new Date());

    return successResult(null);
  },
};
