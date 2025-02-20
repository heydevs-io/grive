import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { BusinessProfile } from './business-profile.entity';
import { AssetType } from '@enums';
@Entity()
export class Asset extends BaseEntity {
  @Column()
  businessId: string;

  @JoinColumn({ name: 'business_id' })
  @ManyToOne(() => BusinessProfile)
  business: BusinessProfile;

  @Column()
  name: string;

  @Column()
  value: number;

  @Column({ type: 'enum', enum: AssetType })
  type: AssetType;
}
