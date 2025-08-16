import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CreateSignalDto {
  @ApiProperty() @IsString() @IsNotEmpty() deviceId: string;
  @ApiProperty() @IsInt() time: number;
  @ApiProperty() @IsInt() @Min(0) dataLength: number;
  @ApiProperty() @IsInt() @Min(0) dataVolume: number;
  @ApiProperty({ required: false }) @IsOptional() stats?: any;
}
