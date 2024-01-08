import { Area } from 'react-easy-crop'
/**
 * This function was adapted from the one in the ReadMe of https://github.com/DominicTobias/react-image-crop
 * @param {File} imageSrc - Image File url
 * @param {Object} pixelCrop - pixelCrop Object provided by react-easy-crop
 * @param {number} rotation - optional rotation parameter
 */

const createImage = (url: string | undefined) => {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.addEventListener('load', () => resolve(image))
    image.addEventListener('error', (error) => reject(error))
    image.setAttribute('crossOrigin', 'anonymous') // needed to avoid cross-origin issues on CodeSandbox
    image.src = url as string
  })
}

function getRadianAngle(degreeValue: number | number[]) {
  return ((degreeValue as number) * Math.PI) / 180
}

export default async function getCroppedImg(
  imageSource: string | undefined,
  pixelCrop: Area | undefined,
  rotation: number | number[] = 0
) {
  const image = (await createImage(imageSource)) as HTMLImageElement
  const canvas = document.createElement('canvas')
  const context: CanvasRenderingContext2D | null = canvas.getContext('2d')

  const maxSize = Math.max(image.width, image.height)
  const safeArea = 2 * ((maxSize / 2) * Math.sqrt(2))

  // set each dimensions to double largest dimension to allow for a safe area for the
  // image to rotate in without being clipped by canvas context
  canvas.width = safeArea
  canvas.height = safeArea

  // translate canvas context to a central location on image to allow rotating around the center.
  context?.translate(safeArea / 2, safeArea / 2)
  context?.rotate(getRadianAngle(rotation))
  context?.translate(-safeArea / 2, -safeArea / 2)

  // draw rotated image and store data.
  context?.drawImage(image, safeArea / 2 - image.width * 0.5, safeArea / 2 - image.height * 0.5)

  const data: ImageData | undefined = context?.getImageData(0, 0, safeArea, safeArea)

  // set canvas width to final desired crop size - this will clear existing context
  canvas.width = pixelCrop?.width as number
  canvas.height = pixelCrop?.height as number

  // paste generated rotate image with correct offsets for x,y crop values.
  if (data)
    context?.putImageData(
      data,
      0 - safeArea / 2 + image.width * 0.5 - (pixelCrop?.x as number),
      0 - safeArea / 2 + image.height * 0.5 - (pixelCrop?.y as number)
    )

  // As Base64 string
  // return canvas.toDataURL("image/jpeg");
  return canvas
}
