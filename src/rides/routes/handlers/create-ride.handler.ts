import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
import { mapToRideOutputUtil } from '../mappers/map-to-ride-output.util';
import { RideCreateInput } from '../input/ride-create.input';
import { ridesService } from '../../application/rides.service';
import { ResultStatus } from '../../../core/result/result';
import { sendErrorResult } from '../../../core/result/send-error-result';

export async function createRideHandler(
  req: Request<{}, {}, RideCreateInput>,
  res: Response,
) {
  try {
    const result = await ridesService.create(req.body.data.attributes);

    // Ожидаемые ошибки (нет водителя / водитель занят) приходят в Result.
    if (result.status !== ResultStatus.Success) {
      sendErrorResult(result, res);
      return;
    }

    const rideOutput = mapToRideOutputUtil(result.data);

    res.status(HttpStatus.Created).send(rideOutput);
  } catch {
    // Непредвиденные (инфраструктурные) ошибки — 500.
    res.sendStatus(HttpStatus.InternalServerError);
  }
}
