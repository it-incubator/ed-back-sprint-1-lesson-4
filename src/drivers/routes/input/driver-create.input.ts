import { ResourceType } from '../../../core/types/resource-type';
import { DriverAttributes } from '../../application/dtos/driver-attributes';

export type DriverCreateInput = {
  data: {
    type: ResourceType.Drivers;
    attributes: DriverAttributes;
  };
};
