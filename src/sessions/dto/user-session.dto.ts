export class UserSessionDto {
  constructor(data: any) {
    this.userId = data.userId;
    this.sessionId = data.sessionId;
  }

  readonly userId: number;
  readonly sessionId: string;
}
