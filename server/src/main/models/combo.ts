import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { MenuCategory } from './index';
import { ComboDetail } from './index';

@Entity('combo')
export class Combo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column('float')
  price: number;

  @Column({ nullable: true })
  image_url: string;

  @Column({ default: 0 })
  game_time_minutes: number;

  @Column()
  menu_category_id: number;

  @Column('float', { default: 0 })
  discount_percentage: number;

  @Column({ default: 'active' })
  status: string; // active, inactive

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP'
  })
  updated_at: Date;

  @ManyToOne(() => MenuCategory, menuCategory => menuCategory.combos)
  menuCategory: MenuCategory;

  @OneToMany(() => ComboDetail, comboDetail => comboDetail.combo)
  comboDetails: ComboDetail[];
} 