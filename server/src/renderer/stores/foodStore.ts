import { create } from 'zustand';
const { ipcRenderer } = window.require('electron');

interface FoodItem {
  id: number;
  name: string;
  type: string; // "food" or "drink"
  price: number;
  description?: string;
  image_url?: string;
  stock: number;
  status: string; // active, out_of_stock, discontinued
  created_at: Date;
  updated_at: Date;
  menu_category_id: number;
  menuCategory?: { // Optional, fetched via relation
    id: number;
    name: string;
  };
  // Add any other fields that come from the database or are calculated
  cost?: number; // Assuming cost might be in the database too
  sold?: number; // Assuming sold is tracked, might be from transactions
}

interface FoodState {
  foods: FoodItem[];
  loading: boolean;
  fetchFoods: () => Promise<void>;
  addFood: (foodData: any) => Promise<boolean>;
  updateFood: (id: number, foodData: any) => Promise<boolean>;
  deleteFood: (id: number) => Promise<boolean>;
  updateFoodStock: (foodId: number, quantityChange: number) => void; // For real-time updates
}

export const useFoodStore = create<FoodState>((set, get) => ({
  foods: [],
  loading: true,

  fetchFoods: async () => {
    set({ loading: true });
    try {
      const result = await ipcRenderer.invoke('foods:getAll');
      if (result.success && result.foods) {
        // Map backend data to frontend format, assuming sold/cost are not directly from DB for now
        const foodsWithCalculatedProps = result.foods.map((food: any) => ({
          ...food,
          cost: food.cost || 0, // Placeholder, adjust if DB has it
          sold: food.sold || 0, // Placeholder, adjust if DB has it
          // Map menuCategory if it exists in the backend response
          menuCategory: food.menuCategory ? { id: food.menuCategory.id, name: food.menuCategory.name } : undefined,
        }));
        set({ foods: foodsWithCalculatedProps, loading: false });
      } else {
        console.error('Failed to fetch foods:', result.error);
        set({ loading: false });
      }
    } catch (error) {
      console.error('Error fetching foods:', error);
      set({ loading: false });
    }
  },

  addFood: async (foodData) => {
    try {
      const result = await ipcRenderer.invoke('foods:create', foodData);
      if (result.success && result.food) {
        set((state) => ({
          foods: [...state.foods, {
            ...result.food,
            cost: result.food.cost || 0,
            sold: result.food.sold || 0,
            menuCategory: result.food.menuCategory ? { id: result.food.menuCategory.id, name: result.food.menuCategory.name } : undefined,
          }],
        }));
        return true;
      } else {
        console.error('Failed to add food:', result.error);
        return false;
      }
    } catch (error) {
      console.error('Error adding food:', error);
      return false;
    }
  },

  updateFood: async (id, foodData) => {
    try {
      const result = await ipcRenderer.invoke('foods:update', id, foodData);
      if (result.success && result.food) {
        set((state) => ({
          foods: state.foods.map((food) =>
            food.id === id ? { 
              ...result.food,
              cost: result.food.cost || 0,
              sold: result.food.sold || 0,
              menuCategory: result.food.menuCategory ? { id: result.food.menuCategory.id, name: result.food.menuCategory.name } : undefined,
            } : food
          ),
        }));
        return true;
      } else {
        console.error('Failed to update food:', result.error);
        return false;
      }
    } catch (error) {
      console.error('Error updating food:', error);
      return false;
    }
  },

  deleteFood: async (id) => {
    try {
      const result = await ipcRenderer.invoke('foods:delete', id);
      if (result.success) {
        set((state) => ({
          foods: state.foods.filter((food) => food.id !== id),
        }));
        return true;
      } else {
        console.error('Failed to delete food:', result.error);
        return false;
      }
    } catch (error) {
      console.error('Error deleting food:', error);
      return false;
    }
  },

  updateFoodStock: (foodId, quantityChange) => {
    set((state) => ({
      foods: state.foods.map((food) =>
        food.id === foodId
          ? { ...food, stock: food.stock - quantityChange, sold: (food.sold || 0) + quantityChange }
          : food
      ),
    }));
  },
}));

// Initial fetch when the store is created
useFoodStore.getState().fetchFoods();

// Listen for real-time stock updates from the main process
ipcRenderer.on('food:stock-updated', (_event: any, data: { foodId: number, quantityChange: number }) => {
  console.log('[FoodStore] Received real-time stock update:', data);
  useFoodStore.getState().updateFoodStock(data.foodId, data.quantityChange);
}); 