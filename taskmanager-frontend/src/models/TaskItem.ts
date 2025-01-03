export interface TaskItem {
    id?: number;
    title: string;
    description?: string;
    status: string;
    createdAt?: string;
    
    timerHours?: number;
    timerStart?: string;
    renewCount?: number;
  }
  