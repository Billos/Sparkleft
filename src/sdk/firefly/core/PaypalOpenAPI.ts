import { env } from '../../../config';
import type { OpenAPIConfig } from './OpenAPI';

export const PaypalOpenAPI: OpenAPIConfig = {
    BASE: `${env.fireflyUrl}/api`,
    VERSION: '6.4.17',
    WITH_CREDENTIALS: false,
    CREDENTIALS: 'include',
    HEADERS: {
        Authorization: `Bearer ${env.fireflyPaypalAccountToken}`,
    },
    ENCODE_PATH: undefined,
};
