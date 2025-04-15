import { Request, Response } from 'express';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { RideQueryInput } from '../../../rides/routes/input/ride-query.input';
import { ridesQueryRepository } from '../../../rides/repositories/rides.query-repositoty';
import { driversQueryRepository } from '../../repositories/drivers.query-repositoty';

export async function getDriverRideListHandler(
  req: Request<{ id: string }, {}, {}, RideQueryInput>,
  res: Response,
) {
  try {
    const driverId = req.params.id;
    const queryInput = req.query;

    await driversQueryRepository.findByIdOrFail(driverId);
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
