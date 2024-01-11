import { IsEmail, IsNotEmpty } from 'class-validator';
export class ConfirmEmailDto {
  @IsEmail()
  readonly email: string;
}