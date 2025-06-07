import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Computer } from './index';
import { Staff } from './index';
import { Inventory } from './index';

@Entity('branches')
export class Branch {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  address: string;

  @Column({ default: 'active' })
  status: 'active' | 'inactive' | 'maintenance';

  @Column('simple-json', { nullable: true })
  config_json: Record<string, any>;

  @OneToMany(() => Computer, (computer: Computer) => computer.branch)
  computers: Computer[];

  @OneToMany(() => Staff, (staff: Staff) => staff.branch)
  staff: Staff[];

  @OneToMany(() => Inventory, (inventory: Inventory) => inventory.branch)
  inventory: Inventory[];
} 