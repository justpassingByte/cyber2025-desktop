import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
@Entity('logs')
export class Log {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  entity_type: string;

  @Column({ nullable: true })
  entity_id: number;

  @Column()
  action: string;

  @Column('simple-json', { nullable: true })
  details_json: Record<string, any>;

  @Column({ nullable: true })
  user_id: number;

  @Column({ nullable: true })
  ip_address: string;

  @CreateDateColumn()
  timestamp: Date;

  @Column({ nullable: true })
  branch_id: number;
} 