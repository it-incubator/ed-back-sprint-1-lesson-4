import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
import { driversService } from '../../application/drivers.service';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { DriverCreateInput } from '../input/driver-create.input';
import { driversQueryRepository } from '../../repositories/drivers.query-repositoty';

export async function createDriverHandler(
  req: Request<{}, {}, DriverCreateInput>,
  res: Response,
) {
  try {
    const createdDriverId = await driversService.create(
      req.body.data.attributes,
    );

    const createdDriver =
      await driversQueryRepository.findByIdOrFail(createdDriverId);

    const driverOutput =
      driversQueryRepository.mapToDriverOutput(createdDriver);

    res.status(HttpStatus.Created).send(driverOutput);
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
}
