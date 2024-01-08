interface BreakwordsProps {
  maxWordLength: number
  text: string | undefined
}

// if single word is longer then maxWordLength, break word
export const breakWords = ({ maxWordLength, text }: BreakwordsProps) => {
  return text &&
    text
      .split('disruptionList. ')
      .map((i) => i.length > maxWordLength)
      .includes(true)
    ? 'break-word'
    : 'normal'
}
