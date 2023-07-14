import cloudinary from "cloudinary"

cloudinary.config({ 
  cloud_name: 'daprsm5el', 
  api_key: '412498544648892', 
  api_secret: 'naGZTRmS8cFMjjA7cX-CA4yJXn0' 
});

export const UploadImage = async (image) => {
  try {
    const { createReadStream } = await image

    return new Promise((resolve, reject)=>{
      const uploadStream = cloudinary.v2.uploader.upload_stream(
        { folder: 'users' },
        (error, result) => {
          if (error) {
            reject(error)
          } else {
            resolve(result)
          }
        }
      );
      createReadStream().pipe(uploadStream);
    })


    // return new Promise((resolve, reject) => {
    //   uploadStream.on('error', reject);
    //   uploadStream.on('finish', resolve);
    // });
  } catch (e) {
    throw e;
  }
};