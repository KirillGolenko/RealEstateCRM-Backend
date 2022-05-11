import { IsNotEmpty } from 'class-validator';

export class MessageDto {
  @IsNotEmpty()
  recipient: number;

  @IsNotEmpty()
  message: string;
}
