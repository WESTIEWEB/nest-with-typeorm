import { MigrationInterface, QueryRunner, Table } from 'typeorm';

const tableName = 'tasks';
export class CreateTaskModel1685969063648 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const table = new Table({
      name: tableName,
      columns: [
        {
          name: 'id',
          type: 'uuid',
          isPrimary: true,
        },
        {
          name: 'title',
          type: 'varchar',
          isNullable: false,
        },
        {
          name: 'description',
          type: 'varchar',
          isNullable: false,
        },
        {
          name: 'status',
          type: 'enum',
          isNullable: false,
          enum: ['OPEN', 'IN_PROGRESS', 'DONE'],
          default: "'OPEN'",
        },
        {
          name: 'isDeleted',
          type: 'boolean',
          isNullable: false,
          default: false,
        },
        {
          name: 'userId',
          type: 'uuid',
          isNullable: false,
        },
        {
          name: 'created_at',
          type: 'timestamp',
          default: 'now()',
        },
        {
          name: 'updated_at',
          type: 'timestamp',
          default: 'now()',
        },
      ],
    });
    await queryRunner.createTable(table);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(tableName);
  }
}
