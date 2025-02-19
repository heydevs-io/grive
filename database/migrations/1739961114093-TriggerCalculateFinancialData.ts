import { MigrationInterface, QueryRunner } from 'typeorm';

export class TriggerCalculateFinancialData1739961114093
  implements MigrationInterface
{
  name = 'TriggerCalculateFinancialData1739961114093';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD "avatar" character varying`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."expenses_type_enum" AS ENUM('fixed', 'variable')`,
    );
    await queryRunner.query(
      `ALTER TABLE "expenses" ADD "type" "public"."expenses_type_enum" NOT NULL DEFAULT 'variable'`,
    );
    await queryRunner.query(
      `ALTER TABLE "business_profiles" DROP COLUMN "focus"`,
    );
    await queryRunner.query(
      `ALTER TABLE "business_profiles" ADD "focus" "public"."business_profiles_focus_enum" array`,
    );
    await queryRunner.query(
      `ALTER TABLE "financial_data" ALTER COLUMN "total_revenue" SET DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "financial_data" ALTER COLUMN "total_expenses" SET DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "financial_data" ALTER COLUMN "total_profit" SET DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "financial_data" ADD CONSTRAINT "UQ_8d73a9798db9f7aa21a89c506a2" UNIQUE ("user_id", "date")`,
    );
    await queryRunner.query(`
            CREATE OR REPLACE FUNCTION calculate_financial_totals()
            RETURNS TRIGGER AS $$
            BEGIN
                -- Calculate total revenue
                UPDATE financial_data
                SET total_revenue = (
                    SELECT COALESCE(SUM(amount), 0)
                    FROM revenue_channels
                    WHERE financial_data_id = NEW.financial_data_id
                    AND deleted_at IS NULL
                ),
                total_expenses = (
                    SELECT COALESCE(SUM(amount), 0)
                    FROM expenses
                    WHERE financial_data_id = NEW.financial_data_id
                    AND deleted_at IS NULL
                )
                WHERE id = NEW.financial_data_id;

                -- Calculate profit
                UPDATE financial_data
                SET total_profit = total_revenue - total_expenses
                WHERE id = NEW.financial_data_id;

                RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;
        `);
    await queryRunner.query(`
            CREATE TRIGGER calculate_totals_revenue
            AFTER INSERT OR UPDATE OR DELETE ON revenue_channels
            FOR EACH ROW
            EXECUTE FUNCTION calculate_financial_totals();
        `);
    await queryRunner.query(`
            CREATE TRIGGER calculate_totals_expense
            AFTER INSERT OR UPDATE OR DELETE ON expenses
            FOR EACH ROW
            EXECUTE FUNCTION calculate_financial_totals();
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "financial_data" DROP CONSTRAINT "UQ_8d73a9798db9f7aa21a89c506a2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "financial_data" ALTER COLUMN "total_profit" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "financial_data" ALTER COLUMN "total_expenses" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "financial_data" ALTER COLUMN "total_revenue" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "business_profiles" DROP COLUMN "focus"`,
    );
    await queryRunner.query(
      `ALTER TABLE "business_profiles" ADD "focus" "public"."business_profiles_focus_enum"`,
    );
    await queryRunner.query(`ALTER TABLE "expenses" DROP COLUMN "type"`);
    await queryRunner.query(`DROP TYPE "public"."expenses_type_enum"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "avatar"`);
    await queryRunner.query(
      `DROP TRIGGER calculate_totals_revenue ON revenue_channels`,
    );
    await queryRunner.query(
      `DROP TRIGGER calculate_totals_expense ON expenses`,
    );
    await queryRunner.query(`DROP FUNCTION calculate_financial_totals()`);
  }
}
