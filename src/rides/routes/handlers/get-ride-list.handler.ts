import { Request, Response } from 'express';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { RideQueryInput } from '../input/ride-query.input';
import { setDefaultSortAndPaginationIfNotExist } from '../../../core/helpers/set-default-sort-and-pagination';
import { ridesQueryRepository } from '../../repositories/rides.query-repositoty';

export async function getRideListHandler(
  req: Request<{}, {}, {}, RideQueryInput>,
  res: Response,
) {
  try {
    const queryInput = setDefaultSortAndPaginationIfNotExist(req.query);

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
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
}
