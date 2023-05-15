import { TaskStatus } from '../common/status.common';

export class TaskDto {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
}
