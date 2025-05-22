import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TradingservicesService } from './tradingservices.service';
import { CreateTradingserviceDto } from './dto/create-tradingservice.dto';
import { UpdateTradingserviceDto } from './dto/update-tradingservice.dto';

@Controller('tradingservices')
export class TradingservicesController {
  constructor(private readonly tradingservicesService: TradingservicesService) {}

  @Post()
  create(@Body() createTradingserviceDto: CreateTradingserviceDto) {
    return this.tradingservicesService.create(createTradingserviceDto);
  }

  @Get()
  findAll() {
    return this.tradingservicesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tradingservicesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTradingserviceDto: UpdateTradingserviceDto) {
    return this.tradingservicesService.update(+id, updateTradingserviceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tradingservicesService.remove(+id);
  }
}
