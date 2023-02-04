import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, ValidationPipe, ParseFilePipe } from "@nestjs/common";
import { TemplatesService } from "./templates.service";
import { CreateTemplateDto } from "./dto/create-template.dto";
import { UpdateTemplateDto } from "./dto/update-template.dto";
import { Template } from "src/entity/template";
import { FormDataRequest, FileSystemStoredFile } from "nestjs-form-data";

@Controller("templates")
export class TemplatesController {
  constructor(private readonly templatesService: TemplatesService) {}

  @Post()
  @FormDataRequest({ storage: FileSystemStoredFile })
  create(@Body() template: CreateTemplateDto) {
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

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateTemplateDto: UpdateTemplateDto) {
    return this.templatesService.update(+id, updateTemplateDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.templatesService.remove(+id);
  }
}
