import { AbstractPersistedEntity } from '../../common';
import { TaskPersistedEntity } from '../../tasks/entity';
import { Column, Entity, OneToMany } from 'typeorm';
import * as bcrypt from 'bcrypt';

enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  DELETED = 'DELETED',
  DEACTIVATED = 'DEACTIVATED',
  BLOCKED = 'BLOCKED',
}

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
    type: 'enum',
    enum: UserStatus,
    nullable: false,
    default: UserStatus.INACTIVE,
  })
  status: UserStatus;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  salt: string;

  @Column({
    type: 'int',
    nullable: true,
  })
  otp: number | null;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  otpExpiry: Date | null;

  @Column({
    type: 'boolean',
    nullable: false,
    default: false,
  })
  isVerified: boolean;

  @OneToMany(() => TaskPersistedEntity, (task) => task.user, { eager: true })
  tasks: TaskPersistedEntity[];

  async validatePassword(password: string) {
    const hash = await bcrypt.hash(password, this.salt);
    return hash === this.password;
  }
}
