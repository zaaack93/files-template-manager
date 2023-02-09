import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { configuration } from "./config/envs/configurations";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TemplatesModule } from "./templates/templates.module";
import { StorageEngineModule } from "@fleye-me/nestjs-storage-engine";
import path from "path";

@Module({
  imports: [
    // Configuration
    // https://docs.nestjs.com/techniques/configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `${process.env.NODE_ENV}.env`,
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
    //files service engine
    StorageEngineModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory(config: ConfigService) {
        return {
          providerEngineName: "disk",
          disk: {
            // below is path to save files
            uploadsFolder: path.resolve(__dirname, "..", "uploads"),
            serverStaticFilesBaseUrl: config.get("SERVER_STATIC_FILES_BASE_URL"),
          },
        };
      },
    }),
    TemplatesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
