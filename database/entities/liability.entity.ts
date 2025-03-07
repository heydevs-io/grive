import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { LiabilityType } from '@enums';
import { BaseEntity } from './base.entity';
import { BusinessProfile } from './business-profile.entity';

@Entity()
export class Liability extends BaseEntity {
  @Column()
  businessId: string;

  @JoinColumn({ name: 'business_id' })
  @ManyToOne(() => BusinessProfile)
  business: BusinessProfile;

  @Column()
  name: string;

  @Column()
  value: number;

  @Column({ type: 'enum', enum: LiabilityType })
  type: LiabilityType;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  interestRate: number;

  @Column({ type: 'timestamptz' })
  dueDate: Date;
}
