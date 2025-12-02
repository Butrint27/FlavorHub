export class CreateRepositoryDto {
    title: string;
    dishType: string;
    ingredience: string;
    image?: Buffer;
    description: string;
    userId: number;
}
