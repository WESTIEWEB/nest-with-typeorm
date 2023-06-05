import { AbstractPersistedEntity } from 'src/common';
import { UserPersistedEntity } from 'src/user/entities/user.persisted-entity';
import { Column, Entity, ManyToOne } from 'typeorm';

enum TaskStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
}
@Entity({ name: 'tasks' })
export class TaskPersistedEntity extends AbstractPersistedEntity {
  @Column({
    type: 'varchar',
    nullable: false,
  })
  title: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  description: string;

  @Column({
    type: 'enum',
    enum: TaskStatus,
    nullable: false,
    default: TaskStatus.OPEN,
  })
  status: TaskStatus;

  @Column({
    type: 'boolean',
    nullable: false,
    default: false,
  })
  isDeleted: boolean;

  @ManyToOne(() => UserPersistedEntity, (user) => user.tasks)
  user: UserPersistedEntity;

  @Column({
    type: 'uuid',
    nullable: false,
  })
  userId: string;
}
