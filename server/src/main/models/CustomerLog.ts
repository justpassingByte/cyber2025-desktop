import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

@Entity('customer_logs')
export class CustomerLog {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  @Index()
  timestamp: Date;

  @Column()
  @Index()
  customer_id: number;

  @Column()
  @Index()
  action: string;  // login, topup, order, etc.

  @Column('json', { nullable: true })
  details: any;

  @Column({ nullable: true })
  ip_address: string;

  @Column({ nullable: true })
  @Index()
  computer_id: number;

  @Column({ nullable: true })
  @Index()
  session_id: number;

  @Column({ nullable: true })
  @Index()
  branch_id: number;

  @Column({ nullable: true })
  @Index()
  staff_id: number;
} 