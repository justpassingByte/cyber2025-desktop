import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Branch } from './index';
import { FoodDrink } from './index';

@Entity('inventory')
export class Inventory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  branch_id: number;

  @ManyToOne(() => Branch, branch => branch.inventory)
  branch: Branch;

  @Column({ nullable: true })
  item_name: string;
  
  @Column({ nullable: true })
  food_drink_id: number;
  
  @ManyToOne(() => FoodDrink, foodDrink => foodDrink.inventory)
  foodDrink: FoodDrink;

  @Column()
  quantity: number;

  @Column('float')
  price: number;

  @Column({ default: 'other' })
  item_type: string; // food, drink, accessory, other
  
  @Column({ 
    type: 'datetime', 
    default: () => 'CURRENT_TIMESTAMP', 
    onUpdate: 'CURRENT_TIMESTAMP' 
  })
  last_updated: Date;
} 