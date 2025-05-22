import type { ProjectTask } from "@/lib/types";
import { PROJECT_STATUS } from "@/lib/constants";
import KanbanColumn from "./kanban-column";

// Mock data for tasks
const tasks: ProjectTask[] = [
  { id: 'task-1', title: 'Discovery Phase for Alpha Solutions', description: 'Initial client meetings and requirement gathering.', status: PROJECT_STATUS.TODO, assignee: 'Alex Mercer', dueDate: '2024-08-15' },
  { id: 'task-2', title: 'Develop UI Mockups for Beta Corp', description: 'Create wireframes and high-fidelity mockups.', status: PROJECT_STATUS.IN_PROGRESS, assignee: 'Jane Doe', dueDate: '2024-08-20' },
  { id: 'task-3', title: 'Backend API Integration for Innovatech', description: 'Connect frontend to new microservices.', status: PROJECT_STATUS.IN_PROGRESS, assignee: 'John Smith', dueDate: '2024-09-01' },
  { id: 'task-4', title: 'Q&A Testing for Gamma Industries App', description: 'Comprehensive testing of all features.', status: PROJECT_STATUS.TODO, assignee: 'Emily White', dueDate: '2024-09-10' },
  { id: 'task-5', title: 'Deploy Omega Services Platform V1', description: 'Final deployment to production environment.', status: PROJECT_STATUS.DONE, assignee: 'Alex Mercer', dueDate: '2024-07-30' },
  { id: 'task-6', title: 'Client Onboarding Documentation', description: 'Prepare user guides and training materials.', status: PROJECT_STATUS.TODO, assignee: 'Jane Doe' },
  { id: 'task-7', title: 'Performance Optimization for Beta App', description: 'Identify and fix performance bottlenecks.', status: PROJECT_STATUS.IN_PROGRESS, assignee: 'John Smith', dueDate: '2024-08-25' },
];

export default function KanbanBoard() {
  const todoTasks = tasks.filter(task => task.status === PROJECT_STATUS.TODO);
  const inProgressTasks = tasks.filter(task => task.status === PROJECT_STATUS.IN_PROGRESS);
  const doneTasks = tasks.filter(task => task.status === PROJECT_STATUS.DONE);

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      <KanbanColumn title={PROJECT_STATUS.TODO} tasks={todoTasks} />
      <KanbanColumn title={PROJECT_STATUS.IN_PROGRESS} tasks={inProgressTasks} />
      <KanbanColumn title={PROJECT_STATUS.DONE} tasks={doneTasks} />
    </div>
  );
}
