import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
import { ridesService } from '../../application/rides.service';
import { ResultStatus } from '../../../core/result/result';
import { sendErrorResult } from '../../../core/result/send-error-result';

export async function finishRideHandler(
  req: Request<{ id: string }, {}, {}>,
  res: Response,
) {
  try {
    const id = req.params.id;

    const result = await ridesService.finishRide(id);

    if (result.status !== ResultStatus.Success) {
      sendErrorResult(result, res);
      return;
    }

    res.sendStatus(HttpStatus.NoContent);
  } catch {
    res.sendStatus(HttpStatus.InternalServerError);
  }
}
