import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { MessagingsModule } from './messagings/messagings.module';
import { NodesModule } from './nodes/nodes.module';
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
import { LoanService } from './mukai/services/loan.service';
import { CooperativeMemberApprovalsModule } from './mukai/modules/cooperative-member-approvals.module';
import { CooperativeMemberApprovalsController } from './mukai/controllers/cooperative-member-approvals.controller';
import { CooperativeMemberApprovalsService } from './mukai/services/cooperative-member-approvals.service';
import { SubscriberModule } from './wallet/modules/subscriber.module';
import { SubscriberController } from './wallet/controllers/subscriber.controller';
import { SubscriberService } from './wallet/services/subscriber.service';
import { WalletTransactionController } from './wallet/controllers/wallet-transaction.controller';
import { WalletTransactionModule } from './wallet/modules/wallet-transaction.module';
import { WalletTransactionService } from './wallet/services/wallet-transaction.service';
import { GroupMembersModule } from './mukai/modules/group-member.module';
import { GroupMemberController } from './mukai/controllers/group_members.controller';
import { GroupMemberService } from './mukai/services/group-members.service';
import { SmileWalletService } from './wallet/services/zb_digital_wallet.service';
import { EmployeesModule } from './smartbiz/payroll/modules/employee.module';
import { EmployeesController } from './smartbiz/payroll/controllers/employee.controller';
import { EmployeesService } from './smartbiz/payroll/services/employee.service';
import { SmartBizPostgresRestHandlerModule } from './common/postgresrest/smart_biz_postgresrest.module';
import { PayslipsController } from './smartbiz/payroll/controllers/payslip.controller';
import { PayslipsModule } from './smartbiz/payroll/modules/payslip.module';
import { PayslipsService } from './smartbiz/payroll/services/payslip.service';
import { FinancialArticle } from './mukai/entities/financial_articles.entity';
import { FinancialArticleController } from './mukai/controllers/financial-articles.controller';
import { FinancialArticleService } from './mukai/services/financial-article.service';
import { SmileCashWalletModule } from './common/zb_smilecash_wallet/modules/smilecash-wallet.module';
import { SmileCashWalletController } from './common/zb_smilecash_wallet/controllers/smilecash-wallet.controller';
import { SmileCashWalletService } from './common/zb_smilecash_wallet/services/smilecash-wallet.service';
import { SmilePayController } from './common/zb_payment_gateway/controllers/smilepay.controller';
import { SmilePayService } from './common/zb_payment_gateway/services/smilepay.service';
import { SmilePayModule } from './common/zb_payment_gateway/modules/smilepay.module';
import { NotifyTextModule } from './messagings/notify-text.module';
// import { PostmanModule } from './postman/postman.module';

@Module({
  imports: [
    // PostgresRestHandlerModule,
    SmartBizPostgresRestHandlerModule,
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    UserModule,
    MessagingsModule,
    NodesModule,
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
    GroupMembersModule,
    SpendingConditionsModule,
    EscrowModule,
    LoanModule,
    CooperativeMemberRequestModule,
    CooperativeMemberApprovalsModule,
    SubscriberModule,
    WalletTransactionModule,
    EmployeesModule,
    PayslipsModule,
    FinancialArticle,
    SmileCashWalletModule,
    SmilePayModule,
    NotifyTextModule,
    // MunicipalitiesModule,
    // PostmanModule,
  ],
  controllers: [
    AppController,
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
    GroupMemberController,
    SpendingConditionsController,
    EscrowController,
    LoanController,
    CooperativeMemberRequestsController,
    CooperativeMemberApprovalsController,
    SubscriberController,
    WalletTransactionController,
    EmployeesController,
    PayslipsController,
    FinancialArticleController,
    SmileCashWalletController,
    SmilePayController,
  ],
  providers: [
    AppService,
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
    GroupMemberService,
    SpendingConditionsService,
    EscrowService,
    LoanService,
    CooperativeMemberRequestsService,
    CooperativeMemberApprovalsService,
    SubscriberService,
    SmileWalletService,
    WalletTransactionService,
    // WalletTransactionService,
    EmployeesService,
    PayslipsService,
    FinancialArticleService,
    //   {
    //   provide: APP_GUARD,
    //   useClass: PostgresRestHandlerGuard,
    // },
    SmileCashWalletService,
    SmilePayService,
  ],
})
export class AppModule {}
