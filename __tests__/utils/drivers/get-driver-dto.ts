import { DriverAttributes } from '../../../src/drivers/application/dtos/driver-attributes';

export function getDriverDto(): DriverAttributes {
  return {
    name: 'Feodor',
    phoneNumber: '987-654-3210',
    email: 'feodor@example.com',
    vehicleMake: 'Audi',
    vehicleModel: 'A6',
    vehicleYear: 2020,
    vehicleLicensePlate: 'XYZ-456',
    vehicleDescription: null,
    vehicleFeatures: [],
  };
}
