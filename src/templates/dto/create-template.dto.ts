import { IsNotEmpty, IsString, MinLength } from "class-validator";
import { FileSystemStoredFile, HasMimeType, IsFile, MaxFileSize } from "nestjs-form-data";

export class CreateTemplateDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  readonly context: string;

  @IsFile()
  @MaxFileSize(1e6)
  @HasMimeType(["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"])
  fileTemplate: FileSystemStoredFile;
}
