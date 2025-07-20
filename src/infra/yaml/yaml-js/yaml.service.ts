import { Injectable } from '@nestjs/common';
import { parse, stringify } from 'yaml';

@Injectable()
export class YamlService {
  parseYaml(yamlString: string): unknown {
    return parse(yamlString);
  }

  stringifyYaml(data: unknown): string {
    return stringify(data);
  }
}
