import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Template } from "src/entity/template";
import { MongoRepository } from "typeorm";
import { CreateTemplateDto } from "./dto/create-template.dto";
import { UpdateTemplateDto } from "./dto/update-template.dto";
import { StorageEngineService } from "@fleye-me/nestjs-storage-engine";
var fs = require("fs");
import { ObjectID } from "mongodb"
const carbone = require('carbone');

@Injectable()
export class TemplatesService {
  constructor(
    @InjectRepository(Template)
    private readonly templateRepository: MongoRepository<Template>,
    private storageService: StorageEngineService,
  ) { }

  async create(createTemplateDto: CreateTemplateDto): Promise<any> {
    var data = fs.readFileSync(createTemplateDto.fileTemplate.path);
    return new Promise(async (resolve, reject) => {
      try {
        this.storageService.uploadFile({
          filename: `.${createTemplateDto.fileTemplate.extension}`,
          path: `Templates/${createTemplateDto.context}`,
          buffer: data,
          mimeType: createTemplateDto.fileTemplate.mimeType,
        }).then(async (fileResult) => {
          const template: Template = new Template();
          template.name = createTemplateDto.name;
          template.generated_name = fileResult.filename;
          template.mimetype = createTemplateDto.fileTemplate.mimeType;
          template.context = createTemplateDto.context;
          template.path = fileResult.path;
          const templateCreated = await template.save();
          resolve(templateCreated)
        });
      }
      catch (err) {
        reject({ message: "error has been occurred" })
      }
    })
  }

  async generateFromTemplate(id: string,data) {
    return new Promise(async (resolve, reject) => {
    try {
      const existingTemplate = await this.templateRepository.findOneBy({
        _id: ObjectID(id)
      });

      if (!existingTemplate) {
        throw new HttpException(
          'Template not found',
          HttpStatus.BAD_REQUEST,
        );
      }
      else {
        await carbone.render(`uploads/${existingTemplate.path}/${existingTemplate.generated_name}`, data ,{}, (err, result)=> {
          this.storageService.uploadFile({
            filename: `.${existingTemplate.generated_name.split('.')[1]}`,
            path: `Templates-generated/${existingTemplate.context}`,
            buffer: result,
            mimeType: existingTemplate.mimetype,
          }).then(async (fileResult) => {
            resolve(fileResult)
          });
        })
      }
    }
    catch (err) {
      throw new HttpException(
        'error has been occurred',
        HttpStatus.BAD_REQUEST,
      );
    }
  })
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
