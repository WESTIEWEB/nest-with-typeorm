/* eslint-disable prettier/prettier */
import { TaskStatus } from '../model/tasks.model';

export class GetTaskFilterDto {
  status: TaskStatus;
  search: string;
}
