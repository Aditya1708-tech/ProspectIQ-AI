export interface RMTask {
  id: string;
  customerId: string;
  assignedRM: string;
  title: string;
  description?: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'Pending' | 'In Progress' | 'Waiting Customer' | 'Completed' | 'Cancelled' | 'Overdue';
  category: string;
  dueDate: string;
  completedAt?: string;
}
