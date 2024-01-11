import { IsNotEmpty } from 'class-validator';
export class ConfirmEmailDto {
  @IsNotEmpty()
  readonly userId: number;
}