import { IsNotEmpty, IsString } from 'class-validator';

export class UserTaskDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;
}
