// Here we get files from the user in local storage and then upload them to Cloudinary
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

// Cloudinary Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;

        // Upload the file to Cloudinary
        const uploadedFile = await cloudinary.uploader.upload(localFilePath, { resource_type: 'auto' });

        console.log('File has been uploaded successfully!', uploadedFile.url);
        return uploadedFile;
    } catch (error) {
        console.error('Cloudinary Upload Error:', error);

        // Remove the locally saved temporary file after a failed upload
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }

        return null;
    }
};

export { uploadOnCloudinary };
