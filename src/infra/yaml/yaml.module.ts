import { Module } from '@nestjs/common';
import { YamlService } from './yaml-js/yaml.service';

@Module({
  providers: [YamlService],
  exports: [YamlService],
})
export class YamlModule {}
