import { PartialType } from '@nestjs/swagger';
import { CreateFinancialArticleDto } from '../create/create-financial-article.dto';

export class UpdateFinancialArticleDto extends PartialType(
  CreateFinancialArticleDto,
) {}
