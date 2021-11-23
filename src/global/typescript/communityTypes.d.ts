interface communityProfile {
    bbs_type: 'bbs' | 'bbs_one_way',
    community_id: number,
    detail: string,
    icon: null,
    lang_cds: string[]
    message: string,
    name: string,
    post_disabled_flg: boolean,
    success: boolean,
    total_count: number
}

interface communityMessageContainer {
    message: string,
    messages: communityMessage[]
    success: boolean
}

interface communityMessage {
    access_id: number,
    anonymous_access_id: null | number,
    change_contents: string,
    change_lang_cd: supportedLanguage,
    content: null | imageObject,
    country_cd: string,
    created_at: string,
    icon: null,
    is_hidden: boolean,
    is_official: boolean,
    message_id: string,
    name: string,
    order: number,
    original_contents: string,
    original_lang_cd: supportedLanguage,
    reply: messageReplyObj | null
}

interface messageReplyObj {
    contents: string,
    message_id: string,
    name: string
}

interface anonymousUserProfile {
    nickname: string,
    country_cd: supportedCountryAlpha,
    lang_cd: string
}

interface imageObject {
    url: string
}

interface replyInfo {
    usernameToReplyTo: string
    messageToReplyTo: string
    messageIdToReplyTo: string
}