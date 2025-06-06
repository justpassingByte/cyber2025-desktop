import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { FoodDrink } from './index';
import { Combo } from './index';

@Entity('menu_category')
export class MenuCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: 0 })
  display_order: number;

  @Column({ nullable: true })
  image_url: string;

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

  @OneToMany(() => FoodDrink, foodDrink => foodDrink.menuCategory)
  foodDrinks: FoodDrink[];

  @OneToMany(() => Combo, combo => combo.menuCategory)
  combos: Combo[];
} 