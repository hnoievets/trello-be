import { BadRequestError } from '../../errors';

export class CommonHelper {
  static checkIfObjectEmpty(payload: Record<string, any>): void {
    if (!Object.keys(payload).length) {
      throw new BadRequestError('EMPTY_BODY');
    }
  }
}
