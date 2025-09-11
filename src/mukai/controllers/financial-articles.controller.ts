/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  HttpException,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiBearerAuth,
  ApiExcludeController,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';
import { CreateFinancialArticleDto } from '../dto/create/create-financial-article.dto';
import { UpdateFinancialArticleDto } from '../dto/update/update-financial-article.dto';
import { FinancialArticle } from '../entities/financial_articles.entity';
import { FinancialArticleService } from '../services/financial-article.service';
import { ErrorResponseDto } from 'src/common/dto/error-response.dto';

@ApiTags('FinancialArticles')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiExcludeController()
@Controller('financial_articles')
export class FinancialArticleController {
  constructor(
    private readonly financialArticlesService: FinancialArticleService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new financial_article' })
  @ApiBody({ type: CreateFinancialArticleDto })
  @ApiResponse({
    status: 201,
    description: 'FinancialArticle created successfully',
    type: FinancialArticle,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async create(@Body() createFinancialArticleDto: CreateFinancialArticleDto) {
    const response = await this.financialArticlesService.createFinancialArticle(
      createFinancialArticleDto,
    );
    if (response instanceof ErrorResponseDto) {
      if (response.statusCode === 400) {
        throw new HttpException(response.message!, HttpStatus.BAD_REQUEST);
      }
      if (response.statusCode === 500) {
        throw new HttpException(
          response.message!,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
    return response;
  }

  @Get()
  @ApiOperation({ summary: 'List all financial_articles' })
  @ApiResponse({
    status: 200,
    description: 'Array of financial_articles',
    type: [FinancialArticle],
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async findAll() {
    const response =
      await this.financialArticlesService.findAllFinancialArticles();
    console.log(response);
    if (response instanceof ErrorResponseDto) {
      if (response.statusCode === 400) {
        throw new HttpException(response.message!, HttpStatus.BAD_REQUEST);
      }
      if (response.statusCode === 500) {
        throw new HttpException(
          response.message!,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
    return response;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get financial_article details' })
  @ApiParam({
    name: 'id',
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'FinancialArticle ID',
  })
  @ApiResponse({
    status: 200,
    description: 'FinancialArticle details',
    type: FinancialArticle,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid ID format',
  })
  @ApiResponse({
    status: 404,
    description: 'FinancialArticle not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async findOne(@Param('id') id: string) {
    const response =
      await this.financialArticlesService.viewFinancialArticle(id);
    if (response instanceof ErrorResponseDto) {
      if (response.statusCode === 400) {
        throw new HttpException(response.message!, HttpStatus.BAD_REQUEST);
      }
      if (response.statusCode === 500) {
        throw new HttpException(
          response.message!,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
    return response;
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an financial_article' })
  @ApiParam({
    name: 'id',
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'FinancialArticle ID',
  })
  @ApiBody({ type: UpdateFinancialArticleDto })
  @ApiResponse({
    status: 200,
    description: 'Updated financial_article details',
    type: FinancialArticle,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: 404,
    description: 'FinancialArticle not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async update(
    @Param('id') id: string,
    @Body() updateFinancialArticleDto: UpdateFinancialArticleDto,
  ) {
    const response = await this.financialArticlesService.updateFinancialArticle(
      id,
      updateFinancialArticleDto,
    );
    if (response instanceof ErrorResponseDto) {
      if (response.statusCode === 400) {
        throw new HttpException(response.message!, HttpStatus.BAD_REQUEST);
      }
      if (response.statusCode === 500) {
        throw new HttpException(
          response.message!,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
    return response;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an financial_article' })
  @ApiParam({
    name: 'id',
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'FinancialArticle ID',
  })
  @ApiResponse({
    status: 200,
    description: 'FinancialArticle deleted successfully',
    type: FinancialArticle,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: 404,
    description: 'FinancialArticle not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async delete(@Param('id') id: string) {
    const response =
      await this.financialArticlesService.deleteFinancialArticle(id);
    if (response['statusCode'] === 400) {
      throw new HttpException(response['message'], HttpStatus.BAD_REQUEST);
    }
    if (response['statusCode'] === 500) {
      throw new HttpException(
        response['message'],
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return response;
  }
}
