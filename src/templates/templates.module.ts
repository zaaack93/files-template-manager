import { Module } from "@nestjs/common";
import { TemplatesService } from "./templates.service";
import { TemplatesController } from "./templates.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Template } from "src/entity/template";
import { NestjsFormDataModule } from "nestjs-form-data";

@Module({
  imports: [
    TypeOrmModule.forFeature([Template]),
    // Files
    NestjsFormDataModule,
  ],
  controllers: [TemplatesController],
  providers: [TemplatesService],
})
export class TemplatesModule {}
