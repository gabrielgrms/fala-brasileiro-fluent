
export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: 'pendente' | 'concluida';
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateTaskRequest {
  title: string;
  description: string;
  dueDate: string;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  dueDate?: string;
  status?: 'pendente' | 'concluida';
}
