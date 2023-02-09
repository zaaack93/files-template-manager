import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Template } from "src/entity/template";
import { MongoRepository } from "typeorm";
import { CreateTemplateDto } from "./dto/create-template.dto";
import { StorageEngineService } from "@fleye-me/nestjs-storage-engine";
var fs = require("fs");
import { ObjectID } from "mongodb";
const carbone = require("carbone");

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
        path: `Templates/${createTemplateDto.context}`,
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

  async generateFromTemplate(id: string, data) {
    const existingTemplate: Template = await this.findOne(id);
    return new Promise((resolve, reject) => {
      carbone.render(`uploads/${existingTemplate.path}/${existingTemplate.generated_name}`, data, {convertTo : 'pdf'}, async (err, result) => {
        if (err) reject(err);
        // fs is used to create the PDF file from the render result
        fs.writeFileSync('./uploads/Templates-generated/contect-teste/result1.pdf', result);
        resolve('ff');
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
