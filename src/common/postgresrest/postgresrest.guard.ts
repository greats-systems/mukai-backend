import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class PostgresRestHandlerGuard extends AuthGuard('jwt') {}
