import { Request, Response } from 'express';
import { errorsHandler } from '../../../core/exceptions/errors.handler';
import { RideQueryInput } from '../../../rides/routes/input/ride-query.input';
import { ridesQueryRepository } from '../../../rides/repositories/rides.query-repository';
import { driversQueryRepository } from '../../repositories/drivers.query-repository';
import { NotFoundException } from '../../../core/exceptions/not-found.exception';

export async function getDriverRideListHandler(
  req: Request<{ id: string }, {}, {}, RideQueryInput>,
  res: Response,
) {
  try {
    const driverId = req.params.id;
    const queryInput = req.query;

    // Вложенный маршрут в модуле водителей → throw-подход: существование водителя
    // проверяем сами (query-репозиторий), при отсутствии кидаем NotFoundException.
    const driver = await driversQueryRepository.findById(driverId);
    if (!driver) {
      throw new NotFoundException('Driver not exist');
    }

    const { items, totalCount } = await ridesQueryRepository.findRidesByDriver(
      queryInput,
      driverId,
    );

    const rideListOutput = ridesQueryRepository.mapToRideListPaginatedOutput(
      items,
      {
        pageNumber: queryInput.pageNumber,
        pageSize: queryInput.pageSize,
        totalCount,
      },
    );
    res.send(rideListOutput);
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
}
