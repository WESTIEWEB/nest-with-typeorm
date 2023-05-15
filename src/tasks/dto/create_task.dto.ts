import { IsEnum, IsNotEmpty } from 'class-validator';
import { TaskStatus } from 'src/src/common';
export class CreateTaskDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;
}
