import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

/**
 * @module DatabaseModule
 *
 * Bu modul MongoDB ilə əlaqə yaratmaq üçün istifadə olunur.
 *
 * @description
 * MongooseModule.forRootAsync() metodu ilə MongoDB bağlantısı asinxron olaraq qurulur.
 * ConfigService istifadə edilərək MONGODB_URI konfiqurasiya parametri alınır və bağlantı üçün istifadə olunur.
 *
 * @imports
 * - MongooseModule: Mongoose ilə MongoDB bağlantısı yaratmaq üçün istifadə olunur.
 * - ConfigService: Konfiqurasiya parametrlərini əldə etmək üçün istifadə olunur.
 *
 * @class DatabaseModule
 */
@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
