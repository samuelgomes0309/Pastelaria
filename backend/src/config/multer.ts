import multer from "multer";

export default {
	storage: multer.memoryStorage(),
	limits: {
		fileSize: 5 * 1024 * 1024, // Limite de 5MB
	},
	fileFilter: (
		_req: any,
		file: Express.Multer.File,
		cb: multer.FileFilterCallback
	) => {
		// Permitir apenas arquivos de imagem
		const allowedMimeTypes = ["image/jpeg", "image/png", "image/gif"];
		if (allowedMimeTypes.includes(file.mimetype)) {
			cb(null, true);
		} else {
			cb(new Error("Invalid file type. Only JPEG, PNG and GIF are allowed."));
		}
	},
};
