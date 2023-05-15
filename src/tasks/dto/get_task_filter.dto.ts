import { IsOptional, IsIn, IsNotEmpty } from 'class-validator';
import { TaskStatus } from '../common/status.common';

export class GetTaskFilterDto {
  @IsOptional()
  @IsIn([TaskStatus.DONE, TaskStatus.IN_PROGRESS, TaskStatus.OPEN])
  status: TaskStatus;

  @IsOptional()
  @IsNotEmpty()
  search: string;
}
