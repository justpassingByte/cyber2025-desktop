import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { MenuCategory } from './index';
import { Inventory } from './index';
import { ComboDetail } from './index';

@Entity('food_drink')
export class FoodDrink {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  type: string; // "food" or "drink"

  @Column('float')
  price: number;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  image_url: string;

  @Column({ type: 'float', nullable: true })
  cost: number;

  @Column({ default: 0 })
  stock: number;

  @Column({ default: 'active' })
  status: string; // active, out_of_stock, discontinued

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ 
    type: 'datetime', 
    default: () => 'CURRENT_TIMESTAMP', 
    onUpdate: 'CURRENT_TIMESTAMP' 
  })
  updated_at: Date;
  
  @Column()
  menu_category_id: number;

  @ManyToOne(() => MenuCategory, menuCategory => menuCategory.foodDrinks)
  menuCategory: MenuCategory;

  @OneToMany(() => Inventory, inventory => inventory.foodDrink)
  inventory: Inventory[];

  @OneToMany(() => ComboDetail, comboDetail => comboDetail.foodDrink)
  comboDetails: ComboDetail[];
} 