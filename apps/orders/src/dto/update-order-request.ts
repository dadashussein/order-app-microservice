import {
  IsNotEmpty,
  IsPhoneNumber,
  IsPositive,
  IsString,
  IsOptional,
} from 'class-validator';

export class UpdateOrderRequest {
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  name?: string;

  @IsPositive()
  @IsOptional()
  price?: number;

  @IsPhoneNumber()
  @IsOptional()
  phoneNumber?: string;
}
