import { AbstractPersistedEntity } from 'src/common';
import { TaskPersistedEntity } from 'src/tasks/entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity({ name: 'user' })
export class UserPersistedEntity extends AbstractPersistedEntity {
  @Column({
    type: 'varchar',
    unique: true,
    nullable: false,
  })
  email: string;

  @Column({
    type: 'varchar',
    nullable: true,
    unique: true,
  })
  phone: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  password: string;

  @OneToMany(() => TaskPersistedEntity, (task) => task.user)
  tasks: TaskPersistedEntity[];
}
