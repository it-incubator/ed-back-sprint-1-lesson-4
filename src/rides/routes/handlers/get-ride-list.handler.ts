import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
import { ridesService } from '../../application/rides.service';
import { mapToRideListPaginatedOutput } from '../mappers/map-to-ride-list-paginated-output.util';
import { RideQueryInput } from '../input/ride-query.input';

export async function getRideListHandler(
  req: Request<{}, {}, {}, RideQueryInput>,
  res: Response,
) {
  try {
    // req.query уже провалидирован и приведён к типам middleware'ами
    // (paginationAndSorting + sanitizeQueryParams).
    const queryInput = req.query;

    const { items, totalCount } = await ridesService.findMany(queryInput);

    const rideListOutput = mapToRideListPaginatedOutput(items, {
      pageNumber: queryInput.pageNumber,
      pageSize: queryInput.pageSize,
      totalCount,
    });

    res.send(rideListOutput);
  } catch {
    res.sendStatus(HttpStatus.InternalServerError);
  }
}
