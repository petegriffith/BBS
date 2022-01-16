import { community } from '../API/apicalls'
import { AccessStore } from './store'

const store = AccessStore()

export const fetchAndSetCommunityProfile = async (communityId: number, language: string = 'en') => {
    store.currentCommunityProfile = await community.getProfileById(communityId, language)
}

export const setCurrentAnonymousUser = (user: anonymousUserProfile) => {
    store.currentAnonymousUser = user
}

export const setAccessToken = (token: string) => {
    store.currentAnonymousUser.access_token = token
}

export const incrementContainerKey = () => {
    store.containerKey.value++
}

export const toggleIsReply = () => {
    store.isReply.value = !store.isReply.value
}

export const setReplyInfo = (replyInfo: replyInfo ) => {
    store.replyInfo.value = replyInfo
}

export const setCurrentCommunityMessages = (messages: communityMessage[]) => {
    store.currentCommunityMessages.value = messages
}