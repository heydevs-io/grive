import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddConversation1741072144297 implements MigrationInterface {
  name = 'AddConversation1741072144297';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "conversations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "user_id" uuid NOT NULL, "dify_conversation_id" character varying NOT NULL, "dify_conversation_name" character varying NOT NULL, CONSTRAINT "REL_3a9ae579e61e81cc0e989afeb4" UNIQUE ("user_id"), CONSTRAINT "PK_ee34f4f7ced4ec8681f26bf04ef" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "conversations"`);
  }
}
