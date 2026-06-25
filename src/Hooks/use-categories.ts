import { useState, useEffect, useCallback } from "react";
import { supabase } from "../Lib/supabase";
import type { Category } from "../Types/category";

// Hooks
export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all categories for logged-in user, sorted alphabetically
  const fetchCategories = useCallback(async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("name");

    if (error) {
      console.error("Failed to fetch categories:", error.message);
    }
    // Fallback option to empty array for if data is null or something unexpected happen
    setCategories(data || []);
    setLoading(false);
  }, []);

  // Create a new category using user's ID
  const createCategory = async (name: string) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from("categories")
      .insert({ name, user_id: user.id });

    if (error) {
      console.error("Failed to create category:", error.message);
      return;
    }

    // Re-fetch to keep local state in sync with the database
    await fetchCategories();
  };

  // Renaming a category
  const updateCategory = async (id: string, name: string) => {
    const { error } = await supabase
      .from("categories")
      .update({ name })
      .eq("id", id);

    if (error) {
      console.error("Failed to update category:", error.message);
      return;
    }

    await fetchCategories();
  };

  // Delete a category
  const deleteCategory = async (id: string) => {
    const { error } = await supabase.from("categories").delete().eq("id", id);

    if (error) {
      console.error("Failed to delete category:", error.message);
      return;
    }

    await fetchCategories();
  };

  // Seeding the four default categories for a new user after signup
  const seedDefaults = async (userId: string) => {
    const defaults = ["Work", "Learning", "Personal", "Business"];

    const rows = defaults.map((name) => ({
      name,
      user_id: userId,
    }));

    const { error } = await supabase.from("categories").insert(rows);

    if (error) {
      console.error("Failed to seed default categories:", error.message);
      return;
    }

    await fetchCategories();
  };

  useEffect(() => {
    let isMounted = true;

    const loadInitialData = async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name");

      // If the component unmounted while we were waiting, don't set state
      if (!isMounted) return;

      if (error) {
        console.error("Failed to fetch categories:", error.message);
      }

      setCategories(data || []);
      setLoading(false);
    };

    loadInitialData();

    // Cleanup: called when the component unmounts
    return () => {
      isMounted = false;
    };
  }, []);

  return {
    categories,
    loading,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    seedDefaults,
  };
};
