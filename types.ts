export interface Update {
  id: string;
  title: string;
  text: string;
}

export interface Topic {
  id: string;
  title: string;
  updates: Update[];
}

export interface Category {
  id: 'rtb' | 'projects';
  title: string;
  topics: Topic[];
}

export interface DashboardData {
  rtb: Category;
  projects: Category;
}