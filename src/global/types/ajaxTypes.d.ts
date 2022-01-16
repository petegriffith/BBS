interface apiUserTokenResponseObject {
  access_id: string
  access_token: string
  message: string
  refresh_token: string
  success: boolean
}

interface apiEmptyRequestObject {}

interface apiPostRequestObject extends apiEmptyRequestObject {
  community_id: number
  message: string
  original_lang_cd: string
}

interface apiReplyRequestObject extends apiPostRequestObject {
  message_id: string
}

interface apiRefreshRequestObject extends apiEmptyRequestObject {
  refresh_token: string
}

interface apiEmptyResponseObject {}

interface apiPostResponseObject extends apiEmptyResponseObject {
  message: string
  message_id: string
  success: boolean
}

interface apiReplyResponseObject extends apiPostResponseObject {}

interface apiSignatureResponseObject extends apiEmptyResponseObject {
  messsage: string
  signature: cloudinaryApiSignature
  success: boolean
}

interface cloudinaryApiSignature {
  api_key: string
  cloud_name: string
  folder: string
  signature: string
  timestamp: string
  upload_preset: string
}

interface cloudinaryApiUploadResponse {
  public_id: string
  version: number
  signature: string
  width: number
  height: number
  format: string
  resource_type: string
  created_at: string
  tags: Array<string>
  pages: number
  bytes: number
  type: string
  etag: string
  placeholder: boolean
  url: string
  secure_url: string
  access_mode: string
  original_filename: string
  moderation: Array<string>
  access_control: Array<string>
  context: object
  metadata: object
  [futureKey: string]: any
}
