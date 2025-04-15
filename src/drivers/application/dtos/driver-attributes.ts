import { VehicleFeature } from '../../domain/driver';

export type DriverAttributes = {
  name: string;
  phoneNumber: string;
  email: string;

  vehicleMake: string;
  vehicleModel: string;
  vehicleYear: number;
  vehicleLicensePlate: string;
  vehicleDescription: string | null;
  vehicleFeatures: VehicleFeature[];
};
