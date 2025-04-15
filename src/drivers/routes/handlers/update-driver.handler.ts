import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
import { driversService } from '../../application/drivers.service';
import { DriverUpdateInput } from '../input/driver-update.input';
import { errorsHandler } from '../../../core/errors/errors.handler';

export async function updateDriverHandler(
  req: Request<{ id: string }, {}, DriverUpdateInput>,
  res: Response,
) {
  try {
    const id = req.params.id;

    await driversService.update(id, req.body.data.attributes);

    res.sendStatus(HttpStatus.NoContent);
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
}
