import { fetchCommunityProfile } from '../utility/community'
import { AccessStore } from './store'

const store = AccessStore()

export const setCommunityProfile = async (communityId: number, language: string = 'en') => {
    const profile = await fetchCommunityProfile(communityId, language)
    if (profile) {
        store.currentCommunityProfile = profile
    }
}

export const setCurrentLocale = (locale: string) => {
    store.currentLocale = locale
}

export const setCurrentAnonymousUser = (user: localAnonymousUserProfile) => {
    store.currentAnonymousUser = user
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

export const incrementNewMessages = (difference: number) => {
    store.newMessages.value += difference
}

export const resetNewMessages = () => {
    store.newMessages.value = 0
}

export const toggleIsError = () => {
    store.isError.value = !store.isError.value
}

export const setErrorCode = (code: number) => {
    store.errorCode.value = code
}