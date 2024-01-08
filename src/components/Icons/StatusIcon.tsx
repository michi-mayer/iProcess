import { Status } from 'API'
import MeasureDefined from 'components/Icons/measureDefined.svg'
// Icons
import MeasureDescribed from 'components/Icons/measureDescribed.svg'
import MeasureImplemented from 'components/Icons/measureImplemented.svg'
import MeasurePlanned from 'components/Icons/measurePlanned.svg'
import MeasureSolved from 'components/Icons/measureSolved.svg'
import MeasureUnsolved from 'components/Icons/measureUnsolved.svg'
import { assertNever } from 'helper/assertNever'

interface StatusIconProps {
  status: Status
}

const StatusIcon = ({ status }: StatusIconProps) => {
  switch (status) {
    case Status.Described:
      return <img height={24} src={MeasureDescribed} loading='lazy' />

    case Status.Defined:
      return <img height={24} src={MeasureDefined} loading='lazy' />

    case Status.Planned:
      return <img height={24} src={MeasurePlanned} loading='lazy' />

    case Status.Implemented:
      return <img height={24} src={MeasureImplemented} loading='lazy' />

    case Status.Solved:
      return <img height={24} src={MeasureSolved} loading='lazy' />

    case Status.Unsolved:
      return <img height={24} src={MeasureUnsolved} loading='lazy' />

    default: {
      assertNever(status)
      return <></>
    }
  }
}

export default StatusIcon
