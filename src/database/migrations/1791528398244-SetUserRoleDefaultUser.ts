import { MigrationInterface, QueryRunner } from "typeorm";

export class SetUserRoleDefaultUser1791528398244 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
  await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'USER'`);
}

public async down(queryRunner: QueryRunner): Promise<void> {
  await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'OWNER'`);
}

}
