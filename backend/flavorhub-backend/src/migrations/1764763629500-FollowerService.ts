import { MigrationInterface, QueryRunner } from "typeorm";

export class FollowerService1764763629500 implements MigrationInterface {
    name = 'FollowerService1764763629500'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`follower\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`userId\` int NULL, \`followsUserId\` int NULL, UNIQUE INDEX \`IDX_a433eda4a29979f136d04fae26\` (\`userId\`, \`followsUserId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`follower\` ADD CONSTRAINT \`FK_6fe328c3c08b70a5c9c79348839\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`follower\` ADD CONSTRAINT \`FK_0305dac1350924947c93b544c18\` FOREIGN KEY (\`followsUserId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`follower\` DROP FOREIGN KEY \`FK_0305dac1350924947c93b544c18\``);
        await queryRunner.query(`ALTER TABLE \`follower\` DROP FOREIGN KEY \`FK_6fe328c3c08b70a5c9c79348839\``);
        await queryRunner.query(`DROP INDEX \`IDX_a433eda4a29979f136d04fae26\` ON \`follower\``);
        await queryRunner.query(`DROP TABLE \`follower\``);
    }

}
