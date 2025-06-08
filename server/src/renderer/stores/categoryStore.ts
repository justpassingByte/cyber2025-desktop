import { create } from 'zustand';
const { ipcRenderer } = window.require('electron');

interface CategoryItem {
  id: number;
  name: string;
  description?: string;
  display_order: number;
  image_url?: string;
  status: string; // active, inactive
  created_at: Date;
  updated_at: Date;
}

interface CategoryState {
  categories: CategoryItem[];
  loading: boolean;
  fetchCategories: () => Promise<void>;
  addCategory: (categoryData: any) => Promise<boolean>;
  updateCategory: (id: number, categoryData: any) => Promise<boolean>;
  deleteCategory: (id: number) => Promise<boolean>;
}

export const useCategoryStore = create<CategoryState>((set, get) => ({
  categories: [],
  loading: true,

  fetchCategories: async () => {
    set({ loading: true });
    try {
      const result = await ipcRenderer.invoke('categories:getAll');
      if (result.success && result.categories) {
        set({ categories: result.categories, loading: false });
      } else {
        console.error('Failed to fetch categories:', result.error);
        set({ loading: false });
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      set({ loading: false });
    }
  },

  addCategory: async (categoryData) => {
    try {
      const result = await ipcRenderer.invoke('categories:create', categoryData);
      if (result.success && result.category) {
        set((state) => ({
          categories: [...state.categories, result.category],
        }));
        return true;
      } else {
        console.error('Failed to add category:', result.error);
        return false;
      }
    } catch (error) {
      console.error('Error adding category:', error);
      return false;
    }
  },

  updateCategory: async (id, categoryData) => {
    try {
      const result = await ipcRenderer.invoke('categories:update', id, categoryData);
      if (result.success && result.category) {
        set((state) => ({
          categories: state.categories.map((category) =>
            category.id === id ? result.category : category
          ),
        }));
        return true;
      } else {
        console.error('Failed to update category:', result.error);
        return false;
      }
    } catch (error) {
      console.error('Error updating category:', error);
      return false;
    }
  },

  deleteCategory: async (id) => {
    try {
      const result = await ipcRenderer.invoke('categories:delete', id);
      if (result.success) {
        set((state) => ({
          categories: state.categories.filter((category) => category.id !== id),
        }));
        return true;
      } else {
        console.error('Failed to delete category:', result.error);
        return false;
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      return false;
    }
  },
}));

// Initial fetch when the store is created
useCategoryStore.getState().fetchCategories(); 