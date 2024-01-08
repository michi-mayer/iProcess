interface TruncateTextProps {
  maxTextLength: number
  text: string | undefined | null
}

// if all text is longer then maxTextLength, truncate text
export const truncateText = ({ maxTextLength, text }: TruncateTextProps) => {
  return text && text.length > maxTextLength ? `${text?.slice(0, Math.max(0, maxTextLength))}...` : text
}
