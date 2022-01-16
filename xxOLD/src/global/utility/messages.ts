import { setCurrentCommunityMessages, incrementContainerKey } from '../store/setters'
import { getCurrentCommunityId } from '../store/getters'
import { community } from '../API/apicalls'
import supportedLanguages from '../supported_languages.json'

export const setMessages = async (communityId: number, lang: string) => {
  try {
    const fetchedMessages: communityMessageContainer = await community.getMessagesById(communityId, lang)
    if (fetchedMessages.success === true) {
      // This filters out messages with the isHidden tag
      const filteredMessages = fetchedMessages.messages.filter((message) => !message.is_hidden)
      setCurrentCommunityMessages(filteredMessages)
    }
    incrementContainerKey()
  } catch (err) {
    alert(err)
  }
}

export const resetMessageLanguage = async (passedLang: supportedLanguage): Promise<string> => {
  await setMessages(getCurrentCommunityId(), passedLang)
  return supportedLanguages.filter((lang) => lang.lang === passedLang)[0].label
}

export const formatDateTime = (dateTime: string): string => {
  // This needs to be added to let the Date object know that it's recieving a UTC time. Without this step, JS won't localize.
  dateTime += ' UTC'

  const postDateTime = new Date(dateTime)
  const result = postDateTime.toLocaleString('ja-JP', { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })
  return result
}

export const scrollToBottom = () => {
  const allPosts = document.getElementsByClassName('single_post')
  const lastPost = allPosts.length - 1
  const element = document.getElementById(`id ${lastPost}`)
  element?.scrollIntoView()
}
