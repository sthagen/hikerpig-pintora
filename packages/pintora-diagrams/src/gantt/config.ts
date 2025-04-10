import { tinycolor } from '@pintora/core'
import { getParamRulesFromConfig, interpreteConfigs, makeConfigurator } from '../util/config'
import { PALETTE } from '../util/theme'
import { BaseFontConfig, defaultFontConfig, getFontConfigRules } from '../util/font-config'

export type GanttConf = BaseFontConfig & {
  barHeight: number
  barGap: number
  topPadding: number
  sidePadding: number
  gridLineStartPadding: number

  numberSectionStyles: number

  axisFormat: string
  axisLabelFontSize: number
  gridLineWidth: number
  gridLineColor: string
  axisLabelColor: string

  markLineColor: string

  barBackground: string
  barBorderColor: string
  barBorderRadius: number

  sectionBackgrounds: string[]
  sectionLabelColor: string

  fontColor: string
}

export const defaultConfig: GanttConf = {
  ...defaultFontConfig,
  barHeight: 20,
  barGap: 2,
  topPadding: 30,
  sidePadding: 20,
  gridLineStartPadding: 20,

  numberSectionStyles: 4,

  axisFormat: 'YY-MM-DD',
  axisLabelFontSize: 10,
  gridLineWidth: 2,
  gridLineColor: PALETTE.normalDark,
  axisLabelColor: PALETTE.normalDark,

  markLineColor: PALETTE.pink,

  barBackground: PALETTE.orange,
  barBorderColor: PALETTE.normalDark,
  barBorderRadius: 2,

  sectionBackgrounds: ['#fff0da', undefined], // will be infered from theme
  sectionLabelColor: PALETTE.normalDark,

  fontColor: PALETTE.normalDark,
}

export const GANTT_PARAM_DIRECTIVE_RULES = {
  ...getParamRulesFromConfig(defaultConfig),
  ...getFontConfigRules(),
  axisFormat: { valueType: 'string' },
} as const

export const configKey = 'gantt'

const configurator = makeConfigurator<GanttConf>({
  defaultConfig,
  configKey,
  getConfigFromParamDirectives(configParams) {
    return interpreteConfigs(GANTT_PARAM_DIRECTIVE_RULES, configParams)
  },
  getConfigFromTheme(t, conf) {
    const canvasBgInstance = tinycolor(t.canvasBackground || 'white')
    const isBgLight = canvasBgInstance.isLight()

    let fontColorOverBackground: string
    let gridLineColor: string
    if (isBgLight) {
      fontColorOverBackground = PALETTE.normalDark
      gridLineColor = tinycolor(fontColorOverBackground).lighten(20).toHexString()
    } else {
      fontColorOverBackground = PALETTE.white
      gridLineColor = tinycolor(fontColorOverBackground).darken(20).toHexString()
    }

    const primaryCorlorInstance = tinycolor(t.primaryColor)
    const sectionBackgrounds = [primaryCorlorInstance.brighten(20).desaturate(10).toHexString(), undefined]

    tinycolor(fontColorOverBackground)
    return {
      barBackground: t.primaryColor,
      barBorderColor: conf.fontColor,
      fontColor: t.textColor,
      axisLabelColor: fontColorOverBackground,
      sectionLabelColor: fontColorOverBackground,
      sectionBackgrounds,
      gridLineColor,
    }
  },
})

export const getConf = configurator.getConfig
