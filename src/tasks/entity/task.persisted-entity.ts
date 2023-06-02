import { AbstractPersistedEntity, TaskStatus } from 'src/common';
import { UserPersistedEntity } from 'src/user/entities/user.persisted-entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity({ name: 'task' })
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

  @ManyToOne(() => UserPersistedEntity, (user) => user.tasks)
  user: UserPersistedEntity;
}
