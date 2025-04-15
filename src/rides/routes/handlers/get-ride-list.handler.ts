import { Request, Response } from 'express';
import { ridesService } from '../../application/rides.service';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { mapToRideListPaginatedOutput } from '../mappers/map-to-ride-list-paginated-output.util';
import { RideQueryInput } from '../input/ride-query.input';
import { setDefaultSortAndPaginationIfNotExist } from '../../../core/helpers/set-default-sort-and-pagination';

export async function getRideListHandler(
  req: Request<{}, {}, {}, RideQueryInput>,
  res: Response,
) {
  try {
    const queryInput = setDefaultSortAndPaginationIfNotExist(req.query);

    const { items, totalCount } = await ridesService.findMany(queryInput);

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
