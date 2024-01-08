import { ArrayPath, Control, useFieldArray } from 'react-hook-form'
import { z } from 'zod'
import { AttachmentSchema } from 'zodSchemas'

interface Props<TData extends object> {
  control: Control<TData, unknown>
  attachmentName: ArrayPath<TData>
  deletedFilesName: ArrayPath<TData>
}

const useFormFile = <TData extends object>({ control, attachmentName, deletedFilesName }: Props<TData>) => {
  const { fields: attachments, replace } = useFieldArray<TData>({
    control,
    name: attachmentName
  })

  const {
    fields: deletedFiles,
    append,
    remove
  } = useFieldArray<TData>({
    control,
    name: deletedFilesName
  })

  return {
    attachments: z.array(AttachmentSchema).parse(attachments),
    deletedFiles: z.array(AttachmentSchema).parse(deletedFiles),
    replace,
    append,
    remove
  }
}

export default useFormFile
