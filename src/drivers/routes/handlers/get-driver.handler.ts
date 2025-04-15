import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
import { mapToDriverOutput } from '../mappers/map-to-driver-output.util';
import { driversService } from '../../application/drivers.service';
import { errorsHandler } from '../../../core/errors/errors.handler';

export async function getDriverHandler(
  req: Request<{ id: string }>,
  res: Response,
) {
  try {
    const id = req.params.id;

    const driver = await driversService.findByIdOrFail(id);

    const driverOutput = mapToDriverOutput(driver);

    res.status(HttpStatus.Ok).send(driverOutput);
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
}
