import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Template } from "src/entity/template";
import { MongoRepository } from "typeorm";
import { UpdateTemplateDto } from "./dto/update-template.dto";

@Injectable()
export class TemplatesService {
  constructor(
    @InjectRepository(Template)
    private readonly templateRepository: MongoRepository<Template>,
  ) {}

  async create(template: Template) {
    const createTemplate = await this.templateRepository.save(template);
    return createTemplate;
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
