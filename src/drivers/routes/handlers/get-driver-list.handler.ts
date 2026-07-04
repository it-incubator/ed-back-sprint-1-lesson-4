import { Request, Response } from 'express';
import { driversService } from '../../application/drivers.service';
import { errorsHandler } from '../../../core/exceptions/errors.handler';
import { mapToDriverListPaginatedOutput } from '../mappers/map-to-driver-list-paginated-output.util';
import { DriverQueryInput } from '../input/driver-query.input';

export async function getDriverListHandler(
  req: Request<{}, {}, {}, DriverQueryInput>,
  res: Response,
) {
  try {
    // req.query уже провалидирован и приведён к типам middleware'ами
    // (paginationAndSorting + sanitizeQueryParams), поэтому используем его напрямую.
    const queryInput = req.query;

    const { items, totalCount } = await driversService.findMany(queryInput);

    const driversListOutput = mapToDriverListPaginatedOutput(items, {
      pageNumber: queryInput.pageNumber,
      pageSize: queryInput.pageSize,
      totalCount,
    });

    res.send(driversListOutput);
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
}
