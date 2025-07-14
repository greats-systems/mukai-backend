import { Module } from '@nestjs/common';
import { FinancialArticleController } from '../controllers/financial-articles.controller';
import { FinancialArticleService } from '../services/financial-article.service';
import { PostgresRest } from 'src/common/postgresrest';

@Module({
  controllers: [FinancialArticleController],
  providers: [FinancialArticleService, PostgresRest],
})
export class FinancialArticleModule {}
