import { BusinessFocus, BusinessType } from '@enums';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';

@Entity()
export class BusinessProfile extends BaseEntity {
  @Column('uuid')
  userId: string;

  @JoinColumn({ name: 'user_id' })
  @OneToOne(() => User, (user) => user.id)
  user: User;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  website?: string;

  @Column({ type: 'timestamptz', nullable: true })
  foundedDate?: Date;

  @Column({ type: 'varchar', nullable: true })
  monthlyRevenueAvg?: string;

  @Column({ type: 'enum', enum: BusinessType, nullable: true })
  businessType?: BusinessType;

  @Column({ nullable: true })
  businessTypeOther?: string;

  @Column({ nullable: true })
  industryTitle?: string;

  @Column({ nullable: true })
  industrySIC?: string;

  @Column({ nullable: true })
  specificService?: string;

  @Column({ nullable: true, type: 'enum', enum: BusinessFocus, array: true })
  focus?: BusinessFocus[];

  @Column({ nullable: true, default: false })
  onboardingComplete: boolean;
}
