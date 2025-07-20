import { Module } from '@nestjs/common';
import { LanguageExpressionService } from './jsonata/language-expression.service';

@Module({
  providers: [LanguageExpressionService],
  exports: [LanguageExpressionService],
})
export class LanguageExpressionModule {}
