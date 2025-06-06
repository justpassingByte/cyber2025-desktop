import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Combo } from './index';
import { FoodDrink } from './index';

@Entity('combo_detail')
export class ComboDetail {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  combo_id: number;

  @Column()
  food_drink_id: number;

  @Column({ default: 1 })
  quantity: number;

  @ManyToOne(() => Combo, combo => combo.comboDetails)
  combo: Combo;

  @ManyToOne(() => FoodDrink, foodDrink => foodDrink.comboDetails)
  foodDrink: FoodDrink;
} 