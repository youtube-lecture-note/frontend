import { create } from "zustand";
import {
  getCategory,
  addCategory,
  deleteCategory,
  deleteCategoryVideo,
} from "../api/category";

const useCategoryStore = create((set, get) => ({
  // 상태
  categories: [],
  selectedCategory: null,
  isLoading: false,
  error: null,

  // 액션
  fetchCategories: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await getCategory();
      set({ categories: data || [], isLoading: false });
      return data;
    } catch (error) {
      console.error("카테고리를 불러오는데 실패했습니다:", error);
      set({ error: error.message, isLoading: false });
      return [];
    }
  },

  addCategory: async (category) => {
    set({ isLoading: true, error: null });
    try {
      // 이름 중복 검사
      const isDuplicate = get().findCategoryByName(category.name);
      if (isDuplicate) {
        set({
          isLoading: false,
          error: `이미 존재하는 주제 이름입니다: "${category.name}"`,
        });
        throw new Error(`이미 존재하는 주제 이름입니다: "${category.name}"`);
      }

      const newCategory = await addCategory(category);
      // 카테고리 추가 후 전체 목록 다시 불러오기
      await get().fetchCategories();
      return newCategory;
    } catch (error) {
      console.error("카테고리 추가에 실패했습니다:", error);
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  deleteCategory: async (categoryId) => {
    set({ isLoading: true, error: null });
    try {
      await deleteCategory(categoryId);
      // 카테고리 삭제 후 전체 목록 다시 불러오기
      await get().fetchCategories();
    } catch (error) {
      console.error("카테고리 삭제에 실패했습니다:", error);
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  deleteCategoryVideo: async (categoryId, videoId) => {
    set({ isLoading: true, error: null });
    try {
      await deleteCategoryVideo(categoryId, videoId);
      // 비디오 삭제 후 전체 목록 다시 불러오기
      await get().fetchCategories();
    } catch (error) {
      console.error("카테고리 비디오 삭제에 실패했습니다:", error);
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  // 카테고리 선택 상태 관리
  selectCategory: (categoryId) => {
    const category = get().findCategoryById(categoryId);
    set({ selectedCategory: category });
  },

  // 유틸리티 함수
  findCategoryById: (categoryId, categories = get().categories) => {
    const findInCategories = (cats) => {
      for (const cat of cats) {
        if (cat.id === categoryId) return cat;
        if (cat.children?.length > 0) {
          const found = findInCategories(cat.children);
          if (found) return found;
        }
      }
      return null;
    };

    return findInCategories(categories);
  },

  // 이름으로 카테고리 찾기 (중복 검사용)
  findCategoryByName: (name, categories = get().categories) => {
    const searchName = name.trim().toLowerCase();

    const findInCategories = (cats) => {
      for (const cat of cats) {
        if (cat.name.trim().toLowerCase() === searchName) return cat;
        if (cat.children?.length > 0) {
          const found = findInCategories(cat.children);
          if (found) return found;
        }
      }
      return null;
    };

    return findInCategories(categories);
  },
}));

export default useCategoryStore;
