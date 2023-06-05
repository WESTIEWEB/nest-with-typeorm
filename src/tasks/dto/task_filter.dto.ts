import { IsOptional, IsIn, IsNotEmpty } from 'class-validator';
import { TaskStatus } from 'src/common';

export class TaskFilterDto {
  @IsOptional()
  @IsIn([TaskStatus.DONE, TaskStatus.IN_PROGRESS, TaskStatus.OPEN])
  status: TaskStatus;

  @IsOptional()
  search: string;
}
