import { TaskStatus } from 'src/common';

export class TaskDto {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
}
