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
    bbs_type: "bbs"
}

const currentCommunityMessages: Ref<communityMessage[]> = ref([])

const currentAnonymousUser: anonymousUserProfile = {
    nickname: '',
    country_cd: '',
    lang_cd: 'en',
}

const containerKey = ref(0)

const userAccessToken: string = ''

const isReply = ref(false)

const replyInfo = ref({
    usernameToReplyTo: '',
    messageToReplyTo: '',
    messageIdToReplyTo: '',
})

const store = {
    currentCommunityProfile: currentCommunityProfile,
    currentAnonymousUser: currentAnonymousUser,
    userAccessToken: userAccessToken,
    containerKey: containerKey,
    currentCommunityMessages: currentCommunityMessages,
    isReply: isReply,
    replyInfo: replyInfo,
}

export function AccessStore(){
    return store
}