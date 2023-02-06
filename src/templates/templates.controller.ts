import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, ValidationPipe, ParseFilePipe, StreamableFile, Res } from "@nestjs/common";
import { TemplatesService } from "./templates.service";
import { CreateTemplateDto } from "./dto/create-template.dto";
import { UpdateTemplateDto } from "./dto/update-template.dto";
import { Template } from "src/entity/template";
import { FormDataRequest, FileSystemStoredFile } from "nestjs-form-data";
import { createReadStream } from "fs";
import { join } from "path";
import { UploadFileDto } from "@fleye-me/nestjs-storage-engine/dist/dtos/uploadFile.dto";
import type { Response } from 'express';
import { UploadedFileDto } from "@fleye-me/nestjs-storage-engine";

@Controller("templates")
export class TemplatesController {
  constructor(private readonly templatesService: TemplatesService) {}

  @Post()
  @FormDataRequest({ storage: FileSystemStoredFile })
  create(@Body() template: CreateTemplateDto):Promise<any> {
    return this.templatesService.create(template);
  }

  @Get()
  findAll(): Promise<Template[]> {
    return this.templatesService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.templatesService.findOne(+id);
  }

  @Post(":id/generate")
  async generateTemplate(@Param("id") id: string,@Body() data,@Res({ passthrough: true }) response: Response) {
    const fileUploaded =await this.templatesService.generateFromTemplate(id,data)
    return fileUploaded
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateTemplateDto: UpdateTemplateDto) {
    return this.templatesService.update(+id, updateTemplateDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.templatesService.remove(+id);
  }
}
