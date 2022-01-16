interface userTokenObject {
  access_id: string
  access_token: string
  message: string
  refresh_token: string
  success: boolean
}

interface ajaxEmptyRequestObject {}

interface ajaxPostObject extends ajaxEmptyRequestObject {
  community_id: number
  message: string
}

interface ajaxReplyObject extends ajaxPostObject {
  message_id: string
}

interface ajaxEmptyResponseObject {}

interface ajaxSignatureResponseObject extends ajaxEmptyResponseObject {
  messsage: string
  signature: cloudinarySignature
  success: boolean
}

interface ajaxPostResponseObject extends ajaxEmptyResponseObject {
  message_id: string
}

interface cloudinarySignature {
  api_key: string
  cloud_name: string
  folder: string
  signature: string
  timestamp: string
  upload_preset: string
}

interface cloudinaryUploadApiResponse {
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
