import { ResourceType } from '../../../core/types/resource-type';
import { DriverAttributes } from '../../application/dtos/driver-attributes';

export type DriverUpdateInput = {
  data: {
    type: ResourceType.Drivers;
    id: string;
    attributes: DriverAttributes;
  };
};
