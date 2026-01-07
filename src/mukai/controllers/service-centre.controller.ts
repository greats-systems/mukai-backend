/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  Controller,
  Get,
  Param,
  Headers,
  UseGuards,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { SuccessResponseDto } from 'src/common/dto/success-response.dto';
import { ErrorResponseDto } from 'src/common/dto/error-response.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';
// import { JwtNotBannedGuard } from 'src/auth/guards/jwt.not-banned.guard';
import { ServiceCentreService } from '../services/service-centre.service';

@ApiTags('Service Centre')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('service-centre')
export class ServiceCentreController {
  constructor(private readonly serviceCentreService: ServiceCentreService) {}

  @Get()
  @ApiOperation({ summary: 'Get all service centres' })
  @ApiResponse({
    status: 200,
    description: 'Service centres fetched successfully',
    type: SuccessResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Failed to fetch service centres',
    type: ErrorResponseDto,
  })
  async getAllServiceCentres(
    @Req() req,
    @Headers() headers,
  ): Promise<SuccessResponseDto | ErrorResponseDto> {
    return this.serviceCentreService.getAllServiceCentres(
      req.user.sub,
      headers['x-platform'],
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific service centre by ID' })
  @ApiResponse({
    status: 200,
    description: 'Service centre fetched successfully',
    type: SuccessResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Failed to fetch service centre',
    type: ErrorResponseDto,
  })
  async getServiceCentre(
    @Param('id') id: string,
    @Req() req,
    @Headers() headers,
  ): Promise<SuccessResponseDto | ErrorResponseDto> {
    return this.serviceCentreService.getServiceCentre(
      id,
      req.user.sub,
      headers['x-platform'],
    );
  }
}
