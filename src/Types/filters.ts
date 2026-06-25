// Filter types, shared between the useResources hook and FilterSidebar component

export interface FilterParams {
  categoryId?: string
  tag?: string
  isRead?: boolean
  isRevisit?: boolean
  isFavourite?: boolean
  searchTerm?: string
  dateRange?: 'week' | 'month' | 'older'
  neverOpened?: boolean
}


export interface ResourceCounts {
  total: number
  unread: number
  read: number
  favourites: number
  revisit: number
}