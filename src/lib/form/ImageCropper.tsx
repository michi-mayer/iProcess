import { ChangeEvent, MutableRefObject, useCallback, useEffect, useRef, useState } from 'react'
import Cropper, { Area } from 'react-easy-crop'
import { useTranslation } from 'react-i18next'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import { Grid, IconButton, Slider, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import moment from 'moment-timezone'
import { isPutResult } from 'types'
import getCroppedImg from './helper/croppeImage'
import { dataURLtoFile } from './helper/dataURLtoFile'
import { getSizeFromStorageKey } from './helper/getFileSize'
import Image from 'components/Image'
import useMutateFile from 'hooks/services/useMutateFile'
import { ActionButtons, GroupUIDiscardButton, GroupUISubmitButton } from 'lib/ui/Buttons'
import { Nullable } from 'shared'
import { colors } from 'theme'

const SliderCustom = styled(Slider)({
  padding: '22px 0px',
  marginLeft: 32
})

const ControlsContainer = styled('div')({
  padding: 16,
  position: 'absolute',
  right: 0,
  bottom: 0,
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: 'white',
  zIndex: 1000
})

const GridContainer = styled(Grid)({
  border: `0.5px dashed ${colors.blue}`,
  width: '20rem',
  height: '20rem',
  borderRadius: 6,
  alignItems: 'center',
  justifyContent: 'center',
  padding: '1rem'
})

const TypographySliderLabel = styled(Typography)({
  minWidth: 65
})

const rejectedGridItems = Array.from({ length: 20 }, (_, i) => 1 + i)

interface ImageCropperProps {
  onCroppedImage: (value: string | undefined) => void
  croppedImageKey: Nullable<string>
}

const ImageCropper = ({ onCroppedImage, croppedImageKey }: ImageCropperProps) => {
  const now = moment().utc().format()
  const { t } = useTranslation('admin')
  const { mutate, isSuccess, isPending, isError, data } = useMutateFile()
  const imageKey = isPutResult(data) ? data?.key : undefined
  const inputRef: MutableRefObject<HTMLInputElement | null> = useRef<HTMLInputElement>(null)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [rotation, setRotation] = useState<number | number[]>(0)
  const [zoom, setZoom] = useState<number | number[]>(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | undefined>()
  const [image, setImage] = useState<string | undefined>()
  const [isCorrectFormat, setIsCorrectFormat] = useState<boolean>(true)
  const [imageSize, setImageSize] = useState<string | undefined>()
  const [fileName, setFileName] = useState<string>()

  const onCropComplete = useCallback((_croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const showCroppedImage = useCallback(async () => {
    try {
      // This returns the canvas
      const croppedImage: HTMLCanvasElement = await getCroppedImg(image, croppedAreaPixels, rotation)
      const dataURLImage: string = croppedImage.toDataURL('image/jpeg', 1)
      const convertedUrlToFile = dataURLtoFile(dataURLImage, `${now}-${fileName?.replaceAll(' ', '_').toLowerCase()}`)
      mutate(convertedUrlToFile)
    } catch (error) {
      console.error(error)
    }
  }, [croppedAreaPixels, fileName, image, mutate, now, rotation])

  useEffect(() => {
    let mounted = true

    if (mounted && isSuccess) onCroppedImage(imageKey)

    return () => {
      mounted = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess])

  const onSelectFile = (event: ChangeEvent<HTMLInputElement>) => {
    if (
      event.target?.files?.[0]?.type === 'image/jpeg' ||
      event.target?.files?.[0]?.type === 'image/png' ||
      event.target?.files?.[0]?.type === 'image/heic'
    ) {
      if (event.target.files && event.target.files.length > 0) {
        setFileName(event.target.files[0]?.name)
        const reader: FileReader = new FileReader()
        reader.readAsDataURL(event.target.files[0])
        reader.addEventListener('load', () => {
          setImage(reader.result as string)
        })
      }
    } else {
      setIsCorrectFormat(false)
    }
  }

  const triggerFileSelectPopup = () => {
    inputRef.current?.click()
  }

  const handleDeleteImage = () => {
    setImage(undefined)
    onCroppedImage(undefined)
    setIsCorrectFormat(true)
  }

  useEffect(() => {
    let mounted = true
    const getImageSizeFromStorage = async () => {
      if (croppedImageKey) {
        const imgSize = await getSizeFromStorageKey(croppedImageKey)
        if (imgSize) setImageSize(imgSize)
      }
    }

    if (croppedImageKey && mounted) {
      getImageSizeFromStorage()
    }

    return () => {
      mounted = false
    }
  }, [croppedImageKey])

  return (
    <GridContainer>
      {croppedImageKey ? (
        <Grid container xs={12} item style={{ width: '100%', height: '100%' }}>
          <Grid style={{ height: 228 }}>
            <Image style={{ width: 285 }} imgKey={croppedImageKey} />
          </Grid>
          <Grid
            item
            style={{
              position: 'absolute',
              width: 285,
              height: 228,
              display: 'grid',
              gridTemplateColumns: 'repeat(5, 1fr)',
              gridTemplateRows: 'repeat(4,1fr)',
              border: `0.5px solid ${colors.gray1}`,
              gridGap: '1px'
            }}
          >
            {rejectedGridItems.map((item) => (
              <div
                key={item}
                style={{
                  width: '100%',
                  height: '100%',
                  border: `0.5px solid ${colors.gray1}`
                }}
              />
            ))}
          </Grid>
          <Grid
            container
            item
            xs={12}
            style={{ width: '100%', marginTop: '1rem' }}
            direction='row'
            justifyContent='space-between'
            alignItems='center'
          >
            <Grid item>
              <Typography variant='caption' style={{ fontSize: 16, textAlign: 'center' }}>
                {imageSize}
              </Typography>
            </Grid>
            <Grid container item xs={4} justifyContent='flex-end'>
              <ActionButtons
                size='medium'
                onClickEdit={() => onCroppedImage(undefined)}
                onClickDelete={handleDeleteImage}
              />
            </Grid>
          </Grid>
        </Grid>
      ) : image ? (
        <>
          <Grid
            container
            item
            style={{
              width: '100%',
              height: '100%',
              borderRadius: 6,
              zIndex: 1000
            }}
          >
            <Cropper
              image={image}
              crop={crop}
              rotation={rotation as number}
              zoom={zoom as number}
              aspect={5 / 4}
              showGrid={false}
              onCropChange={setCrop}
              onRotationChange={setRotation}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
            />
          </Grid>
          <ControlsContainer style={{ width: '200px' }}>
            <div style={{ display: 'flex', flex: '1', alignItems: 'center' }}>
              <TypographySliderLabel variant='caption'>Zoom</TypographySliderLabel>
              <SliderCustom
                value={zoom}
                min={1}
                max={3.2}
                step={0.1}
                aria-labelledby='Zoom'
                onChange={(_, zoom) => setZoom(zoom)}
              />
            </div>
            <div style={{ display: 'flex', flex: '1', alignItems: 'center' }}>
              <TypographySliderLabel variant='caption'>{t('productsSection.rotate')}</TypographySliderLabel>
              <SliderCustom
                value={rotation}
                min={0}
                max={360}
                step={1}
                aria-labelledby='Rotation'
                onChange={(_, rotation) => setRotation(rotation)}
              />
            </div>
            <Grid container justifyContent='center' gap={'16px'}>
              <GroupUIDiscardButton onClick={handleDeleteImage} icon='delete-24'>
                {t('buttons.discard')}
              </GroupUIDiscardButton>
              <GroupUISubmitButton
                type='button'
                icon={!isPending ? 'save-24' : 'icon-empty-24'}
                size='m'
                isLoading={isPending}
                onClick={showCroppedImage}
                fullwidth={true}
              >
                {t('buttons.save')}
              </GroupUISubmitButton>
            </Grid>
          </ControlsContainer>
        </>
      ) : (
        <Grid
          container
          item
          style={{ width: '100%', height: '100%', borderRadius: 6 }}
          direction='column'
          justifyContent='center'
        >
          <Typography variant='body2' align='center'>
            {t('productsSection.uploadImageTitle')}
          </Typography>
          <Grid container item justifyContent='center'>
            <input type='file' accept='image/*' ref={inputRef} onChange={onSelectFile} style={{ display: 'none' }} />
            <IconButton
              size='medium'
              id='upload-image-button'
              disableFocusRipple
              disableRipple
              onClick={triggerFileSelectPopup}
            >
              <CloudUploadIcon color='primary' style={{ fontSize: 60 }} />
            </IconButton>
          </Grid>
          <Grid container item justifyContent='center'>
            <Typography variant='caption' style={{ color: colors.redError }} align='center'>
              {isCorrectFormat || !isError ? ' ' : t('productsSection.unsopportedFileFormat')}
            </Typography>
          </Grid>
        </Grid>
      )}
    </GridContainer>
  )
}

export default ImageCropper
