import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
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
  create(@Body() createCommodityDto: CreateLedgerDto.CreateCommodityDto) {
    return this.commodityService.createCommodity(createCommodityDto);
  }
  @Get()
  findAll() {
    return this.commodityService.findAllCommodities();
  }
  @Get(':commodity_id')
  findOne(@Param('commidity_id') commodity_id: string) {
    return this.commodityService.viewCommodity(commodity_id);
  }
}

@Controller('contract')
export class ContractController {
  constructor(
    private readonly contractService: LedgerService.ContractService,
  ) {}
  @Post()
  create(@Body() createContractDto: CreateLedgerDto.CreateContractDto) {
    return this.contractService.createContract(createContractDto);
  }

  @Get()
  findAll() {
    return this.contractService.findAllContracts();
  }

  @Get(':contract_id')
  findOne(@Param('contract_id') contract_id: string) {
    return this.contractService.viewContract(contract_id);
  }

  @Patch(':contract_id')
  update(
    @Param('contract_id') contract_id: string,
    @Body() updateContractDto: UpdateLedgerDto.UpdateContractDto,
  ) {
    return this.contractService.updateContract(contract_id, updateContractDto);
  }

  @Delete(':contract_id')
  delete(@Param('contract_id') contract_id: string) {
    return this.contractService.deleteContract(contract_id);
  }
}

@Controller('contract_bid')
export class ContractBidController {
  constructor(
    private readonly contractBidService: LedgerService.ContractBidService,
  ) {}
  @Post()
  create(@Body() createContractBidDto: CreateLedgerDto.CreateContractBidDto) {
    return this.contractBidService.createContractBid(createContractBidDto);
  }

  @Get()
  findAll() {
    return this.contractBidService.findAllBids();
  }

  @Get(':bid_id')
  findOne(@Param('bid_id') bid_id: string) {
    return this.contractBidService.viewBid(bid_id);
  }

  @Patch(':bid_id')
  update(
    @Param('bid_id') bid_id: string,
    @Body() updateContractBidDto: UpdateLedgerDto.UpdateContractBidDto,
  ) {
    return this.contractBidService.updateBid(bid_id, updateContractBidDto);
  }

  @Delete(':bid_id')
  delete(@Param('bid_id') bid_id: string) {
    return this.contractBidService.deleteBid(bid_id);
  }
}

@Controller('producer')
export class ProducerController {
  constructor(
    private readonly producerService: LedgerService.ProducerService,
  ) {}

  @Post()
  create(@Body() createProducerDto: CreateLedgerDto.CreateProducerDto) {
    return this.producerService.createProducer(createProducerDto);
  }

  @Get()
  findAll() {
    return this.producerService.findAllProducers();
  }

  @Get(':producer_id')
  findOne(@Param('producer_id') producer_id: string) {
    return this.producerService.viewProducer(producer_id);
  }
}

@Controller('provider')
export class ProviderController {
  constructor(
    private readonly providerService: LedgerService.ProviderService,
  ) {}

  @Post()
  create(@Body() createProviderDto: CreateLedgerDto.CreateProviderDto) {
    return this.providerService.createProvider(createProviderDto);
  }

  @Get()
  findAll() {
    return this.providerService.findAllProviders();
  }

  @Get(':provider_id')
  findOne(@Param('provider_id') provider_id: string) {
    return this.providerService.viewProvider(provider_id);
  }
}

@Controller('provider_products')
export class ProviderProductsController {
  constructor(
    private readonly providerProductsService: LedgerService.ProviderProductsService,
  ) {}

  @Post()
  create(
    @Body()
    createProviderProductsDto: CreateLedgerDto.CreateProviderProductsDto,
  ) {
    return this.providerProductsService.createProviderProduct(
      createProviderProductsDto,
    );
  }

  @Get()
  findAll() {
    return this.providerProductsService.findAllProducts();
  }

  @Get(':product_id')
  findOne(@Param('product_id') product_id: string) {
    return this.providerProductsService.viewProviderProducts(product_id);
  }

  @Patch(':product_id')
  update(
    @Param('product_id') product_id: string,
    @Body()
    updateProviderProductsDto: UpdateLedgerDto.UpdateProviderProductsDto,
  ) {
    return this.providerProductsService.updateProviderProducts(
      product_id,
      updateProviderProductsDto,
    );
  }

  @Delete(':product_id')
  delete(@Param('product_id') product_id: string) {
    return this.providerProductsService.deleteProviderProducts(product_id);
  }
}

@Controller('provider_services')
export class ProviderServicesController {
  constructor(
    private readonly providerServicesService: LedgerService.ProviderServicesService,
  ) {}

  @Post()
  create(
    @Body()
    createProviderServicesDto: CreateLedgerDto.CreateProviderServicesDto,
  ) {
    return this.providerServicesService.createProviderService(
      createProviderServicesDto,
    );
  }

  @Get()
  findAll() {
    return this.providerServicesService.findAllServices();
  }

  @Get(':service_id')
  findOne(@Param('service_id') service_id: string) {
    return this.providerServicesService.viewProviderServices(service_id);
  }

  @Patch(':service_id')
  update(
    @Param('service_id') service_id: string,
    @Body()
    updateProviderServicesDto: UpdateLedgerDto.UpdateProviderServicesDto,
  ) {
    return this.providerServicesService.updateProviderServices(
      service_id,
      updateProviderServicesDto,
    );
  }

  @Delete(':service_id')
  delete(@Param('service_id') service_id: string) {
    return this.providerServicesService.deleteProviderServices(service_id);
  }
}

@Controller('trader')
export class TraderController {
  constructor(private readonly traderService: LedgerService.TraderService) {}

  @Post()
  create(@Body() createTraderDto: CreateLedgerDto.CreateTraderDto) {
    return this.traderService.createTrader(createTraderDto);
  }

  @Get()
  findAll() {
    return this.traderService.findAllTraders();
  }

  @Get(':trader_id') // This expects a PATH parameter
  async findOne(@Param('trader_id') trader_id: string) {
    const result = await this.traderService.viewTrader(trader_id);
    if (!result) {
      throw new NotFoundException(`Trader ${trader_id} not found`);
    }
    return result;
  }
}

@Controller('trader_inventory')
export class TraderInventoryController {
  constructor(
    private readonly traderInventoryService: LedgerService.TraderInventoryService,
  ) {}
  @Post()
  create(
    @Body() createTraderInventoryDto: CreateLedgerDto.CreateTraderInventoryDto,
  ) {
    return this.traderInventoryService.createTraderInventory(
      createTraderInventoryDto,
    );
  }

  @Get(':trader_id')
  findAll(@Param('trader_id') trader_id: string) {
    return this.traderInventoryService.viewInventory(trader_id);
  }

  @Patch(':inventory_id')
  update(
    @Param('inventory_id') inventory_id: string,
    updateTraderInventoryDto: UpdateLedgerDto.UpdateTraderInventoryDto,
  ) {
    return this.traderInventoryService.updateInventory(
      inventory_id,
      updateTraderInventoryDto,
    );
  }
}
