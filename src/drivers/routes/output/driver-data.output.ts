import { VehicleFeature } from '../../domain/driver';
import { ResourceType } from '../../../core/types/resource-type';

export type DriverDataOutput = {
  type: ResourceType.Drivers;
  id: string;
  attributes: {
    name: string;
    phoneNumber: string;
    email: string;
    vehicle: {
      make: string; // e.g., Toyota
      model: string; // e.g., Camry
      year: number;
      licensePlate: string;
      description: string | null;
      features: VehicleFeature[];
    };
    createdAt: Date;
  };
};
