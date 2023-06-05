import { TaskFilterDto } from '../dto';
import { TaskDto } from '../dto/task.dto';

export interface ITaskRepository {
  findById(id: string): Promise<TaskDto | null>;
  find(input: TaskFilterDto): Promise<TaskDto[]>;
}
