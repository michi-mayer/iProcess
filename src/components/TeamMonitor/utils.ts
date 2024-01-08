import type { BarDatum } from '@nivo/bar'
import type { BarChartProps, FromIndex } from 'components/Charts/BarChart'

export enum DiagramDatumKey {
  Description = 'description',
  MyTeamFrequency = 'myTeamFrequency',
  PreviousTeamsFrequency = 'previousTeamsFrequency'
}

export interface DiagramDatum extends BarDatum {
  [DiagramDatumKey.Description]: string
  [DiagramDatumKey.MyTeamFrequency]: number
  [DiagramDatumKey.PreviousTeamsFrequency]: number
}

export const indexBy = ({ description }: DiagramDatum) => description

export const fromIndex = (description: string): FromIndex<DiagramDatum> => ({ description })

export const legends: BarChartProps<DiagramDatum>['legends'] = [
  {
    dataFrom: 'keys',
    anchor: 'bottom-right',
    direction: 'column',
    translateX: 120,
    itemWidth: 100,
    itemHeight: 15,
    itemsSpacing: 17
  }
]
