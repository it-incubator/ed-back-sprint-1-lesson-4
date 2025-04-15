import { Request, Response } from 'express';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { ridesQueryRepository } from '../../repositories/rides.query-repositoty';
import { RepositoryNotFoundError } from '../../../core/errors/repository-not-found.error';

export async function getRideHandler(
  req: Request<{ id: string }>,
  res: Response,
) {
  try {
    const id = req.params.id;

    const ride = await ridesQueryRepository.findById(id);
    if (!ride) {
      throw new RepositoryNotFoundError('Ride not exist');
    }

    const rideOutput = ridesQueryRepository.mapToRideOutputUtil(ride);

    res.send(rideOutput);
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
}
