import { getAccessToken } from "../store/getters"
import { cloud } from "../API/apicalls"
import { AxiosRequestConfig } from "axios"

export const uploadImageToCloudinary = async (file: File): Promise<cloudinaryUploadApiResponse> => {
    const accessToken = getAccessToken()
    const data = await cloud.getCloudinaryToken(accessToken)
  
    const url = `https://api.cloudinary.com/v1_1/${data.signature.cloud_name}/image/upload`
    const formData = new FormData()
  
    formData.append('folder', data.signature.folder);  
    formData.append("upload_preset", data.signature.upload_preset);
    formData.append('signature', data.signature.signature)
    formData.append('api_key', data.signature.api_key)
    formData.append('timestamp', data.signature.timestamp)
    formData.append('file', file)
  
    const options: AxiosRequestConfig = {
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
      },
    }
    const res = await cloud.uploadImageToCloudinary(url, formData, options) 
    return res
  }
  