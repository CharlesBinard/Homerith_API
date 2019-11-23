import cloudinary from 'cloudinary';

export const processUpload= async (upload, tag) => {
    const { createReadStream }= await upload;
    const streamRead = createReadStream()
 
    cloudinary.v2.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    })
 
     let resultUrl = '';
     const cloudinaryUpload = async ({stream}) => {
         try {
             await new Promise((resolve, reject) => {
                 const uniqueFilename = new Date().toISOString();
                 const folderCloudinary = process.env.NODE_ENV ==='production' ? 'prod' : 'dev'
                 const streamLoad = cloudinary.v2.uploader.upload_stream({ 
                     public_id: `${folderCloudinary}/${tag}/${uniqueFilename}`, 
                     tags: tag 
                    }, (error, result) => {
                     if (result) {
                         resultUrl = result.secure_url;
                         resolve(resultUrl)
                     } else {
                         reject(error);
                     }
                 });
 
                 stream.pipe(streamLoad);
             });
         }
         catch (err) {
             throw new Error(`Failed to upload image ! Err:${err.message}`);
         }
     };
 
     await cloudinaryUpload({stream: streamRead});
     return(resultUrl)
 
 };
 
 export default processUpload