// Core data types for the Employee Development Matrix

export interface Employee {
  id: number;
  name: string;
  role: string;
  department?: string;
  avatar?: string;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

export interface TrainingColumn {
  id: string;
  title: string;
  description?: string;
  category?: string;
  target_level: number;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

export interface Score {
  id: number;
  employee_id: number;
  column_id: string;
  level: number;
  notes?: string;
  updated_by?: string;
  updated_at: string;
}

export interface MatrixCell {
  employee_id: number;
  column_id: string;
  level: number;
  notes?: string;
  updated_by?: string;
  updated_at?: string;
}

export interface MatrixData {
  employees: Employee[];
  columns: TrainingColumn[];
  scores: MatrixCell[];
  settings: AppSettings;
}

export interface LevelConfig {
  level: number;
  label: string;
  color: string;
  description?: string;
}

export interface AppSettings {
  levels: LevelConfig[];
  theme: 'light' | 'dark';
  default_target_level: number;
  completion_method: 'average' | 'weighted';
  show_avatars: boolean;
  compact_view: boolean;
}

export interface SkillDistribution {
  level: number;
  label: string;
  count: number;
  percentage: number;
  color: string;
}

export interface AnalyticsData {
  skill_distribution: SkillDistribution[];
  total_employees: number;
  total_trainings: number;
  completion_rate: number;
  top_skills: Array<{
    column_id: string;
    title: string;
    completed_count: number;
  }>;
  recent_activity: Array<{
    employee_name: string;
    column_title: string;
    level: number;
    updated_at: string;
    updated_by?: string;
  }>;
}

export interface User {
  id: number;
  username: string;
  role: 'admin' | 'manager' | 'employee';
  is_active: boolean;
  created_at: string;
}

export interface CreateEmployeeRequest {
  name: string;
  role: string;
  department?: string;
  avatar?: string;
}

export interface UpdateEmployeeRequest {
  name?: string;
  role?: string;
  department?: string;
  avatar?: string;
  is_active?: boolean;
}

export interface CreateTrainingColumnRequest {
  id?: string;
  title: string;
  description?: string;
  category?: string;
  target_level: number;
  sort_order?: number;
}

export interface UpdateTrainingColumnRequest {
  title?: string;
  description?: string;
  category?: string;
  target_level?: number;
  sort_order?: number;
  is_active?: boolean;
}

export interface CreateScoreRequest {
  employee_id: number;
  column_id: string;
  level: number;
  notes?: string;
  updated_by?: string;
}

export interface UpdateScoreRequest {
  level?: number;
  notes?: string;
  updated_by?: string;
}

export interface FilterOptions {
  department?: string;
  role?: string;
  active_only?: boolean;
}

export interface ExportOptions {
  format: 'csv' | 'json';
  department?: string;
  role?: string;
}
