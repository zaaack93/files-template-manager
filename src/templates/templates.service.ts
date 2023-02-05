import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Template } from "src/entity/template";
import { MongoRepository } from "typeorm";
import { CreateTemplateDto } from "./dto/create-template.dto";
import { UpdateTemplateDto } from "./dto/update-template.dto";
import { StorageEngineService } from "@fleye-me/nestjs-storage-engine";

@Injectable()
export class TemplatesService {
  constructor(
    @InjectRepository(Template)
    private readonly templateRepository: MongoRepository<Template>,
    private storageService: StorageEngineService,
  ) {}

  async create(createTemplateDto: CreateTemplateDto) {
    console.log(createTemplateDto.fileTemplate);
    const fileResult = await this.storageService.uploadFile({
      filename: "example",
      path: `Templates/${createTemplateDto.context}`,
      buffer: createTemplateDto.fileTemplate.path,
      mimeType: "application/pdf",
    });
    console.log(fileResult);
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
