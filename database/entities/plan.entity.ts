import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { BusinessProfile } from './business-profile.entity';
@Entity()
export class Plan extends BaseEntity {
  @Column()
  businessId: string;

  @JoinColumn({ name: 'business_id' })
  @ManyToOne(() => BusinessProfile)
  business: BusinessProfile;

  @Column({ nullable: true })
  name: string;

  @Column({ type: 'timestamptz' })
  startDate: Date;

  @Column()
  reverseDuration: number;

  @Column({ nullable: true })
  monthlyRevenue: number;

  @Column({ nullable: true })
  operatingCost: number;

  @Column({ nullable: true })
  taxRate: number;

  @Column({ nullable: true })
  creditAccess: number;

  @Column({ nullable: true })
  monthlyPersonalExpense: number;

  @Column({ nullable: true })
  personalExpenseReserveDuration: number;
}
