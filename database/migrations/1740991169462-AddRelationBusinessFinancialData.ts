import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRelationBusinessFinancialData1740991169462
  implements MigrationInterface
{
  name = 'AddRelationBusinessFinancialData1740991169462';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "financial_data" ADD "business_id" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "financial_data" DROP CONSTRAINT "UQ_8d73a9798db9f7aa21a89c506a2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "financial_data" ALTER COLUMN "date" TYPE TIMESTAMP WITH TIME ZONE USING "date" AT TIME ZONE 'UTC'`,
    );
    await queryRunner.query(
      `ALTER TABLE "financial_data" ADD CONSTRAINT "FK_6c0d2f944ceb178febd5ac66fc7" FOREIGN KEY ("business_id") REFERENCES "business_profiles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `UPDATE "financial_data" 
               SET "business_id" = (SELECT id FROM business_profiles WHERE financial_data.user_id = business_profiles.user_id)
               WHERE "business_id" is null`,
    );
    await queryRunner.query(
      `ALTER TABLE "financial_data" ADD CONSTRAINT "UQ_8d73a9798db9f7aa21a89c506a3" UNIQUE ("business_id", "date")`,
    );
    await queryRunner.query(
      `ALTER TABLE "financial_data" DROP CONSTRAINT "FK_978296f4f59d95f39835efd1867"`,
    );
    await queryRunner.query(
      `ALTER TABLE "financial_data" DROP COLUMN "user_id"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "financial_data" ADD "user_id" uuid`);
    await queryRunner.query(
      `ALTER TABLE "financial_data" ADD CONSTRAINT "FK_978296f4f59d95f39835efd1867" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `UPDATE "financial_data" 
                 SET "user_id" = (SELECT user_id FROM business_profiles WHERE financial_data.business_id = business_profiles.id)
                 WHERE "user_id" is null`,
    );
    await queryRunner.query(
      `ALTER TABLE "financial_data" DROP CONSTRAINT "FK_6c0d2f944ceb178febd5ac66fc7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "financial_data" DROP CONSTRAINT "UQ_8d73a9798db9f7aa21a89c506a3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "financial_data" ALTER COLUMN "date" TYPE TIMESTAMP USING "date" AT TIME ZONE 'UTC'`,
    );
    await queryRunner.query(
      `ALTER TABLE "financial_data" ADD CONSTRAINT "UQ_8d73a9798db9f7aa21a89c506a2" UNIQUE ("user_id", "date")`,
    );
    await queryRunner.query(
      `ALTER TABLE "financial_data" DROP COLUMN "business_id"`,
    );
  }
}
