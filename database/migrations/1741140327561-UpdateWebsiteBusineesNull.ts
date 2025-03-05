import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateWebsiteBusineesNull1741140327561
  implements MigrationInterface
{
  name = 'UpdateWebsiteBusineesNull1741140327561';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "business_profiles" ALTER COLUMN "website" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "business_profiles" ALTER COLUMN "website" SET NOT NULL`,
    );
  }
}
