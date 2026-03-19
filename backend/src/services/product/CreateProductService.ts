import prismaClient from "../../prisma/prismaclient";
import cloudinary from "../../config/cloudinary";
import { Readable } from "node:stream";

interface CreateProductRequest {
	name: string;
	user_id: string;
	price: number;
	description: string;
	category_id: string;
	file: Express.Multer.File;
}

class CreateProductService {
	async execute({
		name,
		price,
		description,
		category_id,
		file,
		user_id,
	}: CreateProductRequest) {
		const categoryExists = await prismaClient.category.findFirst({
			where: {
				id: category_id,
			},
		});
		if (!categoryExists) {
			throw new Error("Category does not exist");
		}
		if (Number.isNaN(price) || price <= 0) {
			throw new Error("Invalid price value");
		}
		const { buffer, originalname } = file;
		let bannerUrl = "";
		try {
			// Upload do arquivo para o Cloudinary usando streams
			const result = await new Promise<any>((resolve, reject) => {
				// Criando o stream de upload
				const uploadStream = cloudinary.uploader.upload_stream(
					{
						folder: `products/${user_id}`,
						resource_type: "image",
						public_id: `${Date.now()}_${originalname.split(".")[0]}`,
					},
					(error, result) => {
						if (error) {
							reject(error);
						} else {
							resolve(result);
						}
					}
				);
				// Convertendo o buffer em um stream legível
				const bufferStream = Readable.from(buffer);
				bufferStream.pipe(uploadStream);
			});
			bannerUrl = result.secure_url;
		} catch (error) {
			throw new Error("Error uploading file");
		}
		const product = await prismaClient.product.create({
			data: {
				name,
				price: Number(price),
				description,
				category_id,
				bannerUrl: bannerUrl,
			},
			select: {
				id: true,
				name: true,
				price: true,
				description: true,
				bannerUrl: true,
				category_id: true,
				createdAt: true,
			},
		});
		return product;
	}
}

export { CreateProductService };
