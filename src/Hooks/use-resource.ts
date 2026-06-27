import { useState, useEffect, useCallback } from "react";
import { supabase } from "../Lib/supabase";
import type { Resource, CreateResourceInput } from "../Types/resource";
import type { FilterParams } from "../Types/filters";

// Hook that manages all resource operations
// This is the central data layer for the entire app
// Used by: DashboardPage (to render and filter resources)

export const useResources = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Reusable fetch with optional filters
  // Called by the dashboard when filters change, or after create/update/delete
  // NOT used for the initial mount load (that's handled in the useEffect below)
  const fetchResources = useCallback(async (filters?: FilterParams) => {
    setLoading(true);
    setError(null);

    // Start building the query
    // Each filter adds a WHERE condition — they stack with AND logic
    let query = supabase.from("resources").select("*");

    // Apply filters only if they exist
    if (filters) {
      // Filter by category
      if (filters.categoryId) {
        query = query.eq("category_id", filters.categoryId);
      }

      // Filter by tag — .contains() checks if the tags array includes this value
      if (filters.tag) {
        query = query.contains("tags", [filters.tag]);
      }

      // Filter by read status
      // Only apply if isRead is explicitly true or false, not undefined
      if (filters.isRead !== undefined) {
        query = query.eq("is_read", filters.isRead);
      }

      // Filter for resources flagged as "revisit later"
      if (filters.isRevisit) {
        query = query.eq("is_revisit", true);
      }

      // Filter for favourites only
      if (filters.isFavourite) {
        query = query.eq("is_favourite", true);
      }

      // Filter for resources that have never been opened
      // .is() checks for null values
      if (filters.neverOpened) {
        query = query.is("last_opened_at", null);
      }

      // Search by title — case-insensitive partial match
      // The % symbols mean "anything before/after"
      if (filters.searchTerm) {
        query = query.ilike("title", `%${filters.searchTerm}%`);
      }

      // Date range filters
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

    // Always sort by newest first
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

  // Create a new resource
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

  // Update any fields on a resource
  // Partial<Resource> means you can pass just the fields you want to change
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

  // Delete a resource permanently
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

  // ─── Convenience methods for single-field updates ───

  // Called automatically when a user opens a resource
  // Sets is_read to true and records when it was last opened
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

    // Update local state without re-fetching the entire list
    // This makes the UI respond instantly
    setResources((prev: Resource[]) =>
      prev.map((resource: Resource) =>
        resource.id === id
          ? { ...resource, is_read: true, last_opened_at: now }
          : resource,
      ),
    );
  };

  // Toggle the favourite status
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

  // Toggle the "revisit later" flag
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

  // ─── CHANGED: Initial load on mount ───
  // Previously this called fetchResources() directly, which triggered
  // ESLint's set-state-in-effect rule because fetchResources calls
  // setLoading(true) synchronously when the effect runs.
  //
  // Fix: define an async function INSIDE the effect for the initial fetch.
  // loading already starts as true (from useState above), so we skip setLoading here.
  // The isMounted flag prevents setState on an unmounted component
  // (e.g. user navigates away before the fetch completes).
  useEffect(() => {
    let isMounted = true;

    const loadInitialData = async () => {
      const { data, error: fetchError } = await supabase
        .from("resources")
        .select("*")
        .order("created_at", { ascending: false });

      // If the component unmounted while we were waiting, don't set state
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

    // Cleanup: called when the component unmounts
    return () => {
      isMounted = false;
    };
  }, []);
  // ─── END CHANGED ───

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
