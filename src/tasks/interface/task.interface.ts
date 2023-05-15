import { GetTaskFilterDto } from '../dto';
import { TaskDto } from '../dto/task.dto';

export interface ITaskRepository {
  findById(id: string): Promise<TaskDto | null>;
  find(input: GetTaskFilterDto): Promise<TaskDto[]>;
}
