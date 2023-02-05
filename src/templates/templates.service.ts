import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Template } from "src/entity/template";
import { MongoRepository } from "typeorm";
import { CreateTemplateDto } from "./dto/create-template.dto";
import { UpdateTemplateDto } from "./dto/update-template.dto";
import { StorageEngineService } from "@fleye-me/nestjs-storage-engine";
var fs = require("fs");

@Injectable()
export class TemplatesService {
  constructor(
    @InjectRepository(Template)
    private readonly templateRepository: MongoRepository<Template>,
    private storageService: StorageEngineService,
  ) {}

  async create(createTemplateDto: CreateTemplateDto) {
    var data = fs.readFileSync(createTemplateDto.fileTemplate.path);
    const fileResult = await this.storageService.uploadFile({
      filename: `.${createTemplateDto.fileTemplate.extension}`,
      path: `Templates/${createTemplateDto.context}`,
      buffer: data,
      mimeType: createTemplateDto.fileTemplate.mimeType,
    });
    return fileResult;
  }

  findAll(): Promise<Template[]> {
    return this.templateRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} template`;
  }

  update(id: number, updateTemplateDto: UpdateTemplateDto) {
    return `This action updates a #${id} template`;
  }

  remove(id: number) {
    return `This action removes a #${id} template`;
  }
}
