import { Request, Response } from 'express';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { DriverQueryInput } from '../input/driver-query.input';
import { setDefaultSortAndPaginationIfNotExist } from '../../../core/helpers/set-default-sort-and-pagination';
import { driversQueryRepository } from '../../repositories/drivers.query-repositoty';

export async function getDriverListHandler(
  req: Request<{}, {}, {}, DriverQueryInput>,
  res: Response,
) {
  try {
    const queryInput = setDefaultSortAndPaginationIfNotExist(req.query);

    const { items, totalCount } =
      await driversQueryRepository.findMany(queryInput);

    const driversListOutput =
      driversQueryRepository.mapToDriverListPaginatedOutput(items, {
        pageNumber: queryInput.pageNumber,
        pageSize: queryInput.pageSize,
        totalCount,
      });

    res.send(driversListOutput);
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
}
