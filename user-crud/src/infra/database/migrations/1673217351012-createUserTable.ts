import { MigrationInterface, QueryRunner } from 'typeorm';

export class createUserTable1673217351012 implements MigrationInterface {
  name = 'createUserTable1673217351012';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(),"name" character varying NOT NULL, "email" character varying NOT NULL,"password" character varying NOT NULL, "type" character varying NOT NULL, "phone" character varying NOT NULL, "cpf" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "version" integer NOT NULL, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
