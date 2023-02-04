import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { configuration } from "./config/envs/configurations";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TemplatesModule } from "./templates/templates.module";

@Module({
  imports: [
    // Configuration
    // https://docs.nestjs.com/techniques/configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `src/config/envs/development.env`,
      load: [configuration],
    }),
    // Database
    // https://docs.nestjs.com/techniques/database
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        ...config.get("db"),
      }),
      inject: [ConfigService],
    }),
    TemplatesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
