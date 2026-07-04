import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
import { ridesQueryRepository } from '../../repositories/rides.query-repository';
import { notFoundResult } from '../../../core/result/result';
import { sendErrorResult } from '../../../core/result/send-error-result';

export async function getRideHandler(
  req: Request<{ id: string }>,
  res: Response,
) {
  try {
    const id = req.params.id;

    // Чтение через query-репозиторий; отсутствие поездки отдаём в едином формате
    // ошибок Result-подхода модуля rides.
    const ride = await ridesQueryRepository.findById(id);
    if (!ride) {
      sendErrorResult(notFoundResult('Ride not exist'), res);
      return;
    }

    const rideOutput = ridesQueryRepository.mapToRideOutput(ride);

    res.send(rideOutput);
  } catch {
    res.sendStatus(HttpStatus.InternalServerError);
  }
}
