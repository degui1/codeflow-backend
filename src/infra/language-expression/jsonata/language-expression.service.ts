import { Injectable } from '@nestjs/common';
import * as jsonata from 'jsonata';

@Injectable()
export class LanguageExpressionService {
  evaluateExpression(expression: string, context: any): unknown {
    const jsonataExpr = jsonata(expression);

    return jsonataExpr.evaluate(context);
  }
}
