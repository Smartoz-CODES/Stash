import { useState, useEffect, useMemo, useCallback } from 'react'
import { useResources } from '../../Hooks/use-resource'
import { useCategories } from '../../Hooks/use-categories'
import type { FilterParams, ResourceCounts } from '../../Types/filters'
import type { Resource } from '../../Types/resource'

const DashboardPage = () => {
  // ─── Hooks ───
  const {
    resources,
    loading: resourcesLoading,
    fetchResources,
    // createResource,
    // updateResource,
    deleteResource,
    markAsRead,
    toggleFavourite,
    toggleRevisit,
  } = useResources()

  const { categories } = useCategories()

  // Local State
  const [activeFilters, setActiveFilters] = useState<FilterParams>({})

  // Search term
  const [searchTerm, setSearchTerm] = useState('')

  // View mode, grid or list layout
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  // Modal state (Resource Deleted)
//   const [showSaveForm, setShowSaveForm] = useState(false)
//   const [editingResource, setEditingResource] = useState<Resource | null>(null)
  const [deletingResourceId, setDeletingResourceId] = useState<string | null>(null)


   const stableFetchResources = useCallback(
    (filters: FilterParams) => fetchResources(filters),
    [fetchResources]
  )
  
  useEffect(() => {
      const filtersWithSearch: FilterParams = {
        ...activeFilters,
        searchTerm: searchTerm || undefined,
      }

      const timer = setTimeout(() => {
      stableFetchResources(filtersWithSearch)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchTerm, activeFilters,stableFetchResources])


  const counts: ResourceCounts = useMemo(() => ({
    total: resources.length,
    unread: resources.filter((r: Resource) => !r.is_read).length,
    read: resources.filter((r: Resource) => r.is_read).length,
    favourites: resources.filter((r: Resource) => r.is_favourite).length,
    revisit: resources.filter((r: Resource) => r.is_revisit).length,
  }), [resources])

  const getCategoryName = (categoryId: string): string => {
    const match = categories.find((c) => c.id === categoryId)
    return match ? match.name : "Uncategorized"
  }
   
  // ─── Event Handlers ───
//   const handleFilterChange = (newFilters: FilterParams) => {
//     setActiveFilters(newFilters)
//   }

  const handleOpenResource = (id: string) => {
    const resource = resources.find((r) => r.id === id)
    if (!resource) return
    markAsRead(id)

    if (resource.url) {
      window.open(resource.url, '_blank')
    }
  }

   const handleDeleteClick = (id: string) => {
    setDeletingResourceId(id)
  }

   const handleConfirmDelete = async () => {
    if (deletingResourceId) {
      await deleteResource(deletingResourceId)
      setDeletingResourceId(null)
    }
  }


  // ─── Loading State ───
  if (resourcesLoading && resources.length === 0) {
    return (
      <div className="dashboard-loading">
        <p>Loading your library...</p>
      </div>
    )
  }

  // ─── Render ───
  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div className="dashboard-title">
          <h1>Library</h1>
          <span className="resource-count">{counts.total} resources saved</span>
        </div>

        <div className="dashboard-actions">
          <input
            type="text"
            placeholder="Search by title, tags or category"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />

          <div className="view-toggle">
            <button
              className={viewMode === 'list' ? 'active' : ''}
              onClick={() => setViewMode('list')}
              aria-label="List view"
            >
            </button>
            <button
              className={viewMode === 'grid' ? 'active' : ''}
              onClick={() => setViewMode('grid')}
              aria-label="Grid view"
            >
            </button>
          </div>

          <button
            className="save-button">
                + Save Resource
                  </button>
        </div>
      </div>
            
        

      <div className="dashboard-stats">
        <div className="stat-card">
          <span className="stat-number">{counts.total}</span>
          <span className="stat-label">Total Resources</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{counts.unread}</span>
          <span className="stat-label">Unread</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{counts.read}</span>
          <span className="stat-label">Read</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{counts.revisit}</span>
          <span className="stat-label">Revisit</span>
        </div>
      </div>

      {resources.length === 0 ? (
        // Empty state
        <div className="empty-state">
          <h2>No resources found</h2>
          <p>
            {Object.keys(activeFilters).length > 0 || searchTerm
              ? "We couldn't find any resources matching your filters. Try adjusting your filters or save new resources to get started."
              : "Your library is empty. Click 'Save Resource' to add your first link, article, or note."}
          </p>
          {(Object.keys(activeFilters).length > 0 || searchTerm) && (
            <button
              className="clear-filters-button"
              onClick={() => {
                setActiveFilters({})
                setSearchTerm('')
              }}
            >
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <div className={`resource-grid ${viewMode}`}>
          {resources.map((resource) => (
            // ─── Resource Card Placeholder ───
            // Would replace this <div> with <ResourceCard /> once Dev C delivers it
            // The props will be the same — just swap the JSX
            <div
              key={resource.id}
              className={`resource-card-placeholder ${resource.is_read ? 'read' : 'unread'}`}
              onClick={() => handleOpenResource(resource.id)}
            >
              {!resource.is_read && <span className="unread-dot" />}


              <span className="category-badge">
                {getCategoryName(resource.category_id)}
              </span>


              <h3 className="resource-title">{resource.title}</h3>


              {resource.description && (
                <p className="resource-description">{resource.description}</p>
              )}

              {resource.tags.length > 0 && (
                <div className="resource-tags">
                  {resource.tags.map((tag:string) => (
                    <span key={tag} className="tag-pill">#{tag}</span>
                  ))}
                </div>
              )}

              <div className="resource-footer">
                <span className="resource-date">
                  Saved {new Date(resource.created_at).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>

                <div className="resource-actions">

                  <button
                    onClick={(e) => {
                      e.stopPropagation() // prevent card click (which triggers markAsRead)
                      toggleFavourite(resource.id, resource.is_favourite)
                    }}
                    className={`favourite-btn ${resource.is_favourite ? 'active' : ''}`}
                    aria-label={resource.is_favourite ? 'Remove from favourites' : 'Add to favourites'}
                  >
                    {resource.is_favourite ? '♥' : '♡'}
                  </button>


                  {resource.is_revisit && (
                    <button
                    onClick={(e) => {
                        e.stopPropagation()
                         toggleRevisit(resource.id, resource.is_revisit)
                      }}
                    className="revisit-badge">Revisit</button>
                  )}

                
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteClick(resource.id)
                    }}
                    className="delete-btn"
                    aria-label="Delete resource"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {deletingResourceId && (
        <div className="modal-overlay" onClick={() => setDeletingResourceId(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Delete Resource</h3>
            <p>This action cannot be undone. Are you sure?</p>
            <div className="modal-actions">
              <button onClick={() => setDeletingResourceId(null)}>Cancel</button>
              <button onClick={handleConfirmDelete} className="delete-confirm">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DashboardPage