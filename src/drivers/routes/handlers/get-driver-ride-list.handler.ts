import { Request, Response } from 'express';
import { errorsHandler } from '../../../core/exceptions/errors.handler';
import { RideQueryInput } from '../../../rides/routes/input/ride-query.input';
import { driversService } from '../../application/drivers.service';
import { ridesService } from '../../../rides/application/rides.service';
import { mapToRideListPaginatedOutput } from '../../../rides/routes/mappers/map-to-ride-list-paginated-output.util';

export async function getDriverRideListHandler(
  req: Request<{ id: string }, {}, {}, RideQueryInput>,
  res: Response,
) {
  try {
    const driverId = req.params.id;
    const queryInput = req.query;

    // Вложенный маршрут в модуле водителей → используем throw-подход:
    // существование водителя проверяет driversService (кинет NotFoundException).
    await driversService.findByIdOrFail(driverId);

    const { items, totalCount } = await ridesService.findRidesByDriver(
      queryInput,
      driverId,
    );

    const rideListOutput = mapToRideListPaginatedOutput(items, {
      pageNumber: queryInput.pageNumber,
      pageSize: queryInput.pageSize,
      totalCount,
    });
    res.send(rideListOutput);
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
}
