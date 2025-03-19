// Here we get files from user in local storage and then upload them to cloudinary
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

(async function () {

    // Configuration
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY``,
        api_secret: process.env.CLOUDINARY_API_SECRET
    });

    const uploadOnCloudinary = async (localFilePath) => {
        try {
            if (!localFilePath) return null
            // Upload the file on cloudinary
            const uploadedFile = await cloudinary.uploader.upload(localFilePath, { resource_type: 'auto' });

            console.log('File has been uploaded successfully!', uploadedFile.url);
            return uploadedFile
        } catch (error) {
            // Remove the locally saved temporary file  after being uploaded on cloudinary
            fs.unlinkSync(localFilePath);
        }
    }
})();