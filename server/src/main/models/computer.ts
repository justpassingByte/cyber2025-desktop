import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { Branch } from './index';
import { Session } from './index';

@Entity('computers')
export class Computer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  branch_id: number;

  @ManyToOne(() => Branch, branch => branch.computers)
  branch: Branch;

  @Column()
  name: string;

  @Column()
  ip_address: string;

  @Column({ default: 'offline' })
  status: 'online' | 'offline' | 'maintenance';

  @Column('simple-json', { nullable: true })
  specs_json: {
    cpu?: string;
    ram?: string;
    gpu?: string;
    storage?: string;
    os?: string;
  };

  @OneToMany(() => Session, session => session.computer)
  sessions: Session[];
} 