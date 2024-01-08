import { AttachmentInput } from 'API'

export const getDescriptionFromAttachment = (attachment: AttachmentInput) => {
  return attachment.key.split('#')[0]
}

export const hasDeletedAttachments = (attachments: AttachmentInput[] | undefined, description: string) => {
  const descriptions = attachments?.map((attachment) => getDescriptionFromAttachment(attachment))
  return (attachments && attachments.length > 0 && descriptions?.includes(description)) ?? false
}
