import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { matrixApi, scoreApi } from '../services/api';
import type { MatrixData, Employee, TrainingColumn, FilterOptions } from '../types';

interface MatrixState {
  data: MatrixData | null;
  loading: boolean;
  error: string | null;
  filters: FilterOptions;
}

type MatrixAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_DATA'; payload: MatrixData }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'SET_FILTERS'; payload: FilterOptions }
  | { type: 'UPDATE_SCORE'; payload: { employeeId: number; columnId: string; level: number; notes?: string } }
  | { type: 'ADD_EMPLOYEE'; payload: Employee }
  | { type: 'UPDATE_EMPLOYEE'; payload: Employee }
  | { type: 'ADD_COLUMN'; payload: TrainingColumn }
  | { type: 'UPDATE_COLUMN'; payload: TrainingColumn };

const initialState: MatrixState = {
  data: null,
  loading: false,
  error: null,
  filters: { active_only: true },
};

function matrixReducer(state: MatrixState, action: MatrixAction): MatrixState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_DATA':
      return { ...state, data: action.payload, loading: false, error: null };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    
    case 'SET_FILTERS':
      return { ...state, filters: action.payload };
    
    case 'UPDATE_SCORE':
      if (!state.data) return state;
      
      const updatedScores = state.data.scores.map(score => 
        score.employee_id === action.payload.employeeId && score.column_id === action.payload.columnId
          ? { ...score, level: action.payload.level, notes: action.payload.notes }
          : score
      );
      
      // Add new score if it doesn't exist
      const existingScore = updatedScores.find(score => 
        score.employee_id === action.payload.employeeId && score.column_id === action.payload.columnId
      );
      
      if (!existingScore) {
        updatedScores.push({
          employee_id: action.payload.employeeId,
          column_id: action.payload.columnId,
          level: action.payload.level,
          notes: action.payload.notes,
          updated_at: new Date().toISOString(),
        });
      }
      
      return {
        ...state,
        data: { ...state.data, scores: updatedScores }
      };
    
    case 'ADD_EMPLOYEE':
      if (!state.data) return state;
      return {
        ...state,
        data: {
          ...state.data,
          employees: [...state.data.employees, action.payload]
        }
      };
    
    case 'UPDATE_EMPLOYEE':
      if (!state.data) return state;
      return {
        ...state,
        data: {
          ...state.data,
          employees: state.data.employees.map(emp => 
            emp.id === action.payload.id ? action.payload : emp
          )
        }
      };
    
    case 'ADD_COLUMN':
      if (!state.data) return state;
      return {
        ...state,
        data: {
          ...state.data,
          columns: [...state.data.columns, action.payload]
        }
      };
    
    case 'UPDATE_COLUMN':
      if (!state.data) return state;
      return {
        ...state,
        data: {
          ...state.data,
          columns: state.data.columns.map(col => 
            col.id === action.payload.id ? action.payload : col
          )
        }
      };
    
    default:
      return state;
  }
}

interface MatrixContextType {
  state: MatrixState;
  loadMatrix: (filters?: FilterOptions) => Promise<void>;
  updateScore: (employeeId: number, columnId: string, level: number, notes?: string) => Promise<void>;
  addEmployee: (employee: Employee) => void;
  updateEmployee: (employee: Employee) => void;
  addColumn: (column: TrainingColumn) => void;
  updateColumn: (column: TrainingColumn) => void;
  setFilters: (filters: FilterOptions) => void;
}

const MatrixContext = createContext<MatrixContextType | undefined>(undefined);

export function MatrixProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(matrixReducer, initialState);

  const loadMatrix = async (filters?: FilterOptions) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const data = await matrixApi.getMatrix(filters);
      dispatch({ type: 'SET_DATA', payload: data });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to load matrix data' });
    }
  };

  const updateScore = async (employeeId: number, columnId: string, level: number, notes?: string) => {
    try {
      await scoreApi.createOrUpdate({
        employee_id: employeeId,
        column_id: columnId,
        level,
        notes,
        updated_by: 'current_user', // TODO: Get from auth context
      });
      
      dispatch({ type: 'UPDATE_SCORE', payload: { employeeId, columnId, level, notes } });
    } catch (error) {
      console.error('Failed to update score:', error);
      throw error;
    }
  };

  const addEmployee = (employee: Employee) => {
    dispatch({ type: 'ADD_EMPLOYEE', payload: employee });
  };

  const updateEmployee = (employee: Employee) => {
    dispatch({ type: 'UPDATE_EMPLOYEE', payload: employee });
  };

  const addColumn = (column: TrainingColumn) => {
    dispatch({ type: 'ADD_COLUMN', payload: column });
  };

  const updateColumn = (column: TrainingColumn) => {
    dispatch({ type: 'UPDATE_COLUMN', payload: column });
  };

  const setFilters = (filters: FilterOptions) => {
    dispatch({ type: 'SET_FILTERS', payload: filters });
    loadMatrix(filters);
  };

  // Load initial data
  useEffect(() => {
    loadMatrix(state.filters);
  }, []);

  const value: MatrixContextType = {
    state,
    loadMatrix,
    updateScore,
    addEmployee,
    updateEmployee,
    addColumn,
    updateColumn,
    setFilters,
  };

  return (
    <MatrixContext.Provider value={value}>
      {children}
    </MatrixContext.Provider>
  );
}

export function useMatrix() {
  const context = useContext(MatrixContext);
  if (context === undefined) {
    throw new Error('useMatrix must be used within a MatrixProvider');
  }
  return context;
}
