import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Template } from "src/entity/template";
import { MongoRepository } from "typeorm";
import { CreateTemplateDto } from "./dto/create-template.dto";
import { StorageEngineService } from "@fleye-me/nestjs-storage-engine";
var fs = require("fs");
import { ObjectID } from "mongodb";
const carbone = require("carbone");

interface ICarboneOptions{
  convertTo?:String
}

@Injectable()
export class TemplatesService {
  constructor(
    @InjectRepository(Template)
    private readonly templateRepository: MongoRepository<Template>,
    private storageService: StorageEngineService,
  ) {}

  async create(createTemplateDto: CreateTemplateDto): Promise<any> {
    var data = fs.readFileSync(createTemplateDto.fileTemplate.path);
    try {
      const fileResult = await this.storageService.uploadFile({
        filename: `.${createTemplateDto.fileTemplate.extension}`,
        path: `templates/${createTemplateDto.context}`,
        buffer: data,
        mimeType: createTemplateDto.fileTemplate.mimeType,
      });

      const template: Template = new Template();
      template.name = createTemplateDto.name;
      template.generated_name = fileResult.filename;
      template.mimetype = createTemplateDto.fileTemplate.mimeType;
      template.context = createTemplateDto.context;
      template.path = fileResult.path;
      const templateCreated = await template.save();
      return templateCreated;
    } catch (err) {
      throw new BadRequestException();
    }
  }

  async generateFromTemplate(id: string, data,options:ICarboneOptions={}) {
    const existingTemplate: Template = await this.findOne(id);
    return new Promise((resolve, reject) => {
      carbone.render(`uploads/${existingTemplate.path}/${existingTemplate.generated_name}`, data, options, async (err, result) => {
        if (err) reject(err);
        const fileUploaded = await this.storageService.uploadFile({
          filename: `.${options.convertTo ?? existingTemplate.generated_name.split(".")[1]}`,
          path: `templates-generated/${existingTemplate.context}`,
          buffer: result,
        });
        resolve(fileUploaded);
      });
    });
  }

  findAll(): Promise<Template[]> {
    return this.templateRepository.find();
  }

  findOne = async (id: string) => {
    const requestedTemplate = await this.templateRepository.findOne(ObjectID(id));

    if (!requestedTemplate) throw new NotFoundException();
    return requestedTemplate;
  };

  async remove(id: string) {
    const existingTemplate: Template = await this.findOne(id);
    const result = existingTemplate.remove().catch(() => {
      throw new InternalServerErrorException();
    });
    if (result)
      return await this.storageService
        .deleteFile({
          filename: existingTemplate.generated_name,
          path: `Templates/${existingTemplate.context}`,
        })
        .catch(() => {
          throw new NotFoundException("File not found");
        });
  }
}
