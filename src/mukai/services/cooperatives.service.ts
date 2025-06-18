/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import { Logger, Injectable } from '@nestjs/common';
import { ErrorResponseDto } from 'src/common/dto/error-response.dto';
import { PostgresRest } from 'src/common/postgresrest';
import { CreateCooperativeDto } from '../dto/create/create-cooperative.dto';
import { UpdateCooperativeDto } from '../dto/update/update-cooperative.dto';
import { Cooperative } from '../entities/cooperative.entity';
import { GroupMemberService } from './group-members.service';
import { CreateGroupMemberDto } from '../dto/create/create-group-members.dto';
import { WalletsService } from './wallets.service';
import { CooperativeMemberRequestsService } from './cooperative_member_requests.service';
import { CreateCooperativeMemberRequestDto } from '../dto/create/create-cooperative-member-request.dto';
import { CreateTransactionDto } from '../dto/create/create-transaction.dto';
import { CreateWalletDto } from '../dto/create/create-wallet.dto';
import { TransactionsService } from './transactions.service';

function initLogger(funcname: Function): Logger {
  return new Logger(funcname.name);
}

@Injectable()
export class CooperativesService {
  private readonly logger = initLogger(CooperativesService);
  constructor(private readonly postgresrest: PostgresRest) {}
  /*
  async createCooperative(
    createCooperativeDto: CreateCooperativeDto,
  ): Promise<Cooperative | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from('cooperatives')
        .insert(createCooperativeDto)
        .single();
      if (error) {
        console.log(error);
        return new ErrorResponseDto(400, error.message);
      }
      return data as Cooperative;
    } catch (error) {
      return new ErrorResponseDto(500, error);
    }
  }
  */

  async createCooperative(
    createCooperativeDto: CreateCooperativeDto,
  ): Promise<Cooperative | ErrorResponseDto> {
    try {
      const groupMembersService = new GroupMemberService(this.postgresrest);
      const createGroupMemberDto = new CreateGroupMemberDto();
      const walletsService = new WalletsService(this.postgresrest);
      const cooperativeMemberRequestsService =
        new CooperativeMemberRequestsService(this.postgresrest);
      const transactionsService = new TransactionsService(this.postgresrest);
      const createTransactionDto = new CreateTransactionDto();
      const createWalletDto = new CreateWalletDto();
      const cooperativeMemberRequestDto =
        new CreateCooperativeMemberRequestDto();
      const { data: createCooperativeResponse, error } = await this.postgresrest
        .from('cooperative')
        .insert(createCooperativeDto)
        .select()
        .single();
      if (error) {
        console.log(error);
        return new ErrorResponseDto(400, error.message);
      }

      console.log(`createCooperativeResponse\n${createCooperativeResponse}`);

      for (const member of createCooperativeDto.members) {
        createGroupMemberDto.cooperative_id = createCooperativeResponse['id'];
        createGroupMemberDto.member_id = member;
        const response =
          await groupMembersService.createGroupMember(createGroupMemberDto);
        console.log(response);
      }

      const walletIDs: string[] = [];
      for (const member of createCooperativeDto.members || []) {
        const cooperativeMemberWalletsJson =
          await walletsService.viewProfileWalletID(member);
        if (cooperativeMemberWalletsJson instanceof ErrorResponseDto) {
          return cooperativeMemberWalletsJson; // Return the error if wallet lookup failed
        }
        walletIDs.push(cooperativeMemberWalletsJson['id'] ?? '');
      }

      createWalletDto.profile_id = createCooperativeDto.admin_id;
      createWalletDto.balance = 100;
      createWalletDto.default_currency = 'usd';
      createWalletDto.is_group_wallet = true;
      createWalletDto.group_id = createCooperativeDto.id;
      createWalletDto.children_wallets = walletIDs;
      const walletResponse = await walletsService.createWallet(createWalletDto);
      createTransactionDto.sending_wallet = walletResponse['id'];
      createTransactionDto.receiving_wallet = walletResponse['id'];
      createTransactionDto.amount = createWalletDto.balance;
      createTransactionDto.transaction_type = 'deposit';
      createTransactionDto.narrative = 'credit';
      const transactionResponse =
        await transactionsService.createTransaction(createTransactionDto);
      console.log(transactionResponse);

      for (const member of createCooperativeDto.members || []) {
        cooperativeMemberRequestDto.status = 'in a cooperative';
        cooperativeMemberRequestDto.group_id =
          createGroupMemberDto.cooperative_id;
        const updateMemberResponse =
          await cooperativeMemberRequestsService.updateCooperativeMemberRequestByMemberID(
            member,
            cooperativeMemberRequestDto,
          );
        console.log(updateMemberResponse);
        console.log('\n');
        /*
          const updateMemberResponse = await this.postgresrest
            .from('cooperative_member_requests')
            .update(cooperativeMemberRequestDto)
            .eq('member_id', createCooperativeDto.members![i]['id'])
            .select()
            .single();
            */
      }
      console.log(walletResponse);

      return createCooperativeResponse as Cooperative;
    } catch (error) {
      return new ErrorResponseDto(500, error);
    }
  }

  async findAllCooperatives(): Promise<Cooperative[] | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from('cooperatives')
        .select();

      if (error) {
        this.logger.error('Error fetching Cooperatives', error);
        return new ErrorResponseDto(400, error.message);
      }

      return data as Cooperative[];
    } catch (error) {
      this.logger.error('Exception in findAllCooperatives', error);
      return new ErrorResponseDto(500, error);
    }
  }

  async viewCooperative(id: string): Promise<Cooperative | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from('cooperatives')
        .select()
        .eq('id', id)
        .single();

      if (error) {
        this.logger.error(`Error fetching Cooperative ${id}`, error);
        return new ErrorResponseDto(400, error.message);
      }

      if (!data) {
        return new ErrorResponseDto(404, `Cooperative with id ${id} not found`);
      }

      return data as Cooperative;
    } catch (error) {
      this.logger.error(`Exception in viewCooperative for id ${id}`, error);
      return new ErrorResponseDto(500, error);
    }
  }

  async updateCooperative(
    id: string,
    updateCooperativeDto: UpdateCooperativeDto,
  ): Promise<Cooperative | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from('cooperatives')
        .update(updateCooperativeDto)
        .eq('id', id)
        .select()
        .single();
      if (error) {
        this.logger.error(`Error updating Cooperatives ${id}`, error);
        return new ErrorResponseDto(400, error.message);
      }
      return data as Cooperative;
    } catch (error) {
      this.logger.error(`Exception in updateCooperative for id ${id}`, error);
      return new ErrorResponseDto(500, error);
    }
  }

  async deleteCooperative(id: string): Promise<boolean | ErrorResponseDto> {
    try {
      const { error } = await this.postgresrest
        .from('cooperatives')
        .delete()
        .eq('id', id)
        .single();

      if (error) {
        this.logger.error(`Error deleting Cooperative ${id}`, error);
        return new ErrorResponseDto(400, error.message);
      }

      return true;
    } catch (error) {
      this.logger.error(`Exception in deleteCooperative for id ${id}`, error);
      return new ErrorResponseDto(500, error);
    }
  }
}
