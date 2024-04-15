import { v2 } from 'cloudinary';

v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadImage(FileStream: ArrayBuffer) {
    const uploadResult = await new Promise(resolve => {
        v2.uploader
            .upload_stream((error, uploadResult) => {
                return resolve(uploadResult);
            })
            .end(FileStream);
    });

    console.log(uploadResult);
}
