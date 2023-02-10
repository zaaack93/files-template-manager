import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, ValidationPipe, ParseFilePipe, StreamableFile, Res, NotFoundException, Query } from "@nestjs/common";
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
  create(@Body() template: CreateTemplateDto):Promise<any> {
    return this.templatesService.create(template);
  }

  @Get()
  findAll(): Promise<Template[]> {
    return this.templatesService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string): Promise<Template>  {
    return this.templatesService.findOne(id)
  }

  @Post(":id/generate")
  async generateTemplate(@Param("id") id: string,@Body() data,@Query() options) {
    return this.templatesService.generateFromTemplate(id,data,options)
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.templatesService.remove(id);
  }

}