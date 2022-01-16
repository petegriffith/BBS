import { incrementNewMessages, resetNewMessages, setCurrentCommunityMessages, setCurrentLocale } from '../store/setters'
import { getCurrentCommunityId, getCurrentCommunityMessages } from '../store/getters'
import { community } from '../API/apicalls'
import supportedLanguages from '../../assets/supported_languages.json'

export const setMessages = async (communityId: number, lang: string) => {
  const priorMessages: communityMessage[] = getCurrentCommunityMessages().value
  try {
    const fetchedMessageContainer: communityMessageContainer = await community.getMessagesById(communityId, lang)
    if (fetchedMessageContainer.success === true) {
      const fetchedMessages: communityMessage[] = fetchedMessageContainer.messages
      const filteredMessages: communityMessage[] = fetchedMessages.filter((message) => !message.is_hidden)
      setCurrentCommunityMessages(filteredMessages)
      /* console.log('Most recent message:', filteredMessages[filteredMessages.length - 1]) */
      checkForNewMessages(priorMessages, fetchedMessages)
    }
  } catch (err) {
    alert(err)
  }
}

const checkForNewMessages = (priorMessages: communityMessage[], fetchedMessages: communityMessage[]): void => {
  if (priorMessages[0]) {
    const priorMessagesLastIndex: number = priorMessages[priorMessages.length - 1].order
    const newMessagesLastIndex: number = fetchedMessages[fetchedMessages.length - 1].order
    const newMessageCount: number = newMessagesLastIndex - priorMessagesLastIndex
    for (let i = fetchedMessages.length - 1; i >= fetchedMessages.length - newMessageCount; i--) {
      if (!fetchedMessages[i].is_hidden) {
        incrementNewMessages(1)
      }
    }
  }
}

export const resetMessageLanguage = async (passedLang: supportedLanguage): Promise<string> => {
  await setMessages(getCurrentCommunityId(), passedLang)
  setCurrentLocale(passedLang)
  return supportedLanguages.filter((lang) => lang.lang === passedLang)[0].label
}

export const formatDateTime = (dateTime: string): string => {
  // This needs to be added to let the Date object know that it's recieving a UTC time. Without this step, JS won't localize.
  dateTime += ' UTC'

  const postDateTime = new Date(dateTime)
  const result = postDateTime.toLocaleString('ja-JP', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
  return result
}

export const scrollToBottom = () => {
  const allPosts = document.getElementsByClassName('single_post')
  const lastPost = allPosts.length - 1
  const element = document.getElementById(`id ${lastPost}`)
  resetNewMessages()
  element?.scrollIntoView()
}

export const unescapeHtml = (message: string) => {
  if (typeof message !== 'string') return message

  const patterns = {
    '&lt;': '<',
    '&gt;': '>',
    '&amp;': '&',
    '&quot;': '"',
    '&#x27;': "'",
    '&#x60;': '`',
  }
  // @ts-ignore
  return message.replace(/&(lt|gt|amp|quot|#x27|#x60);/g, (match) => patterns[match])
}
