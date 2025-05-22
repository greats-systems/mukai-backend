/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import * as LedgerService from './ledger.service';
import * as CreateLedgerDto from './dto/create-ledger.dto';
import * as UpdateLedgerDto from './dto/update-ledger.dto';

@Controller('test')
export class TestController {
  @Get()
  findAll() {
    return { message: 'Success!' };
  }
}

@Controller('commodity')
export class CommodityController {
  constructor(
    private readonly commodityService: LedgerService.CommodityService,
  ) {}
  @Post()
  async create(@Body() createCommodityDto: CreateLedgerDto.CreateCommodityDto) {
    const response =
      await this.commodityService.createCommodity(createCommodityDto);

    if (response['statusCode'] == 400) {
      throw new HttpException(response['message'], HttpStatus.BAD_REQUEST);
    }
    if (response['statusCode'] == 409) {
      throw new HttpException(response['message'], HttpStatus.CONFLICT);
    }
    if (response['statusCode'] == 500) {
      throw new HttpException(
        response['message'],
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  async findAll() {
    const response = await this.commodityService.findAllCommodities();
    if (response['statusCode'] == 400) {
      throw new HttpException(response['message'], HttpStatus.BAD_REQUEST);
    }
    if (response['statusCode'] == 500) {
      throw new HttpException(
        response['message'],
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  @Get(':commodity_id')
  async findOne(@Param('commidity_id') commodity_id: string) {
    const response = await this.commodityService.viewCommodity(commodity_id);
    if (response['statusCode'] == 400) {
      throw new HttpException(response['message'], HttpStatus.BAD_REQUEST);
    }
    if (response['statusCode'] == 500) {
      throw new HttpException(
        response['message'],
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

@Controller('contract')
export class ContractController {
  constructor(
    private readonly contractService: LedgerService.ContractService,
  ) {}
  @Post()
  async create(@Body() createContractDto: CreateLedgerDto.CreateContractDto) {
    const response =
      await this.contractService.createContract(createContractDto);
    if (response['statusCode'] == 400) {
      throw new HttpException(response['message'], HttpStatus.BAD_REQUEST);
    }
    if (response['statusCode'] == 409) {
      throw new HttpException(response['message'], HttpStatus.CONFLICT);
    }
    if (response['statusCode'] == 500) {
      throw new HttpException(
        response['message'],
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  async findAll() {
    const response = await this.contractService.findAllContracts();
    if (response['statusCode'] == 400) {
      throw new HttpException(response['message'], HttpStatus.BAD_REQUEST);
    }
    if (response['statusCode'] == 500) {
      throw new HttpException(
        response['message'],
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':contract_id')
  async findOne(@Param('contract_id') contract_id: string) {
    const response = await this.contractService.viewContract(contract_id);
    if (response['statusCode'] == 400) {
      throw new HttpException(response['message'], HttpStatus.BAD_REQUEST);
    }
    if (response['statusCode'] == 500) {
      throw new HttpException(
        response['message'],
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch(':contract_id')
  async update(
    @Param('contract_id') contract_id: string,
    @Body() updateContractDto: UpdateLedgerDto.UpdateContractDto,
  ) {
    const response = await this.contractService.updateContract(
      contract_id,
      updateContractDto,
    );
    if (response['statusCode'] == 400) {
      throw new HttpException(response['message'], HttpStatus.BAD_REQUEST);
    }
    if (response['statusCode'] == 500) {
      throw new HttpException(
        response['message'],
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':contract_id')
  async delete(@Param('contract_id') contract_id: string) {
    const response = await this.contractService.deleteContract(contract_id);
    if (response['statusCode'] == 400) {
      throw new HttpException(response['message'], HttpStatus.BAD_REQUEST);
    }
    if (response['statusCode'] == 500) {
      throw new HttpException(
        response['message'],
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

@Controller('contract_bid')
export class ContractBidController {
  constructor(
    private readonly contractBidService: LedgerService.ContractBidService,
  ) {}
  @Post()
  async create(
    @Body() createContractBidDto: CreateLedgerDto.CreateContractBidDto,
  ) {
    const response =
      await this.contractBidService.createContractBid(createContractBidDto);
    if (response['statusCode'] == 400) {
      throw new HttpException(response['message'], HttpStatus.BAD_REQUEST);
    }

    if (response['statusCode'] == 403) {
      throw new HttpException(response['message'], HttpStatus.FORBIDDEN);
    }
    if (response['statusCode'] == 409) {
      throw new HttpException(response['message'], HttpStatus.CONFLICT);
    }
    if (response['statusCode'] == 404) {
      throw new HttpException(response['message'], HttpStatus.NOT_FOUND);
    }
    if (response['statusCode'] == 500) {
      throw new HttpException(
        response['message'],
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  async findAll() {
    const response = await this.contractBidService.findAllBids();
    if (response['statusCode'] == 400) {
      throw new HttpException(response['message'], HttpStatus.BAD_REQUEST);
    }
    if (response['statusCode'] == 500) {
      throw new HttpException(
        response['message'],
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':bid_id')
  async findOne(@Param('bid_id') bid_id: string) {
    const response = await this.contractBidService.viewBid(bid_id);
    if (response['statusCode'] == 400) {
      throw new HttpException(response['message'], HttpStatus.BAD_REQUEST);
    }
    if (response['statusCode'] == 500) {
      throw new HttpException(
        response['message'],
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch(':bid_id')
  async update(
    @Param('bid_id') bid_id: string,
    @Body() updateContractBidDto: UpdateLedgerDto.UpdateContractBidDto,
  ) {
    const response = await this.contractBidService.updateBid(
      bid_id,
      updateContractBidDto,
    );
    if (response['statusCode'] == 400) {
      throw new HttpException(response['message'], HttpStatus.BAD_REQUEST);
    }
    if (response['statusCode'] == 500) {
      throw new HttpException(
        response['message'],
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':bid_id')
  async delete(@Param('bid_id') bid_id: string) {
    const response = await this.contractBidService.deleteBid(bid_id);
    if (response['statusCode'] == 400) {
      throw new HttpException(response['message'], HttpStatus.BAD_REQUEST);
    }
    if (response['statusCode'] == 500) {
      throw new HttpException(
        response['message'],
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

@Controller('producer')
export class ProducerController {
  constructor(
    private readonly producerService: LedgerService.ProducerService,
  ) {}

  @Post()
  async create(@Body() createProducerDto: CreateLedgerDto.CreateProducerDto) {
    const response =
      await this.producerService.createProducer(createProducerDto);
    if (response['statusCode'] == 400) {
      throw new HttpException(response['message'], HttpStatus.BAD_REQUEST);
    }
    if (response['statusCode'] == 409) {
      throw new HttpException(response['message'], HttpStatus.CONFLICT);
    }
    if (response['statusCode'] == 500) {
      throw new HttpException(
        response['message'],
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  async findAll() {
    const response = await this.producerService.findAllProducers();
    if (response['statusCode'] == 400) {
      throw new HttpException(response['message'], HttpStatus.BAD_REQUEST);
    }
    if (response['statusCode'] == 500) {
      throw new HttpException(
        response['message'],
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':producer_id')
  async findOne(@Param('producer_id') producer_id: string) {
    const response = await this.producerService.viewProducer(producer_id);
    if (response['statusCode'] == 400) {
      throw new HttpException(response['message'], HttpStatus.BAD_REQUEST);
    }
    if (response['statusCode'] == 500) {
      throw new HttpException(
        response['message'],
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

@Controller('provider')
export class ProviderController {
  constructor(
    private readonly providerService: LedgerService.ProviderService,
  ) {}

  @Post()
  async create(@Body() createProviderDto: CreateLedgerDto.CreateProviderDto) {
    const response =
      await this.providerService.createProvider(createProviderDto);
    if (response['statusCode'] == 400) {
      throw new HttpException(response['message'], HttpStatus.BAD_REQUEST);
    }
    if (response['statusCode'] == 409) {
      throw new HttpException(response['message'], HttpStatus.CONFLICT);
    }
    if (response['statusCode'] == 422) {
      throw new HttpException(
        response['message'],
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    if (response['statusCode'] == 500) {
      throw new HttpException(
        response['message'],
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  async findAll() {
    const response = await this.providerService.findAllProviders();
    if (response['statusCode'] == 400) {
      throw new HttpException(response['message'], HttpStatus.BAD_REQUEST);
    }
    if (response['statusCode'] == 500) {
      throw new HttpException(
        response['message'],
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':provider_id')
  async findOne(@Param('provider_id') provider_id: string) {
    const response = await this.providerService.viewProvider(provider_id);
    if (response['statusCode'] == 400) {
      throw new HttpException(response['message'], HttpStatus.BAD_REQUEST);
    }
    if (response['statusCode'] == 500) {
      throw new HttpException(
        response['message'],
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

@Controller('provider_products')
export class ProviderProductsController {
  constructor(
    private readonly providerProductsService: LedgerService.ProviderProductsService,
  ) {}

  @Post()
  async create(
    @Body()
    createProviderProductsDto: CreateLedgerDto.CreateProviderProductsDto,
  ) {
    const response = await this.providerProductsService.createProviderProduct(
      createProviderProductsDto,
    );
    if (response['statusCode'] == 400) {
      throw new HttpException(response['message'], HttpStatus.BAD_REQUEST);
    }
    if (response['statusCode'] == 409) {
      throw new HttpException(response['message'], HttpStatus.CONFLICT);
    }
    if (response['statusCode'] == 500) {
      throw new HttpException(
        response['message'],
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  async findAll() {
    const response = await this.providerProductsService.findAllProducts();
    if (response['statusCode'] == 400) {
      throw new HttpException(response['message'], HttpStatus.BAD_REQUEST);
    }
    if (response['statusCode'] == 500) {
      throw new HttpException(
        response['message'],
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':product_id')
  async findOne(@Param('product_id') product_id: string) {
    const response =
      await this.providerProductsService.viewProviderProducts(product_id);
    if (response['statusCode'] == 400) {
      throw new HttpException(response['message'], HttpStatus.BAD_REQUEST);
    }
    if (response['statusCode'] == 500) {
      throw new HttpException(
        response['message'],
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch(':product_id')
  async update(
    @Param('product_id') product_id: string,
    @Body()
    updateProviderProductsDto: UpdateLedgerDto.UpdateProviderProductsDto,
  ) {
    const response = await this.providerProductsService.updateProviderProducts(
      product_id,
      updateProviderProductsDto,
    );
    if (response['statusCode'] == 400) {
      throw new HttpException(response['message'], HttpStatus.BAD_REQUEST);
    }
    if (response['statusCode'] == 500) {
      throw new HttpException(
        response['message'],
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':product_id')
  delete(@Param('product_id') product_id: string) {
    const response =
      this.providerProductsService.deleteProviderProducts(product_id);
    if (response['statusCode'] == 400) {
      throw new HttpException(response['message'], HttpStatus.BAD_REQUEST);
    }
    if (response['statusCode'] == 500) {
      throw new HttpException(
        response['message'],
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

@Controller('provider_services')
export class ProviderServicesController {
  constructor(
    private readonly providerServicesService: LedgerService.ProviderServicesService,
  ) {}

  @Post()
  async create(
    @Body()
    createProviderServicesDto: CreateLedgerDto.CreateProviderServicesDto,
  ) {
    const response = await this.providerServicesService.createProviderService(
      createProviderServicesDto,
    );
    if (response['statusCode'] == 400) {
      throw new HttpException(response['message'], HttpStatus.BAD_REQUEST);
    }
    if (response['statusCode'] == 409) {
      throw new HttpException(response['message'], HttpStatus.CONFLICT);
    }
    if (response['statusCode'] == 500) {
      throw new HttpException(
        response['message'],
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  async findAll() {
    const response = await this.providerServicesService.findAllServices();
    if (response['statusCode'] == 400) {
      throw new HttpException(response['message'], HttpStatus.BAD_REQUEST);
    }
    if (response['statusCode'] == 500) {
      throw new HttpException(
        response['message'],
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':service_id')
  async findOne(@Param('service_id') service_id: string) {
    const response =
      await this.providerServicesService.viewProviderServices(service_id);
    if (response['statusCode'] == 400) {
      throw new HttpException(response['message'], HttpStatus.BAD_REQUEST);
    }
    if (response['statusCode'] == 500) {
      throw new HttpException(
        response['message'],
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch(':service_id')
  async update(
    @Param('service_id') service_id: string,
    @Body()
    updateProviderServicesDto: UpdateLedgerDto.UpdateProviderServicesDto,
  ) {
    const response = await this.providerServicesService.updateProviderServices(
      service_id,
      updateProviderServicesDto,
    );
    if (response['statusCode'] == 400) {
      throw new HttpException(response['message'], HttpStatus.BAD_REQUEST);
    }
    if (response['statusCode'] == 500) {
      throw new HttpException(
        response['message'],
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':service_id')
  async delete(@Param('service_id') service_id: string) {
    const response =
      await this.providerServicesService.deleteProviderServices(service_id);
    if (response['statusCode'] == 400) {
      throw new HttpException(response['message'], HttpStatus.BAD_REQUEST);
    }
    if (response['statusCode'] == 500) {
      throw new HttpException(
        response['message'],
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

@Controller('trader')
export class TraderController {
  constructor(private readonly traderService: LedgerService.TraderService) {}

  @Post()
  async create(@Body() createTraderDto: CreateLedgerDto.CreateTraderDto) {
    const response = await this.traderService.createTrader(createTraderDto);
    if (response['statusCode'] == 400) {
      throw new HttpException(response['message'], HttpStatus.BAD_REQUEST);
    }
    if (response['statusCode'] == 500) {
      throw new HttpException(
        response['message'],
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  async findAll() {
    const response = await this.traderService.findAllTraders();
    if (response['statusCode'] == 400) {
      throw new HttpException(response['message'], HttpStatus.BAD_REQUEST);
    }
    if (response['statusCode'] == 500) {
      throw new HttpException(
        response['message'],
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':trader_id') // This expects a PATH parameter
  async findOne(@Param('trader_id') trader_id: string) {
    const response = await this.traderService.viewTrader(trader_id);
    if (response['statusCode'] == 400) {
      throw new HttpException(response['message'], HttpStatus.BAD_REQUEST);
    }
    if (response['statusCode'] == 500) {
      throw new HttpException(
        response['message'],
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

@Controller('trader_inventory')
export class TraderInventoryController {
  constructor(
    private readonly traderInventoryService: LedgerService.TraderInventoryService,
  ) {}
  @Post()
  async create(
    @Body() createTraderInventoryDto: CreateLedgerDto.CreateTraderInventoryDto,
  ) {
    const response = await this.traderInventoryService.createTraderInventory(
      createTraderInventoryDto,
    );
    if (response['statusCode'] == 400) {
      throw new HttpException(response['message'], HttpStatus.BAD_REQUEST);
    }
    if (response['statusCode'] == 409) {
      throw new HttpException(response['message'], HttpStatus.CONFLICT);
    }
    if (response['statusCode'] == 500) {
      throw new HttpException(
        response['message'],
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':trader_id')
  async findAll(@Param('trader_id') trader_id: string) {
    const response = await this.traderInventoryService.viewInventory(trader_id);
    if (response['statusCode'] == 400) {
      throw new HttpException(response['message'], HttpStatus.BAD_REQUEST);
    }
    if (response['statusCode'] == 500) {
      throw new HttpException(
        response['message'],
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch(':commodity_id')
  async update(
    @Param('commodity_id') commodity_id: string,
    updateTraderInventoryDto: UpdateLedgerDto.UpdateTraderInventoryDto,
  ) {
    const response = await this.traderInventoryService.updateInventory(
      commodity_id,
      updateTraderInventoryDto,
    );
    if (response['statusCode'] == 400) {
      throw new HttpException(response['message'], HttpStatus.BAD_REQUEST);
    }
    if (response['statusCode'] == 500) {
      throw new HttpException(
        response['message'],
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
