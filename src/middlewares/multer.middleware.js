import multer from "multer"; // Importing multer for handling file uploads

// Configuring storage for multer
const storage = multer.diskStorage({
    // Setting the destination folder where uploaded files will be stored
    destination: function (req, file, cb) {
        cb(null, "./public/temp"); // Files will be stored in the 'public/temp' directory
    },
    // Setting the filename for uploaded files
    filename: function (req, file, cb) {
        cb(null, file.originalname); // Keeping the original filename
    }
});

// Creating an upload middleware with the defined storage configuration
export const upload = multer({ storage });
