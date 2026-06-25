// Category type, Each user gets four defaults on signup: Work, Learning, Personal, Business
// Users can create, rename, and delete their own categories

export interface Category {
  id: string;
  user_id: string;
  name: string;
  created_at: string;
}
