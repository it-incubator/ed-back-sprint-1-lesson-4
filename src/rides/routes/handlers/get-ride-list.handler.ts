import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
import { RideQueryInput } from '../input/ride-query.input';
import { ridesQueryRepository } from '../../repositories/rides.query-repository';

export async function getRideListHandler(
  req: Request<{}, {}, {}, RideQueryInput>,
  res: Response,
) {
  try {
    // req.query уже провалидирован и приведён к типам middleware'ами
    // (paginationAndSorting + sanitizeQueryParams).
    const queryInput = req.query;

    const { items, totalCount } =
      await ridesQueryRepository.findMany(queryInput);

    const rideListOutput = ridesQueryRepository.mapToRideListPaginatedOutput(
      items,
      {
        pageNumber: queryInput.pageNumber,
        pageSize: queryInput.pageSize,
        totalCount,
      },
    );

    res.send(rideListOutput);
  } catch {
    res.sendStatus(HttpStatus.InternalServerError);
  }
}
