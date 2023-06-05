import { AbstractPersistedEntity } from 'src/common';
import { TaskPersistedEntity } from 'src/tasks/entity';
import { Column, Entity, OneToMany } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Entity({ name: 'users' })
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

  @Column({
    type: 'varchar',
    nullable: false,
  })
  salt: string;

  @Column({
    type: 'boolean',
    nullable: false,
    default: false,
  })
  isVerified: boolean;

  @OneToMany(() => TaskPersistedEntity, (task) => task.user)
  tasks: TaskPersistedEntity[];

  async validatePassword(password: string) {
    const hash = await bcrypt.hash(password, this.salt);
    return hash === this.password;
  }
}
