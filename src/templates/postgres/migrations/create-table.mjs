import pluralize from 'pluralize'
import { dashToPascal } from '../../../textUtils.mjs'

// scaffolded postgres schemas only have "name" (plus BaseEntity timestamps), so the
// generated DDL mirrors the shape of existing hand-written tables (e.g. createRoleTable).
// TestPostgresContainer runs with migrationsRun: true and no synchronize, so without this
// migration the scaffolded table would never actually exist in postgres.
const getCreateTableMigration = (name, timestamp) => {
  const tableName = pluralize(name)
  const className = `create${dashToPascal(name)}Table${timestamp}`

  return `import { MigrationInterface, QueryRunner } from 'typeorm'

export class ${className} implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      \`CREATE TABLE IF NOT EXISTS "${tableName}" ("id" uuid NOT NULL, "name" text NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_${tableName}_id" PRIMARY KEY ("id"))\`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('${tableName}', true)
  }
}
`
}

export {
  getCreateTableMigration
}
