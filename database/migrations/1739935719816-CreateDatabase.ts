import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateDatabase1739935719816 implements MigrationInterface {
  name = 'CreateDatabase1739935719816';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."business_profiles_business_type_enum" AS ENUM('SERVICE', 'CONSTRUCTION', 'RETAIL', 'COSMETIC', 'OTHER')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."business_profiles_focus_enum" AS ENUM('FINANCIAL_CASH', 'BUSINESS_GROWTH_HEALTH', 'FORECASTING_PLANNING', 'METRICS_INSIGHTS', 'PRODUCT_MARKET_FIT')`,
    );
    await queryRunner.query(
      `CREATE TABLE "business_profiles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "user_id" uuid NOT NULL, "name" character varying NOT NULL, "website" character varying NOT NULL, "founded_date" TIMESTAMP, "monthly_revenue_avg" character varying, "business_type" "public"."business_profiles_business_type_enum", "business_type_other" character varying, "industry_title" character varying, "industry_sic" character varying, "specific_service" character varying, "focus" "public"."business_profiles_focus_enum", "onboarding_complete" boolean DEFAULT false, CONSTRAINT "REL_1ceee77c549695cfc7c246224e" UNIQUE ("user_id"), CONSTRAINT "PK_29525485b1db8e87caf6a5ef042" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."users_status_enum" AS ENUM('ACTIVE', 'DEACTIVATED', 'INACTIVE', 'LOCKED')`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "name" character varying, "email" character varying NOT NULL, "status" "public"."users_status_enum" NOT NULL DEFAULT 'INACTIVE', CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "revenue_channels" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "amount" integer NOT NULL, "channel" character varying NOT NULL, "financial_data_id" uuid NOT NULL, CONSTRAINT "PK_ec6717abe702b8f7c4cd39244ce" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "expenses" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "amount" integer NOT NULL, "title" character varying NOT NULL, "financial_data_id" uuid NOT NULL, CONSTRAINT "PK_94c3ceb17e3140abc9282c20610" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "financial_data" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "user_id" uuid NOT NULL, "total_revenue" integer NOT NULL, "total_expenses" integer NOT NULL, "total_profit" integer NOT NULL, "date" TIMESTAMP NOT NULL, CONSTRAINT "PK_7a5f2ef805ad2b4570625f5764c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "business_profiles" ADD CONSTRAINT "FK_1ceee77c549695cfc7c246224ef" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "revenue_channels" ADD CONSTRAINT "FK_f420c0d9d8a4128bffd9cda81b3" FOREIGN KEY ("financial_data_id") REFERENCES "financial_data"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "expenses" ADD CONSTRAINT "FK_fd65e366df0509f1f4e51f4e358" FOREIGN KEY ("financial_data_id") REFERENCES "financial_data"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "financial_data" ADD CONSTRAINT "FK_978296f4f59d95f39835efd1867" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "financial_data" DROP CONSTRAINT "FK_978296f4f59d95f39835efd1867"`,
    );
    await queryRunner.query(
      `ALTER TABLE "expenses" DROP CONSTRAINT "FK_fd65e366df0509f1f4e51f4e358"`,
    );
    await queryRunner.query(
      `ALTER TABLE "revenue_channels" DROP CONSTRAINT "FK_f420c0d9d8a4128bffd9cda81b3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "business_profiles" DROP CONSTRAINT "FK_1ceee77c549695cfc7c246224ef"`,
    );
    await queryRunner.query(`DROP TABLE "financial_data"`);
    await queryRunner.query(`DROP TABLE "expenses"`);
    await queryRunner.query(`DROP TABLE "revenue_channels"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TYPE "public"."users_status_enum"`);
    await queryRunner.query(`DROP TABLE "business_profiles"`);
    await queryRunner.query(
      `DROP TYPE "public"."business_profiles_focus_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."business_profiles_business_type_enum"`,
    );
  }
}
