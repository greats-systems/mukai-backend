import { Module } from '@nestjs/common';
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
import { GroupModule } from './mukai/modules/group.module';
import { SpendingConditionsModule } from './mukai/modules/spending-conditions.module';
import { EscrowModule } from './mukai/modules/escrow.module';
import { LoanModule } from './mukai/modules/loan.module';
import { CooperativeMemberApprovalsModule } from './mukai/modules/cooperative-member-approvals.module';
import { SubscriberModule } from './wallet/modules/subscriber.module';
import { WalletTransactionModule } from './wallet/modules/wallet-transaction.module';
import { GroupMembersModule } from './mukai/modules/group-member.module';
import { EmployeesModule } from './smartbiz/payroll/modules/employee.module';
import { SmartBizPostgresRestHandlerModule } from './common/postgresrest/smart_biz_postgresrest.module';
import { PayslipsModule } from './smartbiz/payroll/modules/payslip.module';
import { FinancialArticle } from './mukai/entities/financial_articles.entity';
import { SmileCashWalletModule } from './common/zb_smilecash_wallet/modules/smilecash-wallet.module';
import { SmilePayModule } from './common/zb_payment_gateway/modules/smilepay.module';
import { NotifyTextModule } from './messagings/notify-text.module';
// import { PostmanModule } from './postman/postman.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    // PostgresRestHandlerModule,
    SmartBizPostgresRestHandlerModule,
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    ScheduleModule.forRoot(),
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
  ],
})
export class AppModule {}
