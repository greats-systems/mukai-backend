import { PartialType } from '@nestjs/swagger';
import { CreateAssetDto } from '../create/create-asset.dto';

export class UpdateAssetDto extends PartialType(CreateAssetDto) {}
