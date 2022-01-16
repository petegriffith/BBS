import { AccessStore } from "./store";

const store = AccessStore()

export const getCurrentCommunityProfile = () => {
    return store.currentCommunityProfile
}

export const getCurrentCommunityId = () => {
    return store.currentCommunityProfile.community_id
}

export const getCurrentLocale = () => {
    return store.currentLocale
}

export const getCurrentAnonymousUser = () => {
    return store.currentAnonymousUser
}

export const getAccessToken = () => {
    return store.currentAnonymousUser.access_token
}

export const getRefreshToken = () => {
    return store.currentAnonymousUser.refresh_token
}

export const getContainerKey =() => {
    return store.containerKey
}

export const getIsReplyBool =() => {
    return store.isReply
}

export const getReplyInfo =() => {
    return store.replyInfo
}

export const getCurrentCommunityMessages =() => {
    return store.currentCommunityMessages
}

export const getNewMessageCount = () => {
    return store.newMessages
}

export const getIsError = () => {
    return store.isError
}

export const getErrorCode = () => {
    return store.errorCode
}