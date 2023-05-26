import { PrimaryColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export abstract class AbstractPersistedEntity {
  @PrimaryColumn({ type: 'uuid' })
  id!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
