import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
import { errorsHandler } from '../../../core/exceptions/errors.handler';
import { driversQueryRepository } from '../../repositories/drivers.query-repository';
import { NotFoundException } from '../../../core/exceptions/not-found.exception';

export async function getDriverHandler(
  req: Request<{ id: string }>,
  res: Response,
) {
  try {
    const id = req.params.id;

    // Чтение через query-репозиторий; отсутствие водителя — throw-подход модуля drivers.
    const driver = await driversQueryRepository.findById(id);
    if (!driver) {
      throw new NotFoundException('Driver not exist');
    }

    const driverOutput = driversQueryRepository.mapToDriverOutput(driver);

    res.status(HttpStatus.Ok).send(driverOutput);
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
}
