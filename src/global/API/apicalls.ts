/* eslint-disable @typescript-eslint/no-explicit-any */
// NEED TO SORT OUT A BETTER SOLUTION FOR THE ABOVE

import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'


const instance = axios.create({
  timeout: 10000,
})

console.log('env var:', import.meta.env.VITE_API_URL)

const responseBody = (response: AxiosResponse<any>) => response.data

const requests = {
  get: (url: string, accessToken?: string) => instance.get(url, { headers: { Authorization: `Bearer ${accessToken}` } }).then(responseBody),
  post: (url: string, data: any, accessToken?: string) => instance.post(url, data, { headers: { Authorization: `Bearer ${accessToken}` } }).then(responseBody),
  postCustom: (url: string, data: any, customHeader: AxiosRequestConfig<any>) => instance.post(url, data, customHeader).then(responseBody),
}

export const community = {
  getProfileById: (communityId: number, lang: string): Promise<communityProfile> => requests.get(`${import.meta.env.VITE_API_URL}get/profile/${communityId}?lang_cd=${lang}`),
  getMessagesById: (communityId: number, lang: string): Promise<communityMessageContainer> => requests.get(`${import.meta.env.VITE_API_URL}get/${communityId}?lang_cd=${lang}&page=0`),
}

console.log(community.getMessagesById)

export const user = {
  getAnonymousUserToken: (userProfile: anonymousUserProfile): Promise<userTokenObject> => requests.post(`${import.meta.env.VITE_API_URL}user/anonymous/create`, userProfile),
  userJoinCommunity: (communityId: number, accessToken: string): Promise<unknown> => requests.post(`${import.meta.env.VITE_API_URL}user/join/${communityId}`, {}, accessToken),
}

export const post = {
  postMessageToBBS: (messageBody: ajaxPostObject, accessToken: string): Promise<ajaxPostObject> => requests.post(`${import.meta.env.VITE_API_URL}post`, messageBody, accessToken),
  postImageToBBS: (messageBody: ajaxPostObject, accessToken: string): Promise<ajaxPostObject> => requests.post(`${import.meta.env.VITE_API_URL}post/image`, messageBody, accessToken),
  replyToBBSMessage: (replyMessageBody: ajaxReplyObject, accessToken: string): Promise<ajaxPostObject> => requests.post(`${import.meta.env.VITE_API_URL}reply`, replyMessageBody, accessToken),
  replyWithImageToBBSMessage: (replyMessageBody: ajaxReplyObject, accessToken: string): Promise<ajaxPostObject> =>
    requests.post(` ${import.meta.env.VITE_API_URL}reply/image`, replyMessageBody, accessToken),
}

export const cloud = {
  getCloudinaryToken: (accessToken: string): Promise<ajaxSignatureResponseObject> => requests.get(`${import.meta.env.VITE_API_URL}image/upload`, accessToken),
  uploadImageToCloudinary: (url: string, cloudinaryData: unknown, options: AxiosRequestConfig<any>): Promise<cloudinaryUploadApiResponse> => requests.postCustom(`${url}`, cloudinaryData, options),
}
