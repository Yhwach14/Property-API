import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCoverImageUniqueIndex1791671066304 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
  await queryRunner.query(`
    CREATE UNIQUE INDEX "UQ_property_images_one_cover"
    ON "property_images" ("propertyId")
    WHERE "isCover" = true
  `);
}

public async down(queryRunner: QueryRunner): Promise<void> {
  await queryRunner.query(`DROP INDEX "public"."UQ_property_images_one_cover"`);
}

}
