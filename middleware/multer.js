const multer = require('multer');

const storageSickness = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/sicknessPermit/');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const storageLeave = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/leaveApplication/');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const storageExternal = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/externalApplication/');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

// Inisialisasi multer dengan konfigurasi storage untuk setiap jenis aplikasi
const uploadSickness = multer({
    storage: storageSickness,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB sebagai contoh ukuran maksimum
}).single('file');
const uploadLeave = multer({
    storage: storageLeave,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB sebagai contoh ukuran maksimum
}).single('file');
const uploadExternal = multer({
    storage: storageExternal,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB sebagai contoh ukuran maksimum
}).single('file');

module.exports = {
    uploadSickness,
    uploadLeave,
    uploadExternal
};