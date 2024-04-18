import { Cloudinary } from '@cloudinary/url-gen';
import * as dotenv from 'dotenv';

dotenv.config({ path: '../../../../../.env', debug: true });

export const cldImage = new Cloudinary({
    cloud: {
        cloudName: process.env.CLOUDINARY_CLOUD_NAME ?? 'diq8fxd1l',
        apiKey: process.env.CLOUDINARY_API_KEY ?? '291222151711787',
        apiSecret: process.env.CLOUDINARY_API_SECRET ?? 'RmWAaGMJ941LPM6ju-bkBPMfPxk',
    },
});
