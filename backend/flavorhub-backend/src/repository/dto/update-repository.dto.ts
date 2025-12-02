import { PartialType } from '@nestjs/mapped-types';
import { CreateRepositoryDto } from './create-repository.dto';

export class UpdateRepositoryDto extends PartialType(CreateRepositoryDto) {
    title: string;
    dishType: string;
    ingredience: string;
    image?: Buffer;
    description: string;
    userId: number;
}
