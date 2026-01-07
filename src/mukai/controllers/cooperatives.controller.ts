/* eslint-disable @typescript-eslint/no-unsafe-member-access */
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
  Query,
  Req,
  Logger,
  UseGuards,
  Headers,
} from '@nestjs/common';
import { CooperativesService } from '../services/cooperatives.service';
import {
  CreateCooperativeDto,
  FilterCooperativesLikeDto,
  FilterCooperativesDto,
} from '../dto/create/create-cooperative.dto';
import { UpdateCooperativeDto } from '../dto/update/update-cooperative.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiHeader,
  ApiExcludeEndpoint,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { Cooperative } from '../entities/cooperative.entity';
import { Profile } from 'src/user/entities/user.entity';
import { GeneralErrorResponseDto } from 'src/common/dto/general-error-response.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';
import { ErrorResponseDto } from 'src/common/dto/error-response.dto';
import { UpdateGroupMemberDto } from '../dto/update/update-group-members.dto';

@ApiTags('Cooperatives')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiHeader({
  name: 'apikey',
  description: 'API key for authentication (insert access token)',
  required: true, // Set to true if the header is mandatory
  example:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL2V4YW1wbGUuYXV0aDAuY29tLyIsImF1ZCI6Imh0dHBzOi8vYXBpLmVkY2Fyd2FyZS5jb20vY2FsZW5kYXIvdjEvIiwic3ViIjoidXNyXzEyMyIsImlhdCI6MTQ1ODc4NTc5NiwiZXhwIjoxNDU4ODcyMTk2fQ.CA7eaHjIHz5NxeIJoFK9krqaeZrPLwmMmgI_XiQiIkQ', // Optional: provide an example value
})
@ApiHeader({
  name: 'Authorization',
  description: 'Bearer token for authentication (insert access token)',
  required: true, // Set to true if the header is mandatory
  example:
    'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL2V4YW1wbGUuYXV0aDAuY29tLyIsImF1ZCI6Imh0dHBzOi8vYXBpLmVkY2Fyd2FyZS5jb20vY2FsZW5kYXIvdjEvIiwic3ViIjoidXNyXzEyMyIsImlhdCI6MTQ1ODc4NTc5NiwiZXhwIjoxNDU4ODcyMTk2fQ.CA7eaHjIHz5NxeIJoFK9krqaeZrPLwmMmgI_XiQiIkQ', // Optional: provide an example value
})
@Controller('cooperatives')
export class CooperativesController {
  private readonly logger = new Logger(CooperativesController.name);
  constructor(private readonly cooperativesService: CooperativesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new cooperative' })
  @ApiBody({ type: CreateCooperativeDto })
  @ApiResponse({
    status: 201,
    description: 'Cooperative created successfully',
    type: Cooperative,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async create(
    @Body() createCooperativeDto: CreateCooperativeDto,
    @Req() req,
    @Headers() headers,
  ) {
    const response = await this.cooperativesService.createCooperative(
      createCooperativeDto,
      req.user.sub,
      headers['x-platform'],
    );
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

  @Post('search')
  @ApiOperation({ summary: 'Filter cooperatives' })
  @ApiBody({ type: FilterCooperativesDto })
  @ApiResponse({
    status: 200,
    description: 'Filtered cooperatives fetched successfully',
    type: Cooperative,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async filterCooperatives(
    @Body() fcDto: FilterCooperativesDto,
    @Req() req,
    @Headers() headers,
  ) {
    const response = await this.cooperativesService.filterCooperatives(
      fcDto,
      req.user.sub,
      headers['x-platform'],
    );
    if (response instanceof GeneralErrorResponseDto) {
      return new HttpException(response, response.statusCode);
    }
    return response;
  }

  @Post('search/like')
  @ApiOperation({
    summary: 'Search cooperatives suggestions by category, name or city',
  })
  @ApiBody({ type: FilterCooperativesDto })
  @ApiResponse({
    status: 200,
    description: 'Filtered cooperatives fetched successfully',
    type: Cooperative,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async filterCooperativesLike(
    @Body() fclDto: FilterCooperativesLikeDto,
    @Req() req,
    @Headers() headers,
  ) {
    const response = await this.cooperativesService.filterCooperativesLike(
      fclDto,
      req.user.sub,
      headers['x-platform'],
    );
    if (response instanceof GeneralErrorResponseDto) {
      return new HttpException(response, response.statusCode);
    }
    return response;
  }

  @Get()
  @ApiOperation({ summary: 'List all cooperatives' })
  @ApiResponse({
    status: 200,
    description: 'Array of cooperatives',
    type: [Cooperative],
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async findAll(@Req() req, @Headers() headers) {
    const response = await this.cooperativesService.findAllCooperatives(
      req.user.sub,
      headers['x-platform'],
    );
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
  @Get('service-centre')
  @ApiOperation({ summary: 'List all cooperatives linked to a service centre' })
  @ApiResponse({
    status: 200,
    description: 'Array of cooperatives',
    type: [Object],
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async fetchCoopsForServiceCentre(@Req() req, @Headers() headers) {
    const response = await this.cooperativesService.fetchCoopsForServiceCentre(
      req.user.sub,
      headers['x-platform'],
    );
    if (response['statusCode'] === 400) {
      throw new HttpException(
        response['message'] ?? 'An error occurred',
        HttpStatus.BAD_REQUEST,
      );
    }
    return response;
  }

  @Get('initialize-data/:member_id')
  @ApiOperation({ summary: 'Return coops to which a given member belongs' })
  @ApiResponse({
    status: 200,
    description: 'Array of cooperatives',
    type: [Cooperative],
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async initializeMembers(
    @Param('member_id') member_id: string,
    @Req() req,
    @Headers() headers,
  ) {
    const response = await this.cooperativesService.initializeMembers(
      member_id,
      req.user.sub,
      headers['x-platform'],
    );
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

  @Get('members/available')
  @ApiOperation({ summary: 'List all members that do not have a cooperative' })
  @ApiResponse({
    status: 200,
    description: 'Array of profiles',
    type: [Profile],
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async viewAvailableMembers() {
    const response = await this.cooperativesService.viewAvailableMembers();
    // console.log(`viewAvailableMembers response: ${JSON.stringify(response)}`);
    // if (response['statusCode'] === 400) {
    //   throw new HttpException(response['message'], HttpStatus.BAD_REQUEST);
    // }
    // if (response['statusCode'] === 500) {
    //   throw new HttpException(
    //     response['message'],
    //     HttpStatus.INTERNAL_SERVER_ERROR,
    //   );
    // }
    return response;
  }

  @Get('members/available/like/:searchTerm')
  @ApiParam({
    name: 'searchTerm',
    example: 'john',
    description: 'Search term to filter members by name, email, or phone',
  })
  @ApiOperation({ summary: 'List all members that do not have a cooperative' })
  @ApiResponse({
    status: 200,
    description: 'Array of profiles',
    type: [Profile],
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async viewAvailableMembersLike(@Param('searchTerm') searchTerm: string) {
    const response =
      await this.cooperativesService.viewAvailableMembersLike(searchTerm);
    // console.log(`viewAvailableMembers response: ${JSON.stringify(response)}`);
    // if (response['statusCode'] === 400) {
    //   throw new HttpException(response['message'], HttpStatus.BAD_REQUEST);
    // }
    // if (response['statusCode'] === 500) {
    //   throw new HttpException(
    //     response['message'],
    //     HttpStatus.INTERNAL_SERVER_ERROR,
    //   );
    // }
    return response;
  }

  @Get('admin/:admin_id')
  @ApiOperation({ summary: 'List all cooperatives for a specific admin' })
  @ApiResponse({
    status: 200,
    description: 'Array of cooperatives',
    type: [Cooperative],
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async viewCooperativesForAdmin(@Param('admin_id') admin_id: string) {
    const response =
      await this.cooperativesService.viewCooperativesForAdmin(admin_id);
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

  @Get(':cooperative_id/members')
  @ApiOperation({ summary: 'Get members for a specific cooperative' })
  @ApiParam({
    name: 'cooperative_id',
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Cooperative ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Array of member cooperatives',
    type: [Profile],
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid cooperative ID',
  })
  @ApiResponse({
    status: 404,
    description: 'Cooperative not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async viewCooperativeMembers(
    @Param('cooperative_id') cooperative_id: string,
    @Req() req,
    @Headers() headers,
  ) {
    const response = await this.cooperativesService.viewCooperativeMembers(
      cooperative_id,
      req.user.sub,
      headers['x-platform'],
    );
    console.log(response);
    if (response) {
      if (response['statusCode'] === 400) {
        throw new HttpException(response['message'], HttpStatus.BAD_REQUEST);
      }
      if (response['statusCode'] === 500) {
        throw new HttpException(
          response['message'],
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
    return response;
  }

  @Get(':cooperative_id/interest-rate')
  async fetchCoopInterestRate(@Param('cooperative_id') cooperative_id: string) {
    const response =
      await this.cooperativesService.fetchCoopInterestRate(cooperative_id);
    if (response instanceof ErrorResponseDto) {
      return new HttpException(response, response.statusCode);
    }
    return response;
  }

  @Get('filter')
  @ApiOperation({ summary: 'Check if user is admin for a given coop' })
  @ApiResponse({
    status: 200,
    description: 'true',
    type: Boolean,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async checkIfMemberIsCoopAdmin(
    @Query('admin_id') admin_id: string,
    @Query('coop_id') coop_id: string,
  ) {
    const response = await this.cooperativesService.checkIfMemberIsCoopAdmin(
      admin_id,
      coop_id,
    );
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

  @Post('exchange-rate')
  @ApiOperation({ summary: 'Set an exchange rate' })
  @ApiResponse({
    status: 200,
    description: 'Exchange rate updated successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async setCoopExchangeRate(
    @Query('cooperative_id') cooperative_id: string,
    @Query('exchange_rate') exchange_rate: number,
    @Req() req,
    @Headers() headers,
  ) {
    const response = await this.cooperativesService.setCoopExchangeRate(
      cooperative_id,
      exchange_rate,
      req.user.sub,
      headers['x-platform'],
    );
    if (response instanceof ErrorResponseDto) {
      return new HttpException(response, response.statusCode);
    }
    return response;
  }

  // @ApiExcludeEndpoint()
  @Get(':member_id/active')
  @ApiOperation({ summary: 'Get cooperatives for a specific member' })
  @ApiParam({
    name: 'member_id',
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Member ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Array of member cooperatives',
    type: [Cooperative],
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid member ID',
  })
  @ApiResponse({
    status: 404,
    description: 'Member not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async viewCooperativesForMember(
    @Param('member_id') member_id: string,
    @Req() req,
    @Headers() headers,
  ) {
    const response = await this.cooperativesService.viewCooperativesForMember(
      member_id,
      req.user.sub,
      headers['x-platform'],
    );
    if (response['statusCode'] === 400) {
      throw new HttpException(
        response['message'] ?? 'Bad request',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (response['statusCode'] === 500) {
      throw new HttpException(
        response['message'] ?? 'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return response;
  }

  @ApiExcludeEndpoint()
  @Get(':cooperative_id/subs')
  @ApiOperation({ summary: 'Check member subscriptions for a cooperative' })
  @ApiParam({
    name: 'cooperative_id',
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Cooperative ID',
  })
  @ApiBody({
    description: 'Optional month filter',
    schema: {
      type: 'object',
      properties: {
        month: {
          type: 'string',
          example: 'January',
          description: 'Month name (defaults to current month)',
        },
        year: {
          type: 'number',
          example: 2023,
          description: 'Year (defaults to current year)',
        },
      },
    },
    required: false,
  })
  @ApiResponse({
    status: 200,
    description: 'Subscription status',
    schema: {
      type: 'object',
      properties: {
        paid: { type: 'boolean' },
        month: { type: 'string' },
        year: { type: 'number' },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid group ID or month format',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async checkMemberSubscriptions(
    @Param('group_id') group_id: string,
    @Body() period?: { month?: string; year?: number },
  ) {
    const month =
      period?.month || new Date().toLocaleString('default', { month: 'long' });
    const year = period?.year || new Date().getFullYear();

    const response = await this.cooperativesService.checkMemberSubscriptions(
      group_id,
      month,
    );

    if (response['statusCode'] === 400) {
      throw new HttpException(response['message'], HttpStatus.BAD_REQUEST);
    }
    if (response['statusCode'] === 500) {
      throw new HttpException(
        response['message'],
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return { paid: response, month, year };
  }

  @Get('gender-demographics')
  @ApiOperation({ summary: 'Get cooperative gender demographics' })
  @ApiResponse({
    status: 200,
    description: 'Cooperative gender demographics fetched successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async fetchCoopsGenderDemographicsView(@Req() req, @Headers() headers) {
    const response =
      await this.cooperativesService.fetchCoopsGenderDemographicsView(
        req.user.sub,
        headers['x-platform'],
      );
    if (response['statusCode'] === 400) {
      throw new HttpException(
        response.message ?? 'an error occurred',
        HttpStatus.BAD_REQUEST,
      );
    }
    return response;
  }

  @Get('age-demographics')
  @ApiOperation({ summary: 'Get cooperative age demographics' })
  @ApiQuery({
    name: 'lower_bound',
    description: 'Lower age bound',
    required: true,
    example: 18,
  })
  @ApiQuery({
    name: 'upper_bound',
    description: 'Upper age bound',
    required: true,
    example: 65,
  })
  @ApiResponse({
    status: 200,
    description: 'Cooperative age demographics fetched successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async fetchCoopsAgeDemographicsView(
    @Query('lower_bound') lower_bound: number,
    @Query('upper_bound') upper_bound: number,
    @Req() req,
    @Headers() headers,
  ) {
    const response =
      await this.cooperativesService.fetchCoopAgeDemographicsAnalytics(
        lower_bound,
        upper_bound,
        req.user.sub,
        headers['x-platform'],
      );
    if (response['statusCode'] === 400) {
      throw new HttpException(
        response.message ?? 'an error occurred',
        HttpStatus.BAD_REQUEST,
      );
    }
    return response;
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Cooperative details',
    type: Cooperative,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid ID format',
  })
  @ApiResponse({
    status: 404,
    description: 'Cooperative not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async findOne(@Param('id') id: string) {
    this.logger.log('Opening coop');
    const response = await this.cooperativesService.viewCooperative(id);
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

  @Patch('exit')
  @ApiOperation({
    summary: 'Exit a cooperative',
  })
  @ApiBody({
    type: UpdateGroupMemberDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Coop member exited successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
  })
  @ApiResponse({
    status: 500,
    description: 'Intrnal server error',
  })
  async exitCooperative(@Body() gmDto: UpdateGroupMemberDto) {
    const response = await this.cooperativesService.exitCooperative(gmDto);
    if (response instanceof ErrorResponseDto) {
      return new HttpException(response, response.statusCode);
    }
    return response;
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a cooperative' })
  @ApiParam({
    name: 'id',
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Cooperative ID',
  })
  @ApiBody({ type: UpdateCooperativeDto })
  @ApiResponse({
    status: 200,
    description: 'Updated cooperative details',
    type: Cooperative,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: 404,
    description: 'Cooperative not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async update(
    @Param('id') id: string,
    @Body() updateCooperativeDto: UpdateCooperativeDto,
  ) {
    const response = await this.cooperativesService.updateCooperative(
      id,
      updateCooperativeDto,
    );
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

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a cooperative' })
  @ApiParam({
    name: 'id',
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Cooperative ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Updated cooperative details',
    type: Cooperative,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: 404,
    description: 'Cooperative not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async delete(@Param('id') id: string) {
    const response = await this.cooperativesService.deleteCooperative(id);
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
