import { useState, useEffect } from "react";
import { supabase } from "../Lib/supabase";
import type { Category } from "../Types/category";

const DEFAULT_CATEGORIES = [
  "Videos",
  "Articles",
  "Documents",
  "Tutorials",
  "Tools",
  "Podcasts",
];

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

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

  const deleteCategory = async (id: string) => {
    const { error } = await supabase.from("categories").delete().eq("id", id);

    if (error) {
      console.error("Failed to delete category:", error.message);
      return;
    }

    await fetchCategories();
  };

  const seedDefaults = async (userId: string) => {
    const rows = DEFAULT_CATEGORIES.map((name) => ({
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

    const seedDefaultsIfEmpty = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data: existing } = await supabase
        .from("categories")
        .select("id")
        .limit(1);

      if (existing && existing.length > 0) return;

      const { count } = await supabase
        .from("categories")
        .select("*", { count: "exact", head: true });

      if (count && count > 0) return;

      const rows = DEFAULT_CATEGORIES.map((name) => ({
        name,
        user_id: user.id,
      }));

      const { error } = await supabase.from("categories").insert(rows);
      if (error) {
        console.error("Failed to seed default categories:", error.message);
        return;
      }

      const { data } = await supabase
        .from("categories")
        .select("*")
        .order("name");

      if (isMounted) setCategories(data || []);
    };

    const loadInitialData = async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name");

      if (!isMounted) return;

      if (error) {
        console.error("Failed to fetch categories:", error.message);
        setCategories([]);
        setLoading(false);
        return;
      }

      const fetched = data || [];
      setCategories(fetched);
      setLoading(false);

      if (fetched.length === 0) {
        await seedDefaultsIfEmpty();
      }
    };

    loadInitialData();

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
