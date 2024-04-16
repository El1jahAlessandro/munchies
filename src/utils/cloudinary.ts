import { v2 } from 'cloudinary';
import { cloudinaryResponseSchema } from '@/schemas/common.schema';

v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadImage(File: File) {
    const arrayBuffer = await File.arrayBuffer();
    const byteArray = new Uint8Array(arrayBuffer);
    const cloudinaryResponse = await new Promise(resolve => {
        v2.uploader
            .upload_stream((error, uploadResult) => {
                return resolve(uploadResult);
            })
            .end(byteArray);
    });

    return cloudinaryResponseSchema.parse(cloudinaryResponse);
}
