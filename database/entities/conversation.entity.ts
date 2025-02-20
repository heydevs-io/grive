import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';

@Entity()
export class Conversation extends BaseEntity {
  @Column({ name: 'user_id' })
  userId: string;

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'dify_conversation_id' })
  difyConversationId: string;

  @Column({ name: 'dify_conversation_name' })
  difyConversationName: string;
}
