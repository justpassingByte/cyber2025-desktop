import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

@Entity('system_logs')
export class SystemLog {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  @Index()
  timestamp: Date;

  @Column({
    type: 'enum',
    enum: ['info', 'warning', 'error', 'critical'],
    default: 'info'
  })
  @Index()
  level: string;

  @Column()
  @Index()
  category: string;  // app, database, security, etc.

  @Column()
  message: string;

  @Column('json', { nullable: true })
  details: any;

  @Column({ nullable: true })
  ip_address: string;

  @Column({ nullable: true })
  @Index()
  branch_id: number;

  @Column({ nullable: true })
  @Index()
  staff_id: number;
} 