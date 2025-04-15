import { ResourceType } from '../../../core/types/resource-type';
import { RideAttributes } from '../../application/dtos/ride-attributes';

export type RideCreateInput = {
  data: {
    type: ResourceType.Rides;
    attributes: RideAttributes;
  };
};
