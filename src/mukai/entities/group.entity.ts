import { SignupDto } from 'src/auth/dto/signup.dto';

export class Group {
  id: string;
  admin_id: string;
  name: string;
  city: string;
  country: string;
  monthly_sub: number;
  members: SignupDto[];
}
