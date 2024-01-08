import { useEffect, useState } from 'react'
import Typography from '@mui/material/Typography'

interface OrderStatusCardProps {
  id: string
  heading: string
  value: number | string | undefined
}

const OrderStatusCard = ({ id, heading, value }: OrderStatusCardProps) => {
  const [stringifiedValue, setStringifiedValue] = useState<string>()

  useEffect(() => {
    setStringifiedValue((value ?? '-').toString())
  }, [value])

  return (
    <div>
      <Typography variant='h5'>{heading}</Typography>
      <Typography id={id} variant='body2'>
        {stringifiedValue}
      </Typography>
    </div>
  )
}

export default OrderStatusCard
