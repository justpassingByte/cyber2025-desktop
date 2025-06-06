import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { Customer } from './index';
import { Transaction } from './index';
import { Computer } from './index';

@Entity('sessions')
export class Session {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Computer, (computer: Computer) => computer.sessions)
  computer: Computer;

  @Column()
  computer_id: number;

  @ManyToOne(() => Customer, (customer: Customer) => customer.sessions)
  customer: Customer;

  @Column()
  customer_id: number;

  @Column()
  start_time: Date;

  @Column({ nullable: true })
  end_time: Date;

  @Column({ default: 'active' })
  status: 'pending' | 'active' | 'completed' | 'cancelled';

  @OneToMany(() => Transaction, (transaction: Transaction) => transaction.session)
  transactions: Transaction[];
} 