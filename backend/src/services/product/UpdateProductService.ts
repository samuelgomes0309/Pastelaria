import { Readable } from "node:stream";
import cloudinary from "../../config/cloudinary";
import prismaClient from "../../prisma/prismaclient";

interface UpdateProductRequest {
	name?: string;
	user_id: string;
	price?: number;
	description?: string;
	product_id: string;
	file?: Express.Multer.File;
}

class UpdateProductService {
	async execute({
		product_id,
		name,
		price,
		description,
		file,
		user_id,
	}: UpdateProductRequest) {
		const product = await prismaClient.product.findUnique({
			where: {
				id: product_id,
			},
		});
		if (!product) {
			throw new Error("Product does not exist");
		}
		let bannerUrl: string | undefined = undefined;
		if (file) {
			const { buffer, originalname } = file;
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
		}
		const updatedProduct = await prismaClient.product.update({
			where: {
				id: product_id,
			},
			data: {
				name: name ?? product.name,
				price: price !== undefined ? Number(price) : product.price,
				description: description ?? product.description,
				bannerUrl: bannerUrl ?? product.bannerUrl,
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
		return updatedProduct;
	}
}

export { UpdateProductService };
