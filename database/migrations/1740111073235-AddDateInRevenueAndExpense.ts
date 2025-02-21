import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDateInRevenueAndExpense1740111073235
  implements MigrationInterface
{
  name = 'AddDateInRevenueAndExpense1740111073235';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "expenses" ADD "date" TIMESTAMP WITH TIME ZONE NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "revenue_channels" ADD "date" TIMESTAMP WITH TIME ZONE NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "business_profiles" DROP COLUMN "founded_date"`,
    );
    await queryRunner.query(
      `ALTER TABLE "business_profiles" ADD "founded_date" TIMESTAMP WITH TIME ZONE`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."expenses_type_enum" RENAME TO "expenses_type_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."expenses_type_enum" AS ENUM('FIXED', 'VARIABLE')`,
    );
    await queryRunner.query(
      `ALTER TABLE "expenses" ALTER COLUMN "type" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "expenses" ALTER COLUMN "type" TYPE "public"."expenses_type_enum" USING "type"::"text"::"public"."expenses_type_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "expenses" ALTER COLUMN "type" SET DEFAULT 'VARIABLE'`,
    );
    await queryRunner.query(`DROP TYPE "public"."expenses_type_enum_old"`);
    await queryRunner.query(
      `ALTER TABLE "expenses" ADD CONSTRAINT "UQ_bbbb042a7cf9481e1860934d0c5" UNIQUE ("date", "financial_data_id", "title")`,
    );
    await queryRunner.query(
      `ALTER TABLE "revenue_channels" ADD CONSTRAINT "UQ_02ae6a11b752d6458884ff301fd" UNIQUE ("date", "financial_data_id", "channel")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "revenue_channels" DROP CONSTRAINT "UQ_02ae6a11b752d6458884ff301fd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "expenses" DROP CONSTRAINT "UQ_bbbb042a7cf9481e1860934d0c5"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."expenses_type_enum_old" AS ENUM('fixed', 'variable')`,
    );
    await queryRunner.query(
      `ALTER TABLE "expenses" ALTER COLUMN "type" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "expenses" ALTER COLUMN "type" TYPE "public"."expenses_type_enum_old" USING "type"::"text"::"public"."expenses_type_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "expenses" ALTER COLUMN "type" SET DEFAULT 'variable'`,
    );
    await queryRunner.query(`DROP TYPE "public"."expenses_type_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."expenses_type_enum_old" RENAME TO "expenses_type_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "business_profiles" DROP COLUMN "founded_date"`,
    );
    await queryRunner.query(
      `ALTER TABLE "business_profiles" ADD "founded_date" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "revenue_channels" DROP COLUMN "date"`,
    );
    await queryRunner.query(`ALTER TABLE "expenses" DROP COLUMN "date"`);
  }
}
