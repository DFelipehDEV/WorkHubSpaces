const awsS3 = require("@aws-sdk/client-s3");
const awsPresigner = require("@aws-sdk/s3-request-presigner");

const S3 = new awsS3.S3Client({
    region: "auto",
    endpoint: process.env.S3_API_URL,
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    },
    forcePathStyle: true,
    requestChecksumCalculation: "WHEN_REQUIRED",
});

exports.getUploadUrl = async (req, res) => {
    try {
        const fileName = (Date.now() + Math.random()).toString();
        const contentType = req.query.contentType || "image/png";

        const putUrl = await awsPresigner.getSignedUrl(
            S3,
            new awsS3.PutObjectCommand({
                Bucket: process.env.R2_BUCKET_NAME,
                Key: fileName,
                ContentType: contentType,
            }),
            {
                expiresIn: 3600,
                unhoistableHeaders: new Set(["x-amz-sdk-checksum-algorithm", "x-amz-checksum-crc32"])
            }
        );

        return res.status(200).json({
            uploadUrl: putUrl,
            key: fileName,
            publicUrl: process.env.R2_PUBLIC_URL
        });
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
}
