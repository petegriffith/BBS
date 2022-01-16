/* eslint-disable @typescript-eslint/no-explicit-any */
// NEED TO SORT OUT A BETTER SOLUTION FOR THE ABOVE

import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'

const instance = axios.create({
  timeout: 10000,
})

const responseBody = (response: AxiosResponse<any>) => response.data

const requests = {
  get: (url: string, accessToken?: string) => instance.get(url, { headers: { Authorization: `Bearer ${accessToken}` } }).then(responseBody),
  post: (url: string, data: any, accessToken?: string) => instance.post(url, data, { headers: { Authorization: `Bearer ${accessToken}` } }).then(responseBody),
  postCustom: (url: string, data: any, customHeader: AxiosRequestConfig<any>) => instance.post(url, data, customHeader).then(responseBody),
}

export const community = {
  getProfileById: (communityId: number, lang: string): Promise<communityProfile> => requests.get(`${import.meta.env.VITE_API_URL}bbs/get/profile/${communityId}?lang_cd=${lang}`),
  getMessagesById: (communityId: number, lang: string): Promise<communityMessageContainer> => requests.get(`${import.meta.env.VITE_API_URL}bbs/get/${communityId}?lang_cd=${lang}&page=0`),
}

export const user = {
  getAnonymousUserToken: (userProfile: anonymousUserProfile): Promise<apiUserTokenResponseObject> => requests.post(`${import.meta.env.VITE_API_URL}bbs/user/anonymous/create`, userProfile),
  refreshAccessToken: (refreshToken: apiRefreshRequestObject): Promise<apiUserTokenResponseObject> => requests.post(`${import.meta.env.VITE_API_URL}bbs/user/auth/refresh`, refreshToken),
  userJoinCommunity: (communityId: number, accessToken: string): Promise<unknown> => requests.post(`${import.meta.env.VITE_API_URL}bbs/user/join/${communityId}`, {}, accessToken),
}

export const post = {
  postMessageToBBS: (messageBody: apiPostRequestObject, accessToken: string): Promise<apiPostResponseObject> => requests.post(`${import.meta.env.VITE_API_URL}bbs/post`, messageBody, accessToken),
  postImageToBBS: (messageBody: apiPostRequestObject, accessToken: string): Promise<apiPostResponseObject> => requests.post(`${import.meta.env.VITE_API_URL}bbs/post/image`, messageBody, accessToken),
  replyToBBSMessage: (replyMessageBody: apiReplyRequestObject, accessToken: string): Promise<apiReplyResponseObject> =>
    requests.post(`${import.meta.env.VITE_API_URL}bbs/reply`, replyMessageBody, accessToken),
  replyWithImageToBBSMessage: (replyMessageBody: apiReplyRequestObject, accessToken: string): Promise<apiReplyResponseObject> =>
    requests.post(` ${import.meta.env.VITE_API_URL}bbs/reply/image`, replyMessageBody, accessToken),
}

export const cloud = {
  getCloudinaryToken: (accessToken: string): Promise<apiSignatureResponseObject> => requests.get(`${import.meta.env.VITE_API_URL}bbs/image/upload`, accessToken),
  uploadImageToCloudinary: (url: string, cloudinaryData: unknown, options: AxiosRequestConfig<any>): Promise<cloudinaryApiUploadResponse> => requests.postCustom(`${url}`, cloudinaryData, options),
}
