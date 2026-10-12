import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1790587352825 implements MigrationInterface {
    name = 'InitialSchema1790587352825'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "amenities" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "slug" character varying(100) NOT NULL, "name" character varying(150) NOT NULL, CONSTRAINT "UQ_354812ca699d4ef13f87119f895" UNIQUE ("slug"), CONSTRAINT "PK_c0777308847b3556086f2fb233e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('ADMIN', 'OWNER')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying(255) NOT NULL, "passwordHash" character varying(255) NOT NULL, "firstName" character varying(100) NOT NULL, "lastName" character varying(100) NOT NULL, "role" "public"."users_role_enum" NOT NULL DEFAULT 'OWNER', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."properties_type_enum" AS ENUM('APARTMENT', 'VILLA', 'MOTEL', 'CABIN', 'OTHER')`);
        await queryRunner.query(`CREATE TYPE "public"."properties_priceperiod_enum" AS ENUM('PER_NIGHT', 'PER_MONTH')`);
        await queryRunner.query(`CREATE TABLE "properties" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying(120) NOT NULL, "description" text NOT NULL, "type" "public"."properties_type_enum" NOT NULL DEFAULT 'OTHER', "pricePeriod" "public"."properties_priceperiod_enum" NOT NULL DEFAULT 'PER_NIGHT', "price" numeric(10,2) NOT NULL, "currency" character varying(3) NOT NULL DEFAULT 'USD', "city" character varying(100) NOT NULL, "address" character varying(255) NOT NULL, "latitude" double precision, "longitude" double precision, "bedrooms" integer NOT NULL, "bathrooms" integer NOT NULL, "maxGuests" integer NOT NULL, "contactEmail" character varying(255), "isPublished" boolean NOT NULL DEFAULT false, "ownerId" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_2d83bfa0b9fcd45dee1785af44d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_4960ebde3c85fa68d93e56e7a7" ON "properties"  ("type") `);
        await queryRunner.query(`CREATE INDEX "IDX_2fd1bae8559fceb2dc9eea7bd6" ON "properties"  ("price") `);
        await queryRunner.query(`CREATE INDEX "IDX_c7aea7f222acdb48e3422361f8" ON "properties"  ("city") `);
        await queryRunner.query(`CREATE TABLE "property_images" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "url" character varying(500) NOT NULL, "storageKey" character varying(255) NOT NULL, "sortOrder" integer NOT NULL DEFAULT '0', "isCover" boolean NOT NULL DEFAULT false, "propertyId" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_317c3774ee70c26d70c4f80e200" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "property_amenities" ("propertiesId" uuid NOT NULL, "amenitiesId" uuid NOT NULL, CONSTRAINT "PK_fe91206eb579182179293c26e5e" PRIMARY KEY ("propertiesId", "amenitiesId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_73f149bf7a208e3fa00d5e9d32" ON "property_amenities"  ("propertiesId") `);
        await queryRunner.query(`CREATE INDEX "IDX_6ff8f55ba52924e4418a6b4b71" ON "property_amenities"  ("amenitiesId") `);
        await queryRunner.query(`ALTER TABLE "properties" ADD CONSTRAINT "FK_47b8bfd9c3165b8a53cd0c58df0" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "property_images" ADD CONSTRAINT "FK_7a07b6b7f9418bf1d5160106694" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "property_amenities" ADD CONSTRAINT "FK_73f149bf7a208e3fa00d5e9d327" FOREIGN KEY ("propertiesId") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "property_amenities" ADD CONSTRAINT "FK_6ff8f55ba52924e4418a6b4b716" FOREIGN KEY ("amenitiesId") REFERENCES "amenities"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "property_amenities" DROP CONSTRAINT "FK_6ff8f55ba52924e4418a6b4b716"`);
        await queryRunner.query(`ALTER TABLE "property_amenities" DROP CONSTRAINT "FK_73f149bf7a208e3fa00d5e9d327"`);
        await queryRunner.query(`ALTER TABLE "property_images" DROP CONSTRAINT "FK_7a07b6b7f9418bf1d5160106694"`);
        await queryRunner.query(`ALTER TABLE "properties" DROP CONSTRAINT "FK_47b8bfd9c3165b8a53cd0c58df0"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6ff8f55ba52924e4418a6b4b71"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_73f149bf7a208e3fa00d5e9d32"`);
        await queryRunner.query(`DROP TABLE "property_amenities"`);
        await queryRunner.query(`DROP TABLE "property_images"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c7aea7f222acdb48e3422361f8"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2fd1bae8559fceb2dc9eea7bd6"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_4960ebde3c85fa68d93e56e7a7"`);
        await queryRunner.query(`DROP TABLE "properties"`);
        await queryRunner.query(`DROP TYPE "public"."properties_priceperiod_enum"`);
        await queryRunner.query(`DROP TYPE "public"."properties_type_enum"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
        await queryRunner.query(`DROP TABLE "amenities"`);
    }

}
