import { MigrationInterface, QueryRunner } from "typeorm";

export class SimulationFeatureModel1741317754145 implements MigrationInterface {
    name = 'SimulationFeatureModel1741317754145'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "financial_data" DROP CONSTRAINT "UQ_8d73a9798db9f7aa21a89c506a3"`);
        await queryRunner.query(`CREATE TABLE "plans" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "business_id" uuid NOT NULL, "name" character varying, "start_date" TIMESTAMP WITH TIME ZONE NOT NULL, "reverse_duration" integer NOT NULL, "monthly_revenue" integer, "operating_cost" integer, "tax_rate" integer, "credit_access" integer, "monthly_personal_expense" integer, "personal_expense_reserve_duration" integer, CONSTRAINT "PK_3720521a81c7c24fe9b7202ba61" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."scenarios_type_enum" AS ENUM('CONSERVATION', 'MODERATE', 'AGGRESSIVE')`);
        await queryRunner.query(`CREATE TABLE "scenarios" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "plan_id" uuid NOT NULL, "type" "public"."scenarios_type_enum" NOT NULL, "monthly_take_home" integer NOT NULL, "project_revenue" integer NOT NULL, "recommended_cash_reserve" integer NOT NULL, "recommended_monthly_investment" integer NOT NULL, CONSTRAINT "PK_a2af4912aab626639cca306b987" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "simulations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "plan_id" uuid NOT NULL, "scenario_id" uuid NOT NULL, CONSTRAINT "PK_c6d15083257a1c84ecd67423c30" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."liabilities_type_enum" AS ENUM('current_liabilities', 'non_current_liabilities')`);
        await queryRunner.query(`CREATE TABLE "liabilities" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "business_id" uuid NOT NULL, "name" character varying NOT NULL, "value" integer NOT NULL, "type" "public"."liabilities_type_enum" NOT NULL, "interest_rate" numeric(10,2) NOT NULL, "due_date" TIMESTAMP WITH TIME ZONE NOT NULL, CONSTRAINT "PK_4ef7aa825c6104e95f787636bb8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."assets_type_enum" AS ENUM('current_assets', 'non_current_assets')`);
        await queryRunner.query(`CREATE TABLE "assets" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "business_id" uuid NOT NULL, "name" character varying NOT NULL, "value" integer NOT NULL, "type" "public"."assets_type_enum" NOT NULL, CONSTRAINT "PK_da96729a8b113377cfb6a62439c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "financial_data" ADD CONSTRAINT "UQ_8097b4deddb44b1d7f16372cfdb" UNIQUE ("business_id", "date")`);
        await queryRunner.query(`ALTER TABLE "plans" ADD CONSTRAINT "FK_8e42833817d45fc58598ebe67fd" FOREIGN KEY ("business_id") REFERENCES "business_profiles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "scenarios" ADD CONSTRAINT "FK_683f91e95aa7e6e73b8f4393ac4" FOREIGN KEY ("plan_id") REFERENCES "plans"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "simulations" ADD CONSTRAINT "FK_72b41b7753bef749aaaf65c4825" FOREIGN KEY ("plan_id") REFERENCES "plans"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "simulations" ADD CONSTRAINT "FK_6cc6fcfa3da845cf375a7263089" FOREIGN KEY ("scenario_id") REFERENCES "scenarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "liabilities" ADD CONSTRAINT "FK_139c3ca746c52077655bcacec96" FOREIGN KEY ("business_id") REFERENCES "business_profiles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "conversations" ADD CONSTRAINT "FK_3a9ae579e61e81cc0e989afeb4a" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "assets" ADD CONSTRAINT "FK_93b4c03795f3061361f5d5d4cec" FOREIGN KEY ("business_id") REFERENCES "business_profiles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "assets" DROP CONSTRAINT "FK_93b4c03795f3061361f5d5d4cec"`);
        await queryRunner.query(`ALTER TABLE "conversations" DROP CONSTRAINT "FK_3a9ae579e61e81cc0e989afeb4a"`);
        await queryRunner.query(`ALTER TABLE "liabilities" DROP CONSTRAINT "FK_139c3ca746c52077655bcacec96"`);
        await queryRunner.query(`ALTER TABLE "simulations" DROP CONSTRAINT "FK_6cc6fcfa3da845cf375a7263089"`);
        await queryRunner.query(`ALTER TABLE "simulations" DROP CONSTRAINT "FK_72b41b7753bef749aaaf65c4825"`);
        await queryRunner.query(`ALTER TABLE "scenarios" DROP CONSTRAINT "FK_683f91e95aa7e6e73b8f4393ac4"`);
        await queryRunner.query(`ALTER TABLE "plans" DROP CONSTRAINT "FK_8e42833817d45fc58598ebe67fd"`);
        await queryRunner.query(`ALTER TABLE "financial_data" DROP CONSTRAINT "UQ_8097b4deddb44b1d7f16372cfdb"`);
        await queryRunner.query(`DROP TABLE "assets"`);
        await queryRunner.query(`DROP TYPE "public"."assets_type_enum"`);
        await queryRunner.query(`DROP TABLE "liabilities"`);
        await queryRunner.query(`DROP TYPE "public"."liabilities_type_enum"`);
        await queryRunner.query(`DROP TABLE "simulations"`);
        await queryRunner.query(`DROP TABLE "scenarios"`);
        await queryRunner.query(`DROP TYPE "public"."scenarios_type_enum"`);
        await queryRunner.query(`DROP TABLE "plans"`);
        await queryRunner.query(`ALTER TABLE "financial_data" ADD CONSTRAINT "UQ_8d73a9798db9f7aa21a89c506a3" UNIQUE ("date", "business_id")`);
    }

}
