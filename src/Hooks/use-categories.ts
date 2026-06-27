import { useState, useEffect } from "react";
import { supabase } from "../Lib/supabase";
import type { Category } from "../Types/category";

// Hook that manages all category operations
// Used by: FilterSidebar (to list categories), ResourceForm (to populate dropdown)
// Pattern: fetch on mount, re-fetch after every mutation to stay in sync with the database

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Reusable fetch — called after create, update, delete
  // This is NOT the initial load. It's called by user-triggered actions,
  // so calling setLoading here is fine (not inside a useEffect).
  const fetchCategories = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("name");

    if (error) {
      console.error("Failed to fetch categories:", error.message);
    }

    setCategories(data || []);
    setLoading(false);
  };

  // Create a new category
  // We need the user's ID because every category belongs to a specific user
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

    await fetchCategories();
  };

  // Rename a category
  // .eq('id', id) is the WHERE clause — without it, every row would update
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
  // Resources in this category won't be deleted — they'll just lose their
  // category reference (category_id becomes null) because of ON DELETE SET NULL
  const deleteCategory = async (id: string) => {
    const { error } = await supabase.from("categories").delete().eq("id", id);

    if (error) {
      console.error("Failed to delete category:", error.message);
      return;
    }

    await fetchCategories();
  };

  // Seed the four default categories for a new user after signup
  // Called once from the auth context, not from individual components
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

  // ─── CHANGED: Initial load on mount ───
  // Previously this called fetchCategories() directly inside useEffect,
  // which triggered ESLint's set-state-in-effect rule because fetchCategories
  // calls setLoading(true) synchronously when the effect runs.
  //
  // Fix: define an async function INSIDE the effect that does the initial fetch.
  // loading already starts as true (from useState above), so we don't set it here.
  // The isMounted flag prevents a setState call if the component unmounts
  // before the fetch finishes (e.g. the user navigates away quickly).
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
  // ─── END CHANGED ───

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
