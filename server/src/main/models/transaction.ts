import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne } from 'typeorm';
import { Customer } from './index';
import { Session } from './index';

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Customer, customer => customer.transactions)
  customer: Customer;

  @Column()
  customer_id: number;

  @ManyToOne(() => Session, session => session.transactions, { nullable: true })
  session: Session;

  @Column({ nullable: true })
  session_id: number;

  @Column()
  amount: number;

  @Column()
  type: 'topup' | 'purchase' | 'withdraw';

  @Column()
  status: 'pending' | 'completed' | 'failed';

  @Column({ nullable: true })
  payment_method: string;

  @Column({ nullable: true })
  description: string;

  @CreateDateColumn()
  created_at: Date;
}

export interface TopUpNotification {
  username: string;
  amount: number;
  message: string;
} 