import { Injectable } from '@nestjs/common';
import jsonnata from 'jsonata';

@Injectable()
export class LanguageExpressionService {
  evaluateExpression(expression: string, context: any): unknown {
    const jsonataExpr = jsonnata(expression);

    return jsonataExpr.evaluate(context);
  }
}
