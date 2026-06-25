// Core data type of the entire app
export interface Resource {
  id: string;
  user_id: string;
  title: string;
  url: string | null;
  description: string | null;
  thumbnail_url: string | null;
  category_id: string;
  tags: string[];
  is_read: boolean;
  is_revisit: boolean;
  is_favourite: boolean;
  last_opened_at: string | null;
  created_at: string;
  updated_at: string;
}

// For creating a new resource
export interface CreateResourceInput {
  title: string;
  url?: string;
  description?: string;
  thumbnail_url?: string;
  category_id: string;
  tags?: string[];
}
