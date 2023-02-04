import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class CreateTemplateDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  readonly context: string;
}
