import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '../config/config.service';

export async function setupSwagger(app: INestApplication, configService: ConfigService): Promise<void> {
    const config = new DocumentBuilder()
        .setTitle(configService.get('SWAGGER_TITLE'))
        .setVersion('1.0')
        .addServer(configService.get('SWAGGER_BACKEND_URL'))
        .addBearerAuth()
        .build();

    const document = SwaggerModule.createDocument(app, config);

    SwaggerModule.setup(
        'swagger',
        app,
        document,
        {
            swaggerOptions: {
                displayOperationId: true,
            },
        }
    );
}
