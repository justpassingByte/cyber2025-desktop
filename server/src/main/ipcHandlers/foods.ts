import { ipcMain } from 'electron';
import database from '../services/database';
import { FoodDrink, MenuCategory } from '../models';

export function registerFoodHandlers() {
  // IPC for FoodDrink
  ipcMain.handle('foods:getAll', async () => {
    try {
      const foodDrinkRepo = database.getRepository(FoodDrink);
      const foods = await foodDrinkRepo.find({ relations: ['menuCategory'] });
      return { success: true, foods };
    } catch (error) {
      console.error('Error fetching all food items:', error);
      return { success: false, error: 'Không thể lấy danh sách đồ ăn' };
    }
  });

  ipcMain.handle('foods:create', async (event, foodData) => {
    try {
      const foodDrinkRepo = database.getRepository(FoodDrink);
      const food = foodDrinkRepo.create(foodData);
      const savedFood = await foodDrinkRepo.save(food);
      return { success: true, food: savedFood };
    } catch (error) {
      console.error('Error creating food item:', error);
      return { success: false, error: 'Không thể tạo đồ ăn mới' };
    }
  });

  ipcMain.handle('foods:update', async (event, id, foodData) => {
    try {
      const foodDrinkRepo = database.getRepository(FoodDrink);
      await foodDrinkRepo.update(id, foodData);
      const updatedFood = await foodDrinkRepo.findOne({ where: { id } });
      return { success: true, food: updatedFood };
    } catch (error) {
      console.error('Error updating food item:', error);
      return { success: false, error: 'Không thể cập nhật đồ ăn' };
    }
  });

  ipcMain.handle('foods:delete', async (event, id) => {
    try {
      const foodDrinkRepo = database.getRepository(FoodDrink);
      await foodDrinkRepo.delete(id);
      return { success: true };
    } catch (error) {
      console.error('Error deleting food item:', error);
      return { success: false, error: 'Không thể xóa đồ ăn' };
    }
  });

  // IPC for MenuCategory
  ipcMain.handle('categories:getAll', async () => {
    try {
      const menuCategoryRepo = database.getRepository(MenuCategory);
      const categories = await menuCategoryRepo.find();
      return { success: true, categories };
    } catch (error) {
      console.error('Error fetching all categories:', error);
      return { success: false, error: 'Không thể lấy danh sách danh mục' };
    }
  });

  ipcMain.handle('categories:create', async (event, categoryData) => {
    try {
      const menuCategoryRepo = database.getRepository(MenuCategory);
      const category = menuCategoryRepo.create(categoryData);
      const savedCategory = await menuCategoryRepo.save(category);
      return { success: true, category: savedCategory };
    } catch (error) {
      console.error('Error creating category:', error);
      return { success: false, error: 'Không thể tạo danh mục mới' };
    }
  });

  ipcMain.handle('categories:update', async (event, id, categoryData) => {
    try {
      const menuCategoryRepo = database.getRepository(MenuCategory);
      await menuCategoryRepo.update(id, categoryData);
      const updatedCategory = await menuCategoryRepo.findOne({ where: { id } });
      return { success: true, category: updatedCategory };
    } catch (error) {
      console.error('Error updating category:', error);
      return { success: false, error: 'Không thể cập nhật danh mục' };
    }
  });

  ipcMain.handle('categories:delete', async (event, id) => {
    try {
      const menuCategoryRepo = database.getRepository(MenuCategory);
      await menuCategoryRepo.delete(id);
      return { success: true };
    } catch (error) {
      console.error('Error deleting category:', error);
      return { success: false, error: 'Không thể xóa danh mục' };
    }
  });

  // IPC for placing food orders
  ipcMain.handle('foods:place-order', async (event, orderData) => {
    try {
      // In a real application, you would save this order to the database
      // and perform any necessary business logic (e.g., updating stock).
      console.log('Food order placed:', orderData);

      // Emit an event to the renderer process (admin client) to show a notification
      event.sender.send('admin:food-order-placed', orderData);

      return { success: true, message: 'Đơn hàng đã được đặt thành công!' };
    } catch (error) {
      console.error('Error placing food order:', error);
      return { success: false, error: 'Không thể đặt đồ ăn' };
    }
  });
} 