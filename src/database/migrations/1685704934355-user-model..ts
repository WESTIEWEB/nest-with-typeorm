import { MigrationInterface, QueryRunner, Table } from 'typeorm';

const tableName = 'users';
export class CreateUserTable1685669347930 implements MigrationInterface {
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
          name: 'email',
          type: 'varchar',
          isUnique: true,
          isNullable: false,
        },
        {
          name: 'password',
          type: 'varchar',
          isNullable: false,
        },
        {
          name: 'salt',
          type: 'varchar',
          isNullable: false,
        },
        {
          name: 'otp',
          type: 'int',
          isNullable: true,
        },
        {
          name: 'otpExpiry',
          type: 'timestamp',
          isNullable: true,
        },
        {
          name: 'status',
          type: 'enum',
          isNullable: false,
          enum: ['ACTIVE', 'INACTIVE', 'DELETED', 'DEACTIVATED', 'BLOCKED'],
          default: 'INACTIVE',
        },
        {
          name: 'phone',
          type: 'varchar',
          isNullable: true,
        },
        {
          name: 'isVerified',
          type: 'boolean',
          isNullable: false,
          default: false,
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
