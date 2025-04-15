import { Currency } from '../../domain/ride';

export type RideAttributes = {
  clientName: string;
  price: number;
  currency: Currency;
  driverId: string;
  fromAddress: string;
  toAddress: string;
};
