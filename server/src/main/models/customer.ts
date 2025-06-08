import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToMany } from 'typeorm';
import { Transaction } from './index';
import { Session } from './index';

@Entity('customers')
export class Customer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column()
  password_hash: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  email: string;

  @Column({ default: 0 })
  points: number;

  @Column({ default: 0 })
  balance: number;

  @Column({ default: 0 })
  time_remaining: number;

  @CreateDateColumn()
  created_at: Date;
  
  @Column({ default: 'inactive' })
  status: string;
  
  @Column({ nullable: true })
  last_seen: Date;
  
  @Column({ nullable: true })
  address: string;
  
  @Column({ nullable: true })
  dob: string;
  
  @Column({ nullable: true })
  avatar_url: string;

  @OneToMany(() => Transaction, transaction => transaction.customer)
  transactions: Transaction[];

  @OneToMany(() => Session, session => session.customer)
  sessions: Session[];
} 