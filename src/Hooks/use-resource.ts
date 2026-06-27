import { useState, useEffect, useCallback } from "react";
import { supabase } from "../Lib/supabase";
import type { Resource, CreateResourceInput } from "../Types/resource";
import type { FilterParams } from "../Types/filters";

export const useResources = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchResources = useCallback(async (filters?: FilterParams) => {
    setLoading(true);
    setError(null);

    let query = supabase.from("resources").select("*");

    if (filters) {
      if (filters.categoryId) {
        query = query.eq("category_id", filters.categoryId);
      }

      if (filters.tag) {
        query = query.contains("tags", [filters.tag]);
      }

      if (filters.isRead !== undefined) {
        query = query.eq("is_read", filters.isRead);
      }

      if (filters.isRevisit) {
        query = query.eq("is_revisit", true);
      }

      if (filters.isFavourite) {
        query = query.eq("is_favourite", true);
      }

      if (filters.neverOpened) {
        query = query.is("last_opened_at", null);
      }

      // Search by title OR tag both handled at database level.
      if (filters.searchTerm) {
        const term = filters.searchTerm.trim();
        query = query.or(`title.ilike.%${term}%,tags.cs.{"${term}"}`);
      }

      if (filters.dateRange) {
        const now = new Date();
        if (filters.dateRange === "week") {
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          query = query.gte("created_at", weekAgo.toISOString());
        } else if (filters.dateRange === "month") {
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          query = query.gte("created_at", monthAgo.toISOString());
        } else if (filters.dateRange === "older") {
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          query = query.lte("created_at", monthAgo.toISOString());
        }
      }
    }

    query = query.order("created_at", { ascending: false });

    const { data, error: fetchError } = await query;

    if (fetchError) {
      console.error("Failed to fetch resources:", fetchError.message);
      setError(fetchError.message);
      setResources([]);
      setLoading(false);
      return;
    }

    setResources(data || []);
    setLoading(false);
  }, []);

  const createResource = async (input: CreateResourceInput) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { error: insertError } = await supabase.from("resources").insert({
      title: input.title,
      url: input.url || null,
      description: input.description || null,
      thumbnail_url: input.thumbnail_url || null,
      category_id: input.category_id,
      tags: input.tags || [],
      user_id: user.id,
    });

    if (insertError) {
      console.error("Failed to create resource:", insertError.message);
      return;
    }

    await fetchResources();
  };

  const updateResource = async (id: string, updates: Partial<Resource>) => {
    const { error: updateError } = await supabase
      .from("resources")
      .update(updates)
      .eq("id", id);

    if (updateError) {
      console.error("Failed to update resource:", updateError.message);
      return;
    }

    await fetchResources();
  };

  const deleteResource = async (id: string) => {
    const { error: deleteError } = await supabase
      .from("resources")
      .delete()
      .eq("id", id);

    if (deleteError) {
      console.error("Failed to delete resource:", deleteError.message);
      return;
    }

    await fetchResources();
  };

  const markAsRead = async (id: string) => {
    const now = new Date().toISOString();

    const { error: readError } = await supabase
      .from("resources")
      .update({ is_read: true, last_opened_at: now })
      .eq("id", id);

    if (readError) {
      console.error("Failed to mark as read:", readError.message);
      return;
    }

    setResources((prev: Resource[]) =>
      prev.map((resource: Resource) =>
        resource.id === id
          ? { ...resource, is_read: true, last_opened_at: now }
          : resource,
      ),
    );
  };

  const toggleFavourite = async (id: string, currentValue: boolean) => {
    const newValue = !currentValue;

    const { error: favError } = await supabase
      .from("resources")
      .update({ is_favourite: newValue })
      .eq("id", id);

    if (favError) {
      console.error("Failed to toggle favourite:", favError.message);
      return;
    }

    setResources((prev: Resource[]) =>
      prev.map((resource: Resource) =>
        resource.id === id ? { ...resource, is_favourite: newValue } : resource,
      ),
    );
  };

  const toggleRevisit = async (id: string, currentValue: boolean) => {
    const newValue = !currentValue;

    const { error: revisitError } = await supabase
      .from("resources")
      .update({ is_revisit: newValue })
      .eq("id", id);

    if (revisitError) {
      console.error("Failed to toggle revisit:", revisitError.message);
      return;
    }

    setResources((prev: Resource[]) =>
      prev.map((resource: Resource) =>
        resource.id === id ? { ...resource, is_revisit: newValue } : resource,
      ),
    );
  };

  useEffect(() => {
    let isMounted = true;

    const loadInitialData = async () => {
      const { data, error: fetchError } = await supabase
        .from("resources")
        .select("*")
        .order("created_at", { ascending: false });

      if (!isMounted) return;

      if (fetchError) {
        console.error("Failed to fetch resources:", fetchError.message);
        setError(fetchError.message);
        setResources([]);
      } else {
        setResources(data || []);
      }

      setLoading(false);
    };

    loadInitialData();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    resources,
    loading,
    error,
    fetchResources,
    createResource,
    updateResource,
    deleteResource,
    markAsRead,
    toggleFavourite,
    toggleRevisit,
  };
};
