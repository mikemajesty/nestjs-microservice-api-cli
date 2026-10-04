import { dashToPascal, getPermissionNames, snakeToCamel } from '../../../textUtils.mjs'

// roles/permissions always live in postgres, even when the CRUD module itself is mongo,
// so this migration template is reused for both postgres:crud and mongo:crud scaffolds.
const getInsertPermissionsMigration = (name, timestamp, roleNames) => {
  const permissionsVar = `${snakeToCamel(name)}Permissions`
  const rolesVar = `${snakeToCamel(name)}Roles`
  const className = `insert${dashToPascal(name)}Permissions${timestamp}`
  const permissions = getPermissionNames(name)
  const rolesList = roleNames.map(role => `RoleEnum.${role}`).join(', ')

  return `import { PermissionEntity } from '@/core/permission/entity/permission'
import { RoleEnum } from '@/core/role/entity/role'
import { IDGeneratorUtils } from '@/utils/id-generator'
import { ObjectUtils } from '@/utils/object'
import { MigrationInterface, QueryDeepPartialEntity, QueryRunner } from 'typeorm'
import { PermissionSchema } from '../schemas/permission'
import { RoleSchema } from '../schemas/role'

export const ${permissionsVar} = [
${permissions.map(permission => `  '${permission}'`).join(',\n')}
]

const ${rolesVar} = [${rolesList}]

export class ${className} implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    for (const permission of ${permissionsVar}) {
      const entity = new PermissionEntity({ id: IDGeneratorUtils.uuid(), name: permission })
      await queryRunner.manager.insert(PermissionSchema, entity as QueryDeepPartialEntity<PermissionSchema>)
    }

    const roles = await queryRunner.manager.find(RoleSchema)
    const permissions = await queryRunner.manager.find(PermissionSchema)

    for (const roleName of ${rolesVar}) {
      const role = roles.find((r) => r.name === roleName)

      for (const permissionName of ${permissionsVar}) {
        const permission = permissions.find((p) => p.name === permissionName)
        await queryRunner.query(
          \`INSERT INTO permissions_roles (roles_id, permissions_id) VALUES ('\${ObjectUtils.reach(role, (r) => r.id)}', '\${ObjectUtils.reach(permission, (p) => p.id)}');\`
        )
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    for (const permission of ${permissionsVar}) {
      await queryRunner.manager.delete(PermissionSchema, { name: permission })
    }
  }
}
`
}

export {
  getInsertPermissionsMigration
}
