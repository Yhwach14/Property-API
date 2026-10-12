import { MigrationInterface, QueryRunner } from "typeorm";

export class AddContactPhoneToProperties1791494588481 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
  await queryRunner.query(
    `ALTER TABLE "properties" ADD "contactPhone" character varying(255)`,
  );
}

public async down(queryRunner: QueryRunner): Promise<void> {
  await queryRunner.query(
    `ALTER TABLE "properties" DROP COLUMN "contactPhone"`,
  );
}

}
