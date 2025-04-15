import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { driversQueryRepository } from '../../repositories/drivers.query-repositoty';

export async function getDriverHandler(
  req: Request<{ id: string }>,
  res: Response,
) {
  try {
    const id = req.params.id;

    const driver = await driversQueryRepository.findByIdOrFail(id);

    const driverOutput = driversQueryRepository.mapToDriverOutput(driver);

    res.status(HttpStatus.Ok).send(driverOutput);
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
}
