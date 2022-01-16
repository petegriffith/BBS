import { ref, Ref } from "@vue/reactivity";

const currentCommunityProfile: communityProfile = {
    community_id: 0,
    detail: '',
    icon: null,
    lang_cds: [],
    message: '',
    name: '',
    post_disabled_flg: false,
    success: false,
    total_count: 0,
    bbs_type: 'bbs'
}

const currentLocale: string = 'en'

const currentCommunityMessages: Ref<communityMessage[]> = ref([])

const currentAnonymousUser: localAnonymousUserProfile = {
    nickname: '',
    country_cd: '',
    lang_cd: 'en',
    access_token: '',
    refresh_token: '',
    community_id: 0,
    last_refreshed: new Date().toString()
}

const containerKey = ref(0)

const isReply = ref(false)

const replyInfo = ref({
    usernameToReplyTo: '',
    messageToReplyTo: '',
    messageIdToReplyTo: '',
})

const newMessages = ref(0)
const isError = ref(false)
const errorCode = ref(1)

const store = {
    currentCommunityProfile: currentCommunityProfile,
    currentAnonymousUser: currentAnonymousUser,
    currentLocale: currentLocale,
    containerKey: containerKey,
    currentCommunityMessages: currentCommunityMessages,
    isReply: isReply,
    replyInfo: replyInfo,
    newMessages: newMessages,
    isError: isError,
    errorCode: errorCode
}

export function AccessStore(){
    return store
}