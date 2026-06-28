import { useState, useMemo } from "react";
import { Outlet } from "react-router-dom";
import { useResources } from "../Hooks/use-resource";
import { useCategories } from "../Hooks/use-categories";
import FilterSidebar from "../Components/filter-sidebar";
import CategoryManager from "../Components/category-manager";
import type { FilterParams } from "../Types/filters";
import type { Resource } from "../Types/resource";
import "../Styles/app-layout.css";

const AppLayout = () => {
  const {
    resources,
    loading,
    fetchResources,
    createResource,
    updateResource,
    deleteResource,
    markAsRead,
    toggleFavourite,
    toggleRevisit,
  } = useResources();

  const { categories, createCategory, updateCategory, deleteCategory } =
    useCategories();

  const [activeFilters, setActiveFilters] = useState<FilterParams>({});
  const [showCategoryManager, setShowCategoryManager] = useState(false);

  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    resources.forEach((r: Resource) =>
      r.tags?.forEach((t: string) => tagSet.add(t)),
    );
    return Array.from(tagSet);
  }, [resources]);

  // Counts derived from the single resources array and updates instantly
  const resourceCounts = useMemo(
    () => ({
      total: resources.length,
      unread: resources.filter((r: Resource) => !r.is_read).length,
      read: resources.filter((r: Resource) => r.is_read).length,
      favourites: resources.filter((r: Resource) => r.is_favourite).length,
      revisit: resources.filter((r: Resource) => r.is_revisit).length,
    }),
    [resources],
  );

  return (
    <div className="app-layout">
      <FilterSidebar
        categories={categories}
        allTags={allTags}
        activeFilters={activeFilters}
        resourceCounts={resourceCounts}
        onFilterChange={setActiveFilters}
        onManageCategories={() => setShowCategoryManager(true)}
      />
      <main className="app-content">
        <Outlet
          context={{
            activeFilters,
            setActiveFilters,
            resources,
            loading,
            fetchResources,
            createResource,
            updateResource,
            deleteResource,
            markAsRead,
            toggleFavourite,
            toggleRevisit,
            categories,
            allTags,
            resourceCounts,
          }}
        />
      </main>

      {showCategoryManager && (
        <CategoryManager
          categories={categories}
          onCreate={createCategory}
          onRename={updateCategory}
          onDelete={deleteCategory}
          onClose={() => setShowCategoryManager(false)}
        />
      )}
    </div>
  );
};

export default AppLayout;
