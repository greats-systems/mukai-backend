/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import { Logger, Injectable } from '@nestjs/common';
import { ErrorResponseDto } from 'src/common/dto/error-response.dto';
import { PostgresRest } from 'src/common/postgresrest';
import { CreateFinancialArticleDto } from '../dto/create/create-financial-article.dto';
import { UpdateFinancialArticleDto } from '../dto/update/update-financial-article.dto';
import { FinancialArticle } from '../entities/financial_articles.entity';
import { SuccessResponseDto } from 'src/common/dto/success-response.dto';

function initLogger(funcname: Function): Logger {
  return new Logger(funcname.name);
}

@Injectable()
export class FinancialArticleService {
  private readonly logger = initLogger(FinancialArticleService);
  constructor(private readonly postgresrest: PostgresRest) { }

  async createFinancialArticle(
    createFinancialArticleDto: CreateFinancialArticleDto,
  ): Promise<SuccessResponseDto | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from('financial_articles')
        .insert(createFinancialArticleDto)
        .single();
      if (error) {
        console.log(error);
        return new ErrorResponseDto(400, error.details);
      }
      return {
        statusCode: 201,
        message: 'Financial article created successfully',
        data: data as FinancialArticle,
      };
    } catch (error) {
      return new ErrorResponseDto(500, error);
    }
  }

  async findAllFinancialArticles(): Promise<
    SuccessResponseDto | ErrorResponseDto
  > {
    try {
      this.logger.debug('Fetching articles');
      const { data, error } = await this.postgresrest
        .from('financial_articles')
        .select()
        .order('created_at', { ascending: false });

      if (error) {
        this.logger.error('Error fetching escrow', error);
        return new ErrorResponseDto(400, error.details);
      }

      return {
        statusCode: 200,
        message: 'Financial articles fetched successfully',
        data: data as FinancialArticle[],
      };

      // return data as FinancialArticle[];
    } catch (error) {
      this.logger.error('Exception in findAllFinancialArticle', error);
      return new ErrorResponseDto(500, error);
    }
  }

  async viewFinancialArticle(
    id: string,
  ): Promise<SuccessResponseDto | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from('financial_articles')
        .select()
        .eq('id', id)
        .single();

      if (error) {
        this.logger.error(`Error fetching article ${id}`, error);
        return new ErrorResponseDto(400, error.details);
      }

      return {
        statusCode: 200,
        message: 'Financial article fetched successfully',
        data: data as FinancialArticle,
      };
    } catch (error) {
      this.logger.error(
        `Exception in viewFinancialArticle for id ${id}`,
        error,
      );
      return new ErrorResponseDto(500, error);
    }
  }

  async updateFinancialArticle(
    id: string,
    updateFinancialArticleDto: UpdateFinancialArticleDto,
  ): Promise<SuccessResponseDto | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from('financial_articles')
        .update(updateFinancialArticleDto)
        .eq('id', id)
        .select()
        .single();
      if (error) {
        this.logger.error(`Error updating escrow ${id}`, error);
        return new ErrorResponseDto(400, error.details);
      }
      return {
        statusCode: 200,
        message: 'Financial article updated successfully',
        data: data as FinancialArticle,
      };
    } catch (error) {
      this.logger.error(
        `Exception in updateFinancialArticle for id ${id}`,
        error,
      );
      return new ErrorResponseDto(500, error);
    }
  }

  async deleteFinancialArticle(
    id: string,
  ): Promise<boolean | ErrorResponseDto> {
    try {
      const { error } = await this.postgresrest
        .from('financial_articles')
        .delete()
        .eq('id', id)
        .single();

      if (error) {
        this.logger.error(`Error deleting article ${id}`, error);
        return new ErrorResponseDto(400, error.details);
      }

      return true;
    } catch (error) {
      this.logger.error(
        `Exception in deleteFinancialArticle for id ${id}`,
        error,
      );
      return new ErrorResponseDto(500, error);
    }
  }
}
