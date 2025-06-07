import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Branch } from './index';

@Entity('staff')
export class Staff {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  branch_id: number;

  @ManyToOne(() => Branch, branch => branch.staff)
  branch: Branch;

  @Column()
  user_id: number;

  @Column()
  role: string;

  @Column('simple-json', { nullable: true })
  schedule_json: Record<string, any>;
} 