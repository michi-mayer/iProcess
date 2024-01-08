import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Box, Button, Grid, LinearProgress, Stack, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import { getDescriptionFromAttachment, hasDeletedAttachments } from './helper/utils'
import { AttachmentInput } from 'API'
import CloudUploadIcon from 'components/Icons/CloudUploadIcon'
import { useAuth } from 'contexts/authContext'
import { compareDeep } from 'helper/utils'
import useMutateFile from 'hooks/services/useMutateFile'
import { colors } from 'theme'
import AttachedFile from './AttachedFile'

const Container = styled('div')({
  borderRadius: '4px',
  flex: 1
})

const StyledButton = styled(Button)({
  margin: 0,
  padding: 0,
  '.MuiButton-startIcon': {
    display: 'flex',
    marginRight: 0,
    marginLeft: 0,
    paddingBottom: 4
  }
})

type errorType = 'errorUploadingFile' | 'wrongFormat'

interface Props {
  description: string
  onUploadFile: (attachments: AttachmentInput[]) => void
  onDeleteFile: (attachments: AttachmentInput) => void
  onRestoreFile: (index: number) => void
  onError: (error: errorType) => void
  name: string
  attachments: AttachmentInput[]
  deletedFiles: AttachmentInput[]
  acceptedFileType?: string
  validateAcceptedFileType?: (files: File[], acceptedFileType: string) => boolean
}

const UploadFiles = ({
  description,
  onUploadFile,
  onDeleteFile,
  onRestoreFile,
  onError,
  attachments,
  deletedFiles,
  acceptedFileType = '*',
  validateAcceptedFileType = () => true
}: Props) => {
  const { t } = useTranslation('measures')
  const [totalUploaded, setTotalUploaded] = useState<number>(0)
  const [uploadedAttachments, setUploadedAttachments] = useState<AttachmentInput[]>([...attachments])
  const [isDragging, setIsDragging] = useState<boolean>(false)
  const inputRef = useRef<HTMLInputElement | null>(null)

  const { mutate, isSuccess, isPending } = useMutateFile((progress) => {
    const total = progress.total
    const loaded = progress.loaded
    const totalProgress = (100 * loaded) / total
    setTotalUploaded(totalProgress)
  })

  const { authInfo } = useAuth()
  const userName = authInfo?.userName ?? 'Unknown User'
  const hasDeletedFiles = hasDeletedAttachments(deletedFiles, description)
  const hasFiles = (attachments && attachments.length > 0) || hasDeletedFiles
  const isSameArrayObject = compareDeep(uploadedAttachments, attachments)

  const onDragOver = () => {
    if (!isDragging) {
      setIsDragging(true)
    }
  }

  const onDragLeave = useCallback(() => {
    if (isDragging) {
      setIsDragging(false)
    }
  }, [isDragging])

  const onSelectFile = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event?.target?.files
    let isError: boolean = false
    let error: unknown
    if (files) {
      // eslint-disable-next-line unicorn/prefer-spread
      const arrayList = Array.from(files)
      const attachmentList: AttachmentInput[] = [...attachments]
      let index = 0

      if (!validateAcceptedFileType(arrayList, acceptedFileType)) {
        return onError('wrongFormat')
      }

      for (const file of arrayList) {
        const createdAt = new Date().toISOString()

        const keyName = `${description}#${createdAt}#${index}#${file.name.replaceAll(' ', '_')}`
        const blob = file.slice(0, file.size, file.type)
        const newFile = new File([blob], keyName, file)
        const newAttachment: AttachmentInput = {
          key: keyName,
          createdAt,
          size: file.size,
          type: file.type,
          uploadedBy: userName
        }
        mutate(newFile, {
          onError: (errorReponse) => {
            isError = true
            error = errorReponse
          }
        })
        attachmentList.push(newAttachment)
        index++
      }
      if (!isError) {
        setUploadedAttachments(attachmentList)
      } else {
        onError('errorUploadingFile')
        console.error('Something went wrong uploading the files:', error)
      }
    }
  }

  const handleDeleteFile = (file: AttachmentInput) => {
    const newAttachments = attachments.filter((attachment) => attachment.key !== file.key)
    setUploadedAttachments(newAttachments)
    onUploadFile(newAttachments)
    onDeleteFile(file)
  }

  const handleRestoreFile = (deletedFile: AttachmentInput, index: number) => {
    const newAttachments = [...attachments]
    newAttachments.push(deletedFile)
    setUploadedAttachments(newAttachments)
    onUploadFile(newAttachments)
    onRestoreFile(index)
  }

  useEffect(() => {
    if (isSuccess && !isSameArrayObject) {
      onUploadFile(uploadedAttachments)
      onDragLeave()
      setTotalUploaded(0)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, isSameArrayObject])

  return (
    <Container style={{ border: hasFiles && !isDragging ? undefined : `1px solid ${colors.gray3}` }}>
      {isPending && <LinearProgress variant='determinate' value={totalUploaded} />}
      <Box
        display='flex'
        alignItems='center'
        onDragLeave={onDragLeave}
        onDragOver={onDragOver}
        style={{
          flexDirection: 'column',
          position: 'relative',
          border: isDragging ? `2px dashed ${colors.gray3}` : undefined,
          margin: hasFiles && !isDragging ? undefined : '8px'
        }}
      >
        <input
          type='file'
          accept={acceptedFileType}
          ref={inputRef}
          draggable
          onChange={onSelectFile}
          style={{
            margin: '4px',
            padding: 0,
            width: '100%',
            height: '100%',
            outline: 'none',
            opacity: 0,
            position: 'absolute',
            cursor: attachments && attachments.length > 0 ? undefined : 'pointer',
            zIndex: isDragging ? 1 : 0
          }}
          multiple
        />
        {hasFiles && !isDragging ? (
          <Stack style={{ height: '100%', width: '100%', zIndex: isDragging ? 0 : 1, marginTop: '12px' }}>
            {attachments?.map((attachment) => {
              return (
                <AttachedFile
                  key={attachment.key}
                  attachment={attachment}
                  onClickAction={() => handleDeleteFile(attachment)}
                />
              )
            })}
            {deletedFiles?.map((deletedFile, index) => {
              if (getDescriptionFromAttachment(deletedFile) === description) {
                return (
                  <AttachedFile
                    key={deletedFile.key}
                    attachment={deletedFile}
                    onClickAction={() => handleRestoreFile(deletedFile, index)}
                    isDeleted
                  />
                )
              }
              return undefined
            })}
            <Grid container>
              <Grid item xs={12}>
                <StyledButton
                  startIcon={<CloudUploadIcon height='24px' width='24px' />}
                  onClick={() => {
                    inputRef.current?.click()
                  }}
                >
                  <Typography variant='button' fontSize='0.875rem'>
                    {t('disruptionDetails.uploadFile')}
                  </Typography>
                </StyledButton>
              </Grid>
            </Grid>
          </Stack>
        ) : (
          <div
            style={{
              height: '7.35rem',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <CloudUploadIcon height='38px' width='38px' />
            <Typography variant='h3' style={{ textDecoration: 'underline' }}>
              {t('disruptionDetails.uploadFile')}
            </Typography>
          </div>
        )}
      </Box>
    </Container>
  )
}

export default UploadFiles
