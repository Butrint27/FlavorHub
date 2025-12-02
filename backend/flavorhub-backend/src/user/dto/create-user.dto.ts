import { Matches } from "class-validator";

export class CreateUserDto {
  fullName: string;
  email: string;
  password: string;
  avatar?: Buffer;
}
