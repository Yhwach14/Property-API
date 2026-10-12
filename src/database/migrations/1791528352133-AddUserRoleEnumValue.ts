import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserRoleEnumValue1791528352133 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
  await queryRunner.query(`ALTER TYPE "public"."users_role_enum" ADD VALUE IF NOT EXISTS 'USER'`);
}

public async down(queryRunner: QueryRunner): Promise<void> {
}

}
