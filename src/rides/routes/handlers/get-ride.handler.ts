import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
import { mapToRideOutputUtil } from '../mappers/map-to-ride-output.util';
import { ridesService } from '../../application/rides.service';
import { ResultStatus } from '../../../core/result/result';
import { sendErrorResult } from '../../../core/result/send-error-result';

export async function getRideHandler(
  req: Request<{ id: string }>,
  res: Response,
) {
  try {
    const id = req.params.id;

    const result = await ridesService.findById(id);

    if (result.status !== ResultStatus.Success) {
      sendErrorResult(result, res);
      return;
    }

    const rideOutput = mapToRideOutputUtil(result.data);

    res.send(rideOutput);
  } catch {
    res.sendStatus(HttpStatus.InternalServerError);
  }
}
