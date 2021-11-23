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
  getProfileById: (communityId: number, lang: string): Promise<communityProfile> => requests.get(`https://stg.api.kotozna.chat/bbs/get/profile/${communityId}?lang_cd=${lang}`),
  getMessagesById: (communityId: number, lang: string): Promise<communityMessageContainer> => requests.get(`https://stg.api.kotozna.chat/bbs/get/${communityId}?lang_cd=${lang}&page=0`),
}

export const user = {
  getAnonymousUserToken: (userProfile: anonymousUserProfile): Promise<userTokenObject> => requests.post(`https://stg.api.kotozna.chat/bbs/user/anonymous/create`, userProfile),
  userJoinCommunity: (communityId: number, accessToken: string): Promise<unknown> => requests.post(`https://stg.api.kotozna.chat/bbs/user/join/${communityId}`, {}, accessToken),
}

export const post = {
  postMessageToBBS: (messageBody: ajaxPostObject, accessToken: string): Promise<ajaxPostObject> => requests.post(`https://stg.api.kotozna.chat/bbs/post`, messageBody, accessToken),
  postImageToBBS: (messageBody: ajaxPostObject, accessToken: string): Promise<ajaxPostObject> => requests.post(`https://stg.api.kotozna.chat/bbs/post/image`, messageBody, accessToken),
  replyToBBSMessage: (replyMessageBody: ajaxReplyObject, accessToken: string): Promise<ajaxPostObject> =>
    requests.post(`https://stg.api.kotozna.chat/bbs/reply`, replyMessageBody, accessToken),
  replyWithImageToBBSMessage: (replyMessageBody: ajaxReplyObject, accessToken: string): Promise<ajaxPostObject> =>
    requests.post(`https://stg.api.kotozna.chat/bbs/reply/image`, replyMessageBody, accessToken),
}

export const cloud = {
  getCloudinaryToken: (accessToken: string): Promise<ajaxSignatureResponseObject> => requests.get(`https://stg.api.kotozna.chat/bbs/image/upload`, accessToken),
  uploadImageToCloudinary: (url: string, cloudinaryData: unknown, options: AxiosRequestConfig<any>): Promise<cloudinaryUploadApiResponse> => requests.postCustom(`${url}`, cloudinaryData, options),
}