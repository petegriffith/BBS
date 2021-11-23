import axios from 'axios'
export const extractPhotoFile = (event: Event): File | undefined => {
  // error handling needed:
  if (event.target === null) return
  let files = (<HTMLInputElement>event.target).files
  // error handling needed:
  if (files === null || !files.length) return
  return files[0]
}

export const downloadImage = async (imageURL: string): Promise<void> => {
  const response = await axios.get(imageURL, { responseType: 'blob' })
  const filetype = response.headers['content-type'].substring(6)
  const blob = new Blob([response.data], { type: 'application/pdf' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `download.${filetype}`
  link.click()
  URL.revokeObjectURL(link.href)
}
