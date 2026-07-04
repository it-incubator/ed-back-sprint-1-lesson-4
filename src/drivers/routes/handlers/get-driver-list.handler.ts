import { Request, Response } from 'express';
import { errorsHandler } from '../../../core/exceptions/errors.handler';
import { DriverQueryInput } from '../input/driver-query.input';
import { driversQueryRepository } from '../../repositories/drivers.query-repository';

export async function getDriverListHandler(
  req: Request<{}, {}, {}, DriverQueryInput>,
  res: Response,
) {
  try {
    // req.query уже провалидирован и приведён к типам middleware'ами
    // (paginationAndSorting + sanitizeQueryParams), поэтому используем его напрямую.
    const queryInput = req.query;

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
