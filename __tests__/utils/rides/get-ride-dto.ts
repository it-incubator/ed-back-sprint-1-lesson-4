import { RideAttributes } from '../../../src/rides/application/dtos/ride-attributes';
import { Currency } from '../../../src/rides/domain/ride';

export function getRideDto(driverId: string): RideAttributes {
  return {
    driverId,
    clientName: 'Bob',
    price: 200,
    currency: Currency.USD,
    fromAddress: '123 Main St, Springfield, IL',
    toAddress: '456 Elm St, Shelbyville, IL',
  };
}
