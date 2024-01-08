import { Grid, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import { AxisProps } from '@nivo/axes'
import { BarDatum, ResponsiveBar } from '@nivo/bar'
import { equals } from 'remeda'
import { match } from 'ts-pattern'
import { Color, colors as themeColors } from 'theme'

export type FromIndex<T> = Partial<{ [Key in keyof T]: string }>

export const ChartContainer = styled(Grid)({
  height: '350px'
})

interface TooltipSection {
  title: string
  body: string
}

interface BarChartTooltipProps {
  color: string
  top: TooltipSection
  bottom: TooltipSection
}

export const BarChartTooltip = ({ top, bottom, color }: BarChartTooltipProps) => (
  <div style={{ padding: 12, color, background: themeColors.white }}>
    <Grid container display='flex' direction='column' style={{ margin: '0.5rem 0' }}>
      <Typography variant='h3'>{top.title}</Typography>
      <Typography variant='caption'>{top.body}</Typography>
    </Grid>

    <Grid container display='flex' direction='column' style={{ margin: '0.5rem 0' }}>
      <Typography variant='h3'>{bottom.title}</Typography>
      <Typography variant='caption'>{bottom.body}</Typography>
    </Grid>
  </div>
)

const defaultBarColor =
  <T extends BarDatum>(selectedItem: T | undefined) =>
  (bar: { data: T }) =>
    match([!!selectedItem, equals(selectedItem, bar.data)])
      .with([true, true], () => themeColors.blue)
      .with([true, false], () => themeColors.gray1)
      .otherwise(() => themeColors.blue)

type BarChartParameters<T extends BarDatum> = Parameters<typeof ResponsiveBar<T>>[0]

export interface BarChartProps<T extends BarDatum> extends BarChartParameters<T> {
  // * Chart parameters
  selectedItem?: T | undefined
  yAxisTitle?: NonNullable<BarChartParameters<T>['axisLeft']>['legend']
  yAxisTickValues?: NonNullable<BarChartParameters<T>['axisLeft']>['tickValues']
  xAxisFormatter?: AxisProps['format']
  // * Title parameters
  title: string
  titleColor?: Color
}

const BarChart = <T extends BarDatum>({
  selectedItem,
  colors = defaultBarColor(selectedItem),
  yAxisTitle,
  yAxisTickValues,
  xAxisFormatter,
  title,
  titleColor = themeColors.blue,
  ...props
}: BarChartProps<T>) => (
  <ChartContainer item xs={12}>
    <Typography variant='h2' textAlign='left' margin='24px' marginLeft='50px' color={titleColor}>
      {title}
    </Typography>
    <ResponsiveBar
      role='application'
      minValue={0}
      colors={colors}
      labelTextColor={themeColors.white}
      label={(_) => (_.value === 0 ? '' : `${_.value}`)}
      margin={{ top: 10, bottom: 120, left: 100, right: 180 }}
      axisLeft={{
        legend: yAxisTitle,
        tickValues: yAxisTickValues,
        legendPosition: 'middle',
        legendOffset: -40,
        format: (_) => (Number.isInteger(_) ? _ : '')
      }}
      isFocusable={false}
      axisBottom={{ format: xAxisFormatter, tickRotation: -45 }}
      {...props}
    />
  </ChartContainer>
)

export default BarChart
