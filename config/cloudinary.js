require("dotenv").config();
const cloudinary = require("cloudinary").v2;

cloudinary.config({
	cloud_name: process.env.CLOUD_NAME,
	api_key: process.env.API_KEY,
	api_secret: process.env.API_SECRET,
});

async function handleUpload(files) {
	try {
		const uploadPromises = files.map(async (file) => {
			const b64 = Buffer.from(file.buffer).toString("base64");
			const dataURI = "data:" + file.mimetype + ";base64," + b64;
			const res = await cloudinary.uploader.upload(dataURI, {
				resource_type: "auto",
			});
			return res;
		});

		const results = await Promise.all(uploadPromises);
		return results;
	} catch (error) {
		throw new Error(`Cloudinary upload failed: ${error.message}`);
	}
}

module.exports = { handleUpload };
