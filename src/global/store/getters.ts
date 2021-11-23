import { AccessStore } from "./store";

const store = AccessStore()

export const getCurrentCommunityProfile = () => {
    return store.currentCommunityProfile
}

export const getCurrentCommunityId = () => {
    return store.currentCommunityProfile.community_id
}

export const getCurrentAnonymousUser = () => {
    return store.currentAnonymousUser
}

export const getAccessToken = () => {
    return store.userAccessToken
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