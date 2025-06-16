import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';

import { PostgresRestHandlerModule } from './common/postgresrest';
import { OrdersModule } from './orders/orders.module';
import { MessagingsModule } from './messagings/messagings.module';
import { NodesModule } from './nodes/nodes.module';
import { CommodityController } from './tradingservices/controllers/commodity.controller';
import { ContractBidController } from './tradingservices/controllers/contract-bid.controller';
import { ContractController } from './tradingservices/controllers/contract.controller';
import { ProducerController } from './tradingservices/controllers/producer.controller';
import { ProviderController } from './tradingservices/controllers/provider.controller';
import { ProviderProductsController } from './tradingservices/controllers/provider-products.controller';
import { ProviderServicesController } from './tradingservices/controllers/provider-services.controller';
import { TradingservicesController } from './tradingservices/controllers/tradingservices.controller';
import { TraderInventoryController } from './tradingservices/controllers/trader-inventory.controller';
import { TradingservicesModule } from './tradingservices/modules/tradingservices.module';
import { CommodityModule } from './tradingservices/modules/commodity.module';
import { ContractBidModule } from './tradingservices/modules/contract-bid.module';
import { ContractModule } from './tradingservices/modules/contract.module';
import { ProducerModule } from './tradingservices/modules/producer.module';
import { ProviderModule } from './tradingservices/modules/provider.module';
import { ProviderProductsModule } from './tradingservices/modules/provider-products.module';
import { ProviderServicesModule } from './tradingservices/modules/provider-services.module';
import { TraderInventoryService } from './tradingservices/services/trader-inventory.service';
import { CommodityService } from './tradingservices/services/commodity.service';
import { ContractBidService } from './tradingservices/services/contract-bidding.service';
import { ContractService } from './tradingservices/services/contracts.service';
import { ProducerService } from './tradingservices/services/producers.service';
import { ProviderProductsService } from './tradingservices/services/provider-products.service';
import { ProviderService } from './tradingservices/services/provider.service';
import { ProviderServicesService } from './tradingservices/services/provider-services.service';
import { TradingservicesService } from './tradingservices/services/tradingservices.service';
import { AgreementModule } from './mukai/modules/agreement.module';
import { WalletModule } from './mukai/modules/wallet.module';
import { TransactionModule } from './mukai/modules/transaction.module';
import { OrganizationModule } from './mukai/modules/organization.module';
import { MessageModule } from './mukai/modules/message.module';
import { CooperativeModule } from './mukai/modules/cooperative.module';
import { CooperativeMemberRequestModule } from './mukai/modules/cooperative-member-request.module';
import { ChatModule } from './mukai/modules/chat.module';
import { AssetModule } from './mukai/modules/asset.module';
import { AgreementsController } from './mukai/controllers/agreements.controller';
import { WalletsController } from './mukai/controllers/wallets.controller';
import { TransactionsController } from './mukai/controllers/transactions.controller';
import { OrganizationsController } from './mukai/controllers/organizations.controller';
import { MessagesController } from './mukai/controllers/messages.controller';
import { CooperativesController } from './mukai/controllers/cooperatives.controller';
import { CooperativeMemberRequestsController } from './mukai/controllers/cooperative_member_requests.controller';
import { ChatsController } from './mukai/controllers/chats.controller';
import { AssetsController } from './mukai/controllers/assets.controller';
import { AgreementsService } from './mukai/services/agreements.service';
import { WalletsService } from './mukai/services/wallets.service';
import { TransactionsService } from './mukai/services/transactions.service';
import { OrganizationsService } from './mukai/services/organizations.service';
import { MessagesService } from './mukai/services/messages.service';
import { CooperativesService } from './mukai/services/cooperatives.service';
import { CooperativeMemberRequestsService } from './mukai/services/cooperative_member_requests.service';
import { ChatsService } from './mukai/services/chats.service';
import { AssetsService } from './mukai/services/assets.service';
import { GroupModule } from './mukai/modules/group.module';
import { GroupService } from './mukai/services/group.service';
import { GroupsController } from './mukai/controllers/group.controller';
import { SpendingConditionsModule } from './mukai/modules/spending-conditions.module';
import { SpendingConditionsController } from './mukai/controllers/spending-conditions.controller';
import { SpendingConditionsService } from './mukai/services/spending-conditions.service';
import { EscrowController } from './mukai/controllers/escrow.controller';
import { EscrowService } from './mukai/services/escrow.service';
import { EscrowModule } from './mukai/modules/escrow.module';
import { LoanModule } from './mukai/modules/loan.module';
import { LoanController } from './mukai/controllers/loan.controller';
import { LoanService } from './mukai/services/loan.servce';

@Module({
  imports: [
    PostgresRestHandlerModule,
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    UserModule,
    OrdersModule,
    MessagingsModule,
    NodesModule,
    CommodityModule,
    ContractBidModule,
    ContractModule,
    ProducerModule,
    ProviderModule,
    ProviderProductsModule,
    ProviderServicesModule,
    TradingservicesModule,
    AgreementModule,
    WalletModule,
    TransactionModule,
    OrganizationModule,
    MessageModule,
    CooperativeModule,
    CooperativeMemberRequestModule,
    ChatModule,
    AssetModule,
    GroupModule,
    SpendingConditionsModule,
    EscrowModule,
    LoanModule,
    CooperativeMemberRequestModule,
  ],
  controllers: [
    AppController,
    CommodityController,
    ContractBidController,
    ContractController,
    ProducerController,
    ProviderController,
    ProviderProductsController,
    ProviderServicesController,
    TradingservicesController,
    TraderInventoryController,
    AgreementsController,
    WalletsController,
    TransactionsController,
    OrganizationsController,
    MessagesController,
    CooperativesController,
    CooperativeMemberRequestsController,
    ChatsController,
    AssetsController,
    GroupsController,
    SpendingConditionsController,
    EscrowController,
    LoanController,
    CooperativeMemberRequestsController,
  ],
  providers: [
    AppService,
    CommodityService,
    ContractBidService,
    ContractService,
    ProducerService,
    ProviderService,
    ProviderProductsService,
    ProviderServicesService,
    TradingservicesService,
    TraderInventoryService,
    AgreementsService,
    WalletsService,
    TransactionsService,
    OrganizationsService,
    MessagesService,
    CooperativesService,
    CooperativeMemberRequestsService,
    ChatsService,
    AssetsService,
    GroupService,
    SpendingConditionsService,
    EscrowService,
    LoanService,
    CooperativeMemberRequestsService,
    //   {
    //   provide: APP_GUARD,
    //   useClass: PostgresRestHandlerGuard,
    // },
  ],
})
export class AppModule {}
