import { MigrationInterface, QueryRunner } from "typeorm";

export class Auto1764678262327 implements MigrationInterface {
    name = 'Auto1764678262327'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`repository\` (\`id\` int NOT NULL AUTO_INCREMENT, \`title\` varchar(255) NOT NULL, \`dishType\` varchar(255) NOT NULL, \`ingredience\` varchar(255) NOT NULL, \`image\` longblob NULL, \`description\` varchar(255) NOT NULL, \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`userId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`repository\` ADD CONSTRAINT \`FK_19cf11998e1776961d150dbdd43\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`repository\` DROP FOREIGN KEY \`FK_19cf11998e1776961d150dbdd43\``);
        await queryRunner.query(`DROP TABLE \`repository\``);
    }

}
