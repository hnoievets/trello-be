import { Injectable } from '@nestjs/common';
import { ConfigService } from '../common/utils/config/config.service';
import { LoggerService } from '../common/utils/logger/logger.service';
import * as aws from '@aws-sdk/client-ses';
import { createTransport, Transporter } from 'nodemailer';
import SESTransport from 'nodemailer/lib/ses-transport';

@Injectable()
export class MailerService {
  private readonly transporter: Transporter<
    SESTransport.SentMessageInfo,
    SESTransport.Options
  >;
  private readonly appEmail: string;
  private readonly frontendUrl: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly loggerService: LoggerService,
  ) {
    this.appEmail = configService.get('AWS_SES_FROM_MAIL');

    const ses = new aws.SES({
      region: this.configService.get('AWS_SES_REGION'),
      credentials: {
        accessKeyId: this.configService.get('AWS_SES_ACCESS_KEY'),
        secretAccessKey: this.configService.get('AWS_SES_KEY_SECRET'),
      },
      apiVersion: '2013-12-01',
    });

    this.transporter = createTransport({
      SES: { ses, aws },
    });

    this.frontendUrl = configService.get('FRONTEND_URL');
  }

  async sendMail(to: string, subject: string, html?: string): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: this.appEmail,
        to,
        subject,
        html,
      });
    } catch (error) {
      this.loggerService.error(`Failed to send email to ${to}`, error.stack);
    }
  }

  sendVerificationMail(to: string, token: string): Promise<void> {
    return this.sendMail(
      to,
      'Verify email for Trello',
      `<p>
        Follow this link to verify: 
        <a href="${this.frontendUrl}/verifying?token=${token}">Click here<a>
      </p>`,
    );
  }
}
