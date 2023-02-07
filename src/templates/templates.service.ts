import { BadRequestException, HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Template } from "src/entity/template";
import { MongoRepository } from "typeorm";
import { CreateTemplateDto } from "./dto/create-template.dto";
import { UpdateTemplateDto } from "./dto/update-template.dto";
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
      const existingTemplate: Template = await this.findOne(id).catch(()=>{throw new NotFoundException()});
      // const fileUploaded = await carbone.render(`uploads/${existingTemplate.path}/${existingTemplate.generated_name}`, data, {},async (err, result) => {
      //   await this.storageService
      //     .uploadFile({
      //       filename: `.${existingTemplate.generated_name.split(".")[1]}`,
      //       path: `Templates-generated/${existingTemplate.context}`,
      //       buffer: result,
      //       mimeType: existingTemplate.mimetype,
      //   }).catch(()=>{throw new BadRequestException()})
      // });
      this.generateFile(existingTemplate,data, function(location){
        return location
      });
      
  }

  generateFile(existingTemplate:Template,path, fn){
    carbone.render(`uploads/${existingTemplate.path}/${existingTemplate.generated_name}`, path, {},async (err, result) => {
      fn(await this.storageService
        .uploadFile({
          filename: `.${existingTemplate.generated_name.split(".")[1]}`,
          path: `Templates-generated/${existingTemplate.context}`,
          buffer: result,
          mimeType: existingTemplate.mimetype,
      }).catch(()=>{throw new BadRequestException()}))
    })
  }
  
  findAll(): Promise<Template[]> {
    return this.templateRepository.find();
  }

  findOne = async (id: string) => {
    const requestedTemplate = await this.templateRepository.findOne(ObjectID(id));

    if (!requestedTemplate) throw new NotFoundException();
    return requestedTemplate;
  };

  update(id: number, updateTemplateDto: UpdateTemplateDto) {
    return `This action updates a #${id} template`;
  }

  remove(id: number) {
    return `This action removes a #${id} template`;
  }
}
