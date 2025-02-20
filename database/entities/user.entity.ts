import { Column, Entity, OneToMany, OneToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { UserStatus } from '@enums';
import { BusinessProfile } from './business-profile.entity';
import { Plan } from './plan.entity';

@Entity()
export class User extends BaseEntity {
  @Column({ nullable: true })
  name?: string;

  @Column()
  email: string;

  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.INACTIVE })
  status: UserStatus;

  @OneToOne(() => BusinessProfile, (businessProfile) => businessProfile.user)
  businessProfile: BusinessProfile;

  @Column({ nullable: true })
  avatar?: string;

  @OneToMany(() => Plan, (plan) => plan.user)
  plans: Plan[];
}
