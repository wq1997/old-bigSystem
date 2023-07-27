import { getRandomColor } from './utils'

const getSeriesStyle = colorIndex => ({
    symbolSize: 4,
    showSymbol: false,
    symbol: "diamond",
    itemStyle: {
        normal: {
            lineStyle: { width: 1.8 },
            color: getRandomColor(colorIndex)
        }
    },
})

const tooltipStyle = {
    backgroundColor: 'rgb(255, 255, 255)',
    borderColor: 'rgba(77, 80, 84, 0.2)',
    borderWidth: 1,
    extraCssText: 'box-shadow:rgba(0, 0, 0, 0.1) 0px 5px 15px 0px',
    textStyle: {
        color: 'rgb(51, 51, 51)',
        fontSize: 12
    }
}

const loadingOptions = {
    text: "loading...", //加载时候的文本
    color: "#fff", //加载时候小圆圈的颜色
    textColor: "white", //加载时候文本颜色
    maskColor: '#99999929'//加载时候的背景颜色
}

export { tooltipStyle, getSeriesStyle, loadingOptions }