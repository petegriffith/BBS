import { getAccessToken } from '../store/getters'
import { cloud } from '../API/apicalls'
import { refreshUserToken } from './user'
import axios, { AxiosRequestConfig } from 'axios'

export const handleCloudinaryImageUpload = async (file: File): Promise<cloudinaryApiUploadResponse | false> => {
  try {
    const data = await cloud.getCloudinaryToken(getAccessToken())
    const { url, formData, options } = buildCloudinaryDataBundle(file, data)
    const res = await cloud.uploadImageToCloudinary(url, formData, options)
    return res
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.data === 'not authorized') {
      if (await refreshUserToken()) {
        const data = await cloud.getCloudinaryToken(getAccessToken())
        const { url, formData, options } = buildCloudinaryDataBundle(file, data)
        const res = await cloud.uploadImageToCloudinary(url, formData, options)
        return res
      } /* token refresh failed */ else {
        return false
      }
    } /* not 'not authorized' error */ else {
      console.log('unknown error:', err)
      return false
    }
  }
}

const buildCloudinaryDataBundle = (file: File, data: apiSignatureResponseObject): cloudinaryDataBundle => {
  const url = `https://api.cloudinary.com/v1_1/${data.signature.cloud_name}/image/upload`
  const formData = new FormData()

  formData.append('folder', data.signature.folder)
  formData.append('upload_preset', data.signature.upload_preset)
  formData.append('signature', data.signature.signature)
  formData.append('api_key', data.signature.api_key)
  formData.append('timestamp', data.signature.timestamp)
  formData.append('file', file)

  const options: AxiosRequestConfig = {
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
    },
  }
  return { url, formData, options }
}

interface cloudinaryDataBundle {
  url: string
  formData: FormData
  options: AxiosRequestConfig<any>
}
