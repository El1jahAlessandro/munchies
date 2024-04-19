import { cloudinaryResponseSchema } from '@/lib/schemas/common.schema';
import cloudinary from '@/lib/utils/cloudinary';

export async function uploadImage(file: File, folder: string) {
    const arrayBuffer = await file.arrayBuffer();
    const byteArray = new Uint8Array(arrayBuffer);
    const cloudinaryResponse = await new Promise(resolve => {
        cloudinary.uploader
            .upload_stream({ folder }, (error, uploadResult) => {
                return resolve(uploadResult);
            })
            .end(byteArray);
    });

    return cloudinaryResponseSchema.parse(cloudinaryResponse);
}
