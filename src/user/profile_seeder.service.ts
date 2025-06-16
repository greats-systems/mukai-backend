/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, Logger } from '@nestjs/common';
import { PostgresRest } from 'src/common/postgresrest';
import { v4 as uuidv4 } from 'uuid';
import { Profile } from './entities/user.entity';

@Injectable()
export class ProfileSeeder {
  private readonly logger = new Logger(ProfileSeeder.name);

  constructor(private readonly postgresrest: PostgresRest) {}

  async seedProfiles(): Promise<void> {
    try {
      this.logger.log('Starting profile seeding...');

      const profiles = this.generateMockProfiles(10);

      const { error } = await this.postgresrest
        .from('profiles')
        .insert(profiles);

      if (error) {
        throw new Error(`Failed to seed profiles: ${error.message}`);
      }

      this.logger.log('Successfully seeded 10 profiles');
    } catch (error) {
      this.logger.error('Profile seeding failed', error.stack);
      throw error;
    }
  }

  private generateMockProfiles(count: number): Profile[] {
    const mockProfiles: Profile[] = [];
    for (let i = 0; i < count; i++) {
      const profile: Profile = {
        id: uuidv4(),
        auth_user_id: `auth_user_${i + 1}`,
        created_at: new Date().toISOString(),
        first_name: `User${i + 1}`,
        last_name: `Lastname${i + 1}`,
        email: `user${i + 1}@example.com`,
        phone: `+1${Math.floor(1000000000 + Math.random() * 9000000000)}`,
        gender: i % 2 === 0 ? 'Male' : 'Female',
        d_o_b: `${1980 + Math.floor(Math.random() * 20)}-${1 + Math.floor(Math.random() * 11)}-${1 + Math.floor(Math.random() * 28)}`,
        self_description: `Description for User${i + 1}`,
        profile_image_url: `https://example.com/profile_images/user${i + 1}.jpg`,
        is_verified: Math.random() > 0.3,
        street_address: `${i + 1} Mock Street`,
        neighbourhood: `Neighbourhood ${(i % 3) + 1}`,
        city: 'Unknown',
        country: 'Unknown',
        province: 'Province/State',
        account_status: 'active',
        wallet_address: `0x${Math.random().toString(16).substr(2, 40)}`,
        online_status: Math.random() > 0.5,
        abilities: ['Programming', 'Design', 'Marketing', 'Sales'][
          Math.floor(Math.random() * 4)
        ],
        department: ['IT', 'HR', 'Finance', 'Operations'][
          Math.floor(Math.random() * 4)
        ],
        role: ['Developer', 'Manager', 'Analyst', 'Director'][
          Math.floor(Math.random() * 4)
        ],
        account_type: ['Personal', 'Business'][Math.floor(Math.random() * 2)],
        specialization: ['Web Development', 'Data Science', 'UX Design'][
          Math.floor(Math.random() * 3)
        ],
        trading_as: i % 3 === 0 ? `Company ${i + 1}` : null,
        is_subscribed: Math.random() > 0.7,
        is_premium_subscribed: Math.random() > 0.9,
        community_role: ['Member', 'Moderator', 'Admin'][
          Math.floor(Math.random() * 3)
        ],
        national_id: `national_id_${i + 1}`,
        marital_status: ['Single', 'Married', 'Divorced'][
          Math.floor(Math.random() * 3)
        ],
        country_of_birth: 'Unknown',
        avatar: `https://example.com/avatars/avatar${i + 1}.png`,
        wallet_balance: Math.floor(Math.random() * 10000),
        profile_image: `https://example.com/profile_images/user${i + 1}.jpg`,
        ward: `Ward ${i + 1}`,
        maiden_surname: `Maiden Surname ${i + 1}`,
        national_id_url: `https://example.com/national_id/user${i + 1}.jpg`,
        passport_url: `https://example.com/passport/user${i + 1}.jpg`,
        province_state: 'Province/State',
        push_token: `push_token${i + 1}`,
        tenant_id: `tenant_${i + 1}`,
        main_business_uid: `business_uid_${i + 1}`,
      };
      mockProfiles.push(profile);
    }
    return mockProfiles;
  }
}
