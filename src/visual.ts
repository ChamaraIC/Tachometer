/*
 *  Power BI Visual CLI
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */

module powerbi.extensibility.visual {
    import ClassAndSelector = powerbi.extensibility.utils.svg.CssConstants.ClassAndSelector;
    import createClassAndSelector = powerbi.extensibility.utils.svg.CssConstants.createClassAndSelector;
    import IValueFormatter = powerbi.extensibility.utils.formatting.IValueFormatter;
    import IMargin = powerbi.extensibility.utils.chart.axis.IMargin;
    import TooltipEnabledDataPoint = powerbi.extensibility.utils.tooltip.TooltipEnabledDataPoint;
    import PixelConverter = powerbi.extensibility.utils.type.PixelConverter;
    import dataLabelUtils = powerbi.extensibility.utils.chart.dataLabel.utils;
    import SVGUtil = powerbi.extensibility.utils.svg;
    import valueFormatter = powerbi.extensibility.utils.formatting.valueFormatter;
    import ValueFormatterOptions = powerbi.extensibility.utils.formatting.ValueFormatterOptions;
    import TextProperties = powerbi.extensibility.utils.formatting.TextProperties;
    import textMeasurementService = powerbi.extensibility.utils.formatting.textMeasurementService;
    import AxisHelper = powerbi.extensibility.utils.chart.axis;
    import DataRoleHelper = powerbi.extensibility.utils.dataview.DataRoleHelper;
    import DisplayUnitSystemType=powerbi.extensibility.utils.formatting.DisplayUnitSystemType;
    
    const minLabelFontSize: number = 8;

    export interface Offset {
        x: number;
        y: number;
    }

    export interface TargetDetails {
        centerX: number;
        centerY: number;
        tipX: number;
        tipY: number;
        defaultTextAnchorX: number;
        defaultTextAnchorY: number;
        gaugeRadius: number;
        labelRadius: number;
        onRightSide: boolean;
        onTopHalf: boolean;
        targetAngle: number;
    }

    export interface TachometerDataLabelsData {
        show: boolean;
        fontSizePx?: string;
        labelColor?: string;
        displayUnits?: number;
        precision?: number;
        fontSize?: number;
        round?: boolean;
        count?: number;
        reduce?: boolean;
        offset?: Offset;
        formatter?: IValueFormatter;
        textHeight?: number;
        invert?: boolean;
        formattedValue?: string; //formatted string value of the label
        textWidth?: number; //width of formatted text
    }

    export interface TachometerViewModel extends TooltipEnabledDataPoint {
        viewportHeight: number;
        viewportWidth: number;
        availableHeight: number;
        availableWidth: number;
        axis: TachometerAxisData;
        callout: TachometerCalloutSettings;
    }

    export interface TachometerIndicatorData {
        value: number;
        pointerColor: string;
        pointerSizeFactor: number; //Ratio of distance to Pointer tip as a factor of radius
        needletransformString: string;
        needlePoints: { x: number; y: number }[];
        baseThicknessFactor: number; //Inner Radius of the base as a ratio of its outer radius
        baseRadius: number;
        baseInnerRadius: number;
        baseStartAngle: number;
        baseEndtAngle: number;
        baseColor: string;
    }

    export interface TachometerCalloutSettings {
        calloutValue: TachometerDataLabelsData;
        calloutPercent: TachometerDataLabelsData;
        baseOffset: Offset;
    }

    export interface TachometerTranslationSettings {
        radius: number;
        startAngle: number;
        endAngle: number;
        xOffset: number;
        yOffset: number;
        calloutxOffset: number;
        calloutyOffset: number;
    }

    export interface TachometerLabelObject extends DataViewObject {
        show: boolean;
        color?: Fill;
        labelDisplayUnits?: number;
        labelPrecision?: number;
        fontSize?: number;
        round?: boolean;
        count?: number;
        reduce?: boolean;
        xOffset?: number;
        yOffset?: number;
        invert?: boolean;
    }

    export interface TachometerAxisData extends TooltipEnabledDataPoint {
        value: number;
        percent: number;
        startAngle: number;  //The angle to start the dial
        endAngle: number; //The angle to end the dial
        axisScaleType: axisScaleType; //Scale to measure data in the gauge
        startValue: number; //The start value of the dial
        endValue: number; //The end value of the dial
        range1: TachometerRangeData;
        range2: TachometerRangeData;
        range3: TachometerRangeData;
        target: TachometerTargetData;
        dataLabels: TachometerDataLabelsData;
        offset: Offset;
        transformString: string;
        indicator: TachometerIndicatorData;
        valueRange: number; //range between startValue and endValue
        angleRange: number; //angle between startAngle and endAngle
        radius: number;
        axisLabelRadius: number;
        directionClockwise: boolean;
        startQuadrant: number;//Quadrant where start angle is
        endQuadrant: number;//Quadrant where end angle is
        cosStartAngle: number; //cos value of startAngle
        cosEndAngle: number; //cos value of EndAngle
        sinStartAngle: number; //sin value of startAngle
        sinEndAngle: number; //sin value of EndAngle
    }

    interface TachometerStyle {
        indicator: {
            thickness: number;
            fill: string;
        };
        targetLine: {
            thickness: number;
        };
        labels: {
            padding: number;
        };
        callout: {
            padding: number;
        };
        target: {
            padding: number;
        };
    }

    export interface TachometerSmallViewPortProperties {
        hideTachometerSideNumbersOnSmallViewPort: boolean;
        smallTachometerMarginsOnSmallViewPort: boolean;
        MinHeightTachometerSideNumbersVisible: number;
        TachometerMarginsOnSmallViewPort: number;
    }

    export interface TachometerRectangle {
        left: number;
        top: number;
        right: number;
        bottom: number;
    }

    export interface TachometerAxisLabel {
        show: boolean;
        angle: number;
        value: number;
        displayValue: string;
        anchor: string;
        xOffset: number;
        yOffset: number;
        textWidth: number;
        textHeight: number;
        rect: TachometerRectangle; //redundat data for performance
        graphicsElement: d3.Selection<any>;//link to the graphics element
    }

    export interface TachometerAxisObject extends DataViewObject {
        startAngle?: number;
        endAngle?: number;
        startValue?: number;
        endValue?: number;
        axisScaleType?: axisScaleType; //Scale to measure data in the gauge
    }

    export interface TachometerAxisObjects extends DataViewObjects {
        axis: TachometerAxisObject;
    }

    export interface TachometerRangeObject extends DataViewObject {
        rangeColor?: Fill;
        thickness?: number;
        startValue?: number;
    }

    export interface TachometerRangeObjects extends DataViewObjects {
        range: TachometerRangeObject;
    }

    export interface TachometerTargetObject extends DataViewObject {
        show: boolean;
        value?: number;
        lineColor?: Fill;
        innerRadiusRatio?: number;
        textColor?: Fill;
        fontSize?: number;
    }

    export interface TachometerTargetObjects extends DataViewObjects {
        target: TachometerTargetObject;
    }

    export interface TachometerIndicatorObject extends DataViewObject {
        pointerColor?: Fill;
        pointerSizeFactor?: number; //Ratio of distance to Pointer tip as a factor of radius
        baseColor?: Fill;
        baseThicknessFactor?: number; //Inner Radius of the base as a ratio of its outer radius
    }

    export interface TachometerIndicatorObjects extends DataViewObjects {
        indicator: TachometerIndicatorObject;
    }

    export interface TachometerRangeSettings {
        startValue: number;
        rangeColor: string;
        innerRadiusRatio: number; //Size of inner Radius as a factor of Radius
    }

    export interface TachometerRangeData extends TachometerRangeSettings {
        radius: number;
        innerRadius: number;
        startAngle: number;
        endAngle: number;
        endValue: number;
    }

    export interface TachometerTargetData {
        show: boolean;
        value: number;
        lineColor: string;
        innerRadiusRatio: number; //Size of inner Radius as a factor of Radius
        radius: number;
        innerRadius: number;
        thickness: number;
        offset: Offset;
        textColor: string;
        fontSize: number;
        fontSizePx?: string;
        textHeight?: number;
        formattedValue?: string; //formatted string value of the label
        textWidth?: number; //width of formatted text
    }

    export interface TachometerRoleNames {
        y: string;
        startValue: string;
        endValue: string;
        targetValue: string;
        range2StartValue: string;
        range3StartValue: string;
    }

    export interface Margins {
        mainMargin: IMargin;
        labelMargin: IMargin;
        targetMargin: IMargin;
    }

    export interface PruningLimit {
        width: number;
        height: number;
    }
    

    /** 
     * Renders a data value in a gauge. The gauge can start and end in any user defined angle/orientation.
     * Gauge has 3 main regions to indicate for example fail, average, high values.
     * Almost every component in the gauge is customizable.
     * Indika Chamara Ranasinghe 6/21/2016
     * Updated to CLI API 1/31/2017
     */
    export class Tachometer implements IVisual {
        private static UnintializedStartValue = -Infinity;
        private static UnintializedEndValue = +Infinity;
        private static UnintializedRangeStartValue = Tachometer.UnintializedEndValue; //uninitialize to UNINITIALIZED_END_VALUE so that the range is invalid
        private static UninitializedRatio = +Infinity;
        private static UnintializedStartAngle = -Math.PI * 2 / 3;
        private static UnintializedEndAngle = Math.PI * 2 / 3;
        private static PiBy4 = Math.PI / 4;
        private static ThreePiBy4 = Math.PI * 3 / 4;
        private static MinusPiBy4 = - Math.PI / 4;
        private static MinusThreePiBy4 = - Math.PI * 3 / 4;

        private static MinWidthForAxisLabel = 150;
        private static MinHeightForAxisLabel = 150;
        private static MinWidthForTargetLabel = 150;
        private static MinHeightForTargetLabel = 150;
        private static ReducedHorizontalMargin = 15;
        private static ReducedVerticaltMargin = 10;
        private static UnitMargin = 5; //Used for logic
        private static DefaultMarginSettings: IMargin = {
            top: 20,
            bottom: 15,
            left: 15,
            right: 15
        };

        private static DefaultMax = 1;
        private static DefaultMin = 0;
        private static VisualClassName = 'tachometer';
        private static DefaultLabelCount = 4;
        private static MinLabelDistance = 50;
        private static DefaultStyleProperties: TachometerStyle = {
            indicator: {
                thickness: 2,
                fill: 'none'
            },
            targetLine: {
                thickness: 2
            },
            labels: {
                padding: 10,
            },
            callout: {
                padding: 10,
            },
            target: {
                padding: 10,
            }
        };
        private static DefaultRange1Color = '#0EFF23'; //Green;
        private static DefaultRange2Color = '#FFFE00'; //Yellow
        private static DefaultRange3Color = 'red'; //Red
        private static defaultLabelColor: string = '#777777';

        private static DefaultCalloutFontSizeInPt = 20;
        private static DefaultCalloutPercentFontSizeInPt = 14;
        private static BaseArcRadiusFactor = 20; //Radius of center arc as a factor of main arc
        private static MaxTargetRadiusFactor = 100 - Tachometer.BaseArcRadiusFactor;
        private static NeedleHeightToWidthRatio: number = 0.05; //Width of needle as a factor of its height
        private static MainTachometerGroupClassName = 'mainGroup';
        private static AxisLabelsGroupClassName = 'axisLablesGroup';
        private static OverlayTachometerGroupClassName = 'overlayGroup';
        private static LabelText: ClassAndSelector = createClassAndSelector('labelText');
        private static TargetConnector: ClassAndSelector = createClassAndSelector('targetConnector');
        private static TargetText: ClassAndSelector = createClassAndSelector('targetText');
        private static DegreeToRadConversionFactor: number = Math.PI / 180;
        private static RadToDegreeConversionFactor: number = 180 / Math.PI;
        private static TwoPI: number = Math.PI * 2;
        public static formatStringProp: DataViewObjectPropertyIdentifier = {
            objectName: 'general',
            propertyName: 'formatString',
        };
        private static OverlapTolerance: number = 4;
        private static AxisLabelPruningLimit: PruningLimit = { width: 3, height: 5 };
        private static TargetLabelPruningLimit: PruningLimit = { width: 3, height: 4 };
        private static CalloutPruningLimit: PruningLimit = { width: 1.2, height: 3 };
        private static RadialClosenessThreshold = Math.PI / 6;
        private static PreferHorizontalThreshold = Math.sin(Math.PI / 4);

        private currentViewport: IViewport;
        private viewModel: TachometerViewModel;
        private currentScaleType: axisScaleType;

        private static LineFunction: d3.svg.Line<any> = d3.svg.line()
            .x(function (d:any) { return d.x; })
            .y(function (d:any) { return d.y; })
            .interpolate('linear');

        private svg: d3.Selection<any>;
        private mainGraphicsContext: d3.Selection<any>;
        private axisLabelsGraphicsContext: d3.Selection<any>;
        private overlayGraphicsContext: d3.Selection<any>;
        private axisScale: d3.scale.Linear<number,number>;
        private range1Arc: d3.svg.Arc<any>;
        private range2Arc: d3.svg.Arc<any>;
        private range3Arc: d3.svg.Arc<any>;
        private centerArc: d3.svg.Arc<any>;

        private range1ArcPath: d3.Selection<any>;
        private range2ArcPath: d3.Selection<any>;
        private range3ArcPath: d3.Selection<any>;
        private centerArcPath: d3.Selection<any>;
        private calloutLabel: d3.Selection<any>;
        private calloutRectangle: TachometerRectangle;
        private calloutPercent: d3.Selection<any>;
        private calloutPercentRectangle: TachometerRectangle;
        private needle: d3.Selection<any>;
        private targetIndicator: d3.Selection<any>;
        private targetConnector: d3.Selection<any>;
        private targetText: d3.Selection<any>;
        private targetRectangle: TachometerRectangle;
        private gaugeStyle: TachometerStyle;
        private axisData: TachometerAxisData;
        private axisLabels: TachometerAxisLabel[];
        private tachometerSmallViewPortProperties: TachometerSmallViewPortProperties;
        private showAxisLabels: boolean = false;
        private showTargetLabel: boolean = false;
        private showCalloutValue: boolean = false;
        private showCalloutPercent: boolean = false;
        private tooltipsEnabled: boolean;
        private hostService: IVisualHost;
        private dataView: DataView;
        private metadataColumn: DataViewMetadataColumn;

        private static defaultLabelFontFamily: string = 'helvetica, arial, sans-serif';
        private static defaultLabelfontWeight: string = 'normal';
        private static defaultLabelFontSizeInPt: number = 9;
        private static DefaultRangeThickness: number = 50;
        private static CloseToLeftOrRightThreshold = Math.cos(Math.PI / 6);
        private static CloseToTopOrBottomThreshold = Math.cos(Math.PI / 4);

        private static defaultTargetSettings: TachometerTargetData = {
            show: true,
            value: Tachometer.UnintializedStartValue,
            lineColor: 'black',
            innerRadiusRatio: Tachometer.UninitializedRatio,
            radius: 1,
            innerRadius: 0.5,
            thickness: 2,
            offset: { x: 0, y: 0 },
            textColor: Tachometer.defaultLabelColor,
            fontSize: minLabelFontSize,
            textHeight: PixelConverter.fromPointToPixel(minLabelFontSize),
        };

       private static defaultIndicatorSettings: TachometerIndicatorData = {
            value: 0,
            needlePoints: [],
            needletransformString: '',
            pointerSizeFactor: 0.8,
            pointerColor: '#B3B3B3',
            baseColor: '#374649',
            baseRadius: 0.3,
            baseInnerRadius: 0,
            baseThicknessFactor: 0.7,
            baseStartAngle: 0,
            baseEndtAngle: 0,
        };

        public static RoleNames: TachometerRoleNames = {
            y: 'Y',
            startValue: 'StartValue',
            endValue: 'EndValue',
            targetValue: 'TargetValue',
            range2StartValue: 'Range2StartValue',
            range3StartValue: 'Range3StartValue',
        };


        constructor(options: VisualConstructorOptions) {
            this.gaugeStyle = Tachometer.DefaultStyleProperties;
            this.axisData = Tachometer.initializeTachometerData();
            this.setAxisScale(this.axisData);
            this.hostService = options.host;
   
            var svg = this.svg = d3.select(options.element).append('svg').classed(Tachometer.VisualClassName, true);

            var mainGraphicsContext = this.mainGraphicsContext = svg.append('g')
                .attr('class', Tachometer.MainTachometerGroupClassName);
            this.axisLabelsGraphicsContext = svg.append('g')
                .attr('class', Tachometer.AxisLabelsGroupClassName);
            var overlayGraphicsContext = this.overlayGraphicsContext = svg.append('g')
                .attr('class', Tachometer.OverlayTachometerGroupClassName);

            this.range1Arc = d3.svg.arc();
            this.range2Arc = d3.svg.arc();
            this.range3Arc = d3.svg.arc();
            this.centerArc = d3.svg.arc();

            this.range1ArcPath = mainGraphicsContext.append('path').classed('range1Arc', true);
            this.range2ArcPath = mainGraphicsContext.append('path').classed('range2Arc', true);
            this.range3ArcPath = mainGraphicsContext.append('path').classed('range3Arc', true);
            this.needle = overlayGraphicsContext.append('path') //The needle is added to overlay context to make sure it always renders above target indicator
                .classed('needle', true)
                .attr('stroke-width', Tachometer.DefaultStyleProperties.indicator.thickness)
                .attr('fill', Tachometer.DefaultStyleProperties.indicator.fill);

            this.centerArcPath = overlayGraphicsContext.append('path').classed('centerArc', true); //center arc should be rendered above the needle
            this.calloutLabel = overlayGraphicsContext.append('text').classed('calloutLabel', true);
            this.calloutPercent = overlayGraphicsContext.append('text').classed('calloutPercent', true);

        }


        public update(options: VisualUpdateOptions) {
            if (!options || !options.dataViews || !options.dataViews[0]) {
                return;
            }
            this.currentViewport = options.viewport;
            var dataViews = options.dataViews;
            this.dataView = dataViews[0];

            var viewModel = this.viewModel = this.transform(dataViews[0], this.tooltipsEnabled);
            viewModel = this.completeViewModel(viewModel);
            this.drawViewPort(viewModel);            
        }

        public destroy() {
            this.svg = null;
        }

        private static initializeTachometerData(): TachometerAxisData {
            var axisData: TachometerAxisData = {
                startValue: Tachometer.UnintializedStartValue,
                endValue: Tachometer.UnintializedEndValue,
                startAngle: Tachometer.UnintializedStartAngle,
                endAngle: Tachometer.UnintializedEndAngle,
                axisScaleType: axisScaleType.linear,
                value: 0,
                radius: 1,
                axisLabelRadius: 1,
                //tooltipItems: [],
                valueRange: 0,
                angleRange: 0,
                directionClockwise: true,
                startQuadrant: 3,
                endQuadrant: 2,
                cosStartAngle: 0,
                cosEndAngle: 1,
                sinStartAngle: 1,
                sinEndAngle: 0,
                range1: {
                    startValue: Tachometer.UnintializedRangeStartValue,
                    endValue: Tachometer.UnintializedEndValue,
                    rangeColor: Tachometer.DefaultRange1Color,
                    innerRadiusRatio: 0.5,
                    radius: 1,
                    innerRadius: 0.5,
                    startAngle: 0,
                    endAngle: 0,
                },
                range2: {
                    startValue: Tachometer.UnintializedRangeStartValue,
                    endValue: Tachometer.UnintializedEndValue,
                    rangeColor: Tachometer.DefaultRange2Color,
                    innerRadiusRatio: 0.5,
                    radius: 1,
                    innerRadius: 0.5,
                    startAngle: 0,
                    endAngle: 0,
                },
                range3: {
                    startValue: Tachometer.UnintializedRangeStartValue,
                    endValue: Tachometer.UnintializedEndValue,
                    rangeColor: Tachometer.DefaultRange3Color,
                    innerRadiusRatio: 0.5,
                    radius: 1,
                    innerRadius: 0.5,
                    startAngle: 0,
                    endAngle: 0,
                },
                target: {
                    show: Tachometer.defaultTargetSettings.show,
                    value: Tachometer.defaultTargetSettings.value,
                    lineColor: Tachometer.defaultTargetSettings.lineColor,
                    innerRadiusRatio: Tachometer.defaultTargetSettings.innerRadiusRatio,
                    radius: Tachometer.defaultTargetSettings.radius,
                    innerRadius: Tachometer.defaultTargetSettings.innerRadius,
                    thickness: Tachometer.defaultTargetSettings.thickness,
                    offset: { x: Tachometer.defaultTargetSettings.offset.x, y: Tachometer.defaultTargetSettings.offset.y },
                    textColor: Tachometer.defaultTargetSettings.textColor,
                    fontSize: Tachometer.defaultTargetSettings.fontSize,
                    textHeight: Tachometer.defaultTargetSettings.textHeight,
                },
                offset: { x: 0, y: 0 },
                transformString: '',
                percent: 0,
                dataLabels: { show: true },
                indicator: {
                    value: Tachometer.defaultIndicatorSettings.value,
                    needlePoints: Tachometer.defaultIndicatorSettings.needlePoints,
                    needletransformString: Tachometer.defaultIndicatorSettings.needletransformString,
                    pointerSizeFactor: Tachometer.defaultIndicatorSettings.pointerSizeFactor,
                    pointerColor: Tachometer.defaultIndicatorSettings.pointerColor,
                    baseColor: Tachometer.defaultIndicatorSettings.baseColor,
                    baseRadius: Tachometer.defaultIndicatorSettings.baseRadius,
                    baseInnerRadius: Tachometer.defaultIndicatorSettings.baseInnerRadius,
                    baseThicknessFactor: Tachometer.defaultIndicatorSettings.baseThicknessFactor,
                    baseStartAngle: Tachometer.defaultIndicatorSettings.baseStartAngle,
                    baseEndtAngle: Tachometer.defaultIndicatorSettings.baseEndtAngle,
                }
            };
            return axisData;
        }

        private setAxisScale(axisData: TachometerAxisData) {
            var domainStart: number = axisData.startValue;
            var domainEnd: number = axisData.endValue;

            if (axisData.axisScaleType
                && axisData.axisScaleType === axisScaleType.log
            ) {
                if ((domainStart > 0 && domainEnd > 0) || (domainStart < 0 && domainEnd < 0)) {
                    this.axisScale = d3.scale.log();
                    this.currentScaleType = axisScaleType.log;
                }
                else if ((domainStart === 0) && (Math.abs(domainEnd) > 1)) {
                    axisData.startValue = domainStart = Math.min(1, Math.exp(Math.log(domainEnd) / 10)); //make it close to zero as possible 
                    this.axisScale = d3.scale.log();
                    this.currentScaleType = axisScaleType.log;
                }
                else if ((domainEnd === 0) && (Math.abs(domainStart) > 1)) {
                    axisData.endValue = domainEnd = Math.min(1, Math.exp(Math.log(domainStart) / 10)); //make it close to zero as possible 
                    this.axisScale = d3.scale.log();
                    this.currentScaleType = axisScaleType.log;
                }
                //Else (if data span from -ve to +ve then log scale cannot be used so fall back to linear without compaining
                //or scale is < 1
                else {
                    this.setNiceLinearScale();
                }
            }
            else {
                this.setNiceLinearScale();
            }
            this.axisScale.domain([domainStart, domainEnd])
                .range([axisData.startAngle, axisData.endAngle])
                .clamp(true);
        }

        private setNiceLinearScale() {
            this.axisScale = d3.scale.linear();
            this.currentScaleType = axisScaleType.linear;
            var dataLabels: TachometerDataLabelsData = (this.axisData) ? this.axisData.dataLabels : null;
            if (dataLabels && dataLabels.show && dataLabels.round) { //get rounded tick marks
                if (dataLabels.count > 0) {
                    this.axisScale.nice(dataLabels.count);
                }
                else {
                    this.axisScale.nice();
                }
            }
        }

        private transform(dataView: DataView, tooltipsEnabled: boolean = true): TachometerViewModel {
            var axisData: TachometerAxisData = this.transformTachometerData(dataView);
            this.metadataColumn = Tachometer.getMetaDataColumn(dataView);

            return {
                axis: axisData,
                //tooltipInfo: Tachometer.getToolTipInfo(dataView, axisData, tooltipsEnabled),
                callout: {
                    calloutValue: this.transformCalloutValue(dataView, axisData),
                    calloutPercent: this.transformCalloutPercent(dataView, axisData),
                    baseOffset: { x: 0, y: 0 },
                },
                availableHeight: 0,
                availableWidth: 0,
                viewportHeight: 0,
                viewportWidth: 0
            };
        }

        private completeViewModel(viewModel: TachometerViewModel): TachometerViewModel {
            var viewport = this.currentViewport;
            var calloutTextHeight = 0;
            var calloutValueSpace = 0;
            var calloutPercentTextHeight = 0;
            var calloutPercentSpace = 0;
            var axisData = viewModel.axis;
            var calloutValueUserDefinedYOffset = 0;
            var calloutPercentUserDefinedYOffset = 0;
            var maxRenderWidth = viewport.width - 2 * Tachometer.ReducedHorizontalMargin;
            var maxRenderHeight = viewport.height - Tachometer.DefaultMarginSettings.top - Tachometer.DefaultMarginSettings.bottom;

            this.axisData = axisData;
            this.setAxisScale(axisData);

            var callout: TachometerCalloutSettings = viewModel.callout;
            var calloutValue = callout ? callout.calloutValue : undefined;
            var calloutPercent = callout ? callout.calloutPercent : undefined;
            this.setCalloutPercentValue(calloutPercent, axisData);
            this.completeTargetTextProperties(axisData);
            var showLabels = this.showLabelText();

            // Only show the target label if:
            //   1. There is a target
            //   2. The viewport width is big enough for a target
            this.showAxisLabels = axisData.dataLabels.show
                && (maxRenderWidth > Tachometer.MinWidthForAxisLabel)
                && (maxRenderWidth > axisData.dataLabels.textWidth * Tachometer.AxisLabelPruningLimit.width)
                && (maxRenderHeight > Tachometer.MinHeightForAxisLabel)
                && (maxRenderHeight > axisData.dataLabels.textHeight * Tachometer.AxisLabelPruningLimit.height)
                && showLabels;

            // Only show the target label if:
            //   1. There is a target
            //   2. The viewport width is big enough for a target
            this.showTargetLabel = (axisData.target.value !== Tachometer.UnintializedStartValue)
                && axisData.target.show
                && (maxRenderWidth > Tachometer.MinWidthForTargetLabel)
                && (maxRenderWidth > axisData.target.textWidth * Tachometer.TargetLabelPruningLimit.width)
                && (maxRenderHeight > Tachometer.MinHeightForTargetLabel)
                && (maxRenderHeight > axisData.target.textHeight * Tachometer.TargetLabelPruningLimit.height)
                && showLabels;

            // Only show the callout Value label if:
            //   1. There is a callout Value
            //   2. The viewport width is big enough for a target
            this.showCalloutValue = calloutValue
                && calloutValue.show
                && (maxRenderWidth > Tachometer.MinWidthForTargetLabel)
                && (maxRenderWidth > calloutValue.textWidth * Tachometer.CalloutPruningLimit.width)
                && (maxRenderHeight > Tachometer.MinHeightForTargetLabel)
                && (maxRenderHeight > calloutValue.textHeight * Tachometer.CalloutPruningLimit.height)
                && showLabels;

            // Only show the callout Percent label if:
            //   1. There is a callout Percent
            //   2. The viewport width is big enough for a target
            this.showCalloutPercent = calloutPercent
                && calloutPercent.show
                && (maxRenderWidth > Tachometer.MinWidthForTargetLabel)
                && (maxRenderWidth > calloutPercent.textWidth * Tachometer.CalloutPruningLimit.width)
                && (maxRenderHeight > Tachometer.MinHeightForTargetLabel)
                && (maxRenderHeight > calloutPercent.textHeight * Tachometer.CalloutPruningLimit.height)
                && showLabels;

            axisData.dataLabels.formatter = this.getWiderFormatter(axisData.dataLabels, axisData.startValue, axisData.endValue);
            var margins: Margins = this.defineMargins(axisData);
            var availableWidth = this.getAvailebleWidth(viewport, margins);
            if (availableWidth < 0) {
                this.showAxisLabels = false;
                this.showTargetLabel = false;
                margins = this.defineMargins(axisData);
                availableWidth = this.getAvailebleWidth(viewport, margins);
                if (availableWidth < 0) {
                    availableWidth = 0;
                    this.showCalloutValue = false;
                    this.showCalloutPercent = false;
                }
            }

            if (this.showCalloutPercent) {
                calloutPercentTextHeight = callout.calloutPercent.textHeight + this.gaugeStyle.callout.padding;
                var yOffsetBaseEstimate = viewport.height - (Tachometer.DefaultMarginSettings.bottom + calloutPercentTextHeight);
                //Adjust for user defined label displacement
                calloutPercentUserDefinedYOffset = Tachometer.translateUserYOffset(yOffsetBaseEstimate, callout.calloutPercent, viewport.height, this.gaugeStyle.callout.padding);
                calloutPercentSpace = calloutPercentUserDefinedYOffset >= 0 ?
                    calloutPercentTextHeight : Math.max(calloutPercentTextHeight + calloutPercentUserDefinedYOffset, 0);
            }

            if (this.showCalloutValue) {
                calloutTextHeight = callout.calloutValue.textHeight + this.gaugeStyle.callout.padding;
                var yOffsetBaseEstimate = viewport.height - (Tachometer.DefaultMarginSettings.bottom + calloutTextHeight);
                //Adjust for user defined label displacement
                calloutValueUserDefinedYOffset = Tachometer.translateUserYOffset(yOffsetBaseEstimate, callout.calloutValue, viewport.height, this.gaugeStyle.callout.padding);
                calloutValueSpace = calloutValueUserDefinedYOffset >= 0 ?
                    calloutTextHeight : Math.max(calloutTextHeight + calloutValueUserDefinedYOffset, 0);
            }

            var availableHeight = this.getAvailebleHeight(viewport, margins, calloutValueSpace, calloutPercentSpace);

            if (availableHeight < 0) {
                this.showAxisLabels = this.showTargetLabel = this.showCalloutValue = this.showCalloutPercent = false;
                calloutValueSpace = calloutPercentSpace = 0;
                availableHeight = Math.max(viewport.height - margins.mainMargin.top - margins.mainMargin.bottom, 0);
            }

            var translation: TachometerTranslationSettings =
                this.calculateGaugeTranslation(axisData, axisData.startAngle, axisData.endAngle, availableHeight, availableWidth);

            //Remove axis labels and recalculate gauge translation if radius is too small
            var radius = translation.radius;
            if (this.showAxisLabels && (radius < Math.max(margins.labelMargin.top, margins.labelMargin.bottom))) {
                this.showAxisLabels = false;
                margins = this.defineMargins(axisData);
                var availableHeight = this.getAvailebleHeight(viewport, margins, calloutValueSpace, calloutPercentSpace);

                if (availableHeight < 0) {
                    this.showAxisLabels = this.showTargetLabel = this.showCalloutValue = this.showCalloutPercent = false;
                    calloutValueSpace = calloutPercentSpace = 0;
                    margins = this.defineMargins(axisData);
                    availableHeight = Math.max(this.getAvailebleHeight(viewport, margins, calloutValueSpace, calloutPercentSpace), 0);
                }

                var availableWidth = this.getAvailebleWidth(viewport, margins);
                if (availableWidth < 0) {
                    this.showAxisLabels = false;
                    this.showTargetLabel = false;
                    margins.mainMargin.left = margins.mainMargin.right = Tachometer.ReducedHorizontalMargin;
                    availableWidth = viewport.width - margins.mainMargin.right - margins.mainMargin.left;
                    if (availableWidth < 0) {
                        availableWidth = 0;
                        this.showCalloutValue = false;
                        this.showCalloutPercent = false;
                    }
                }
                translation = this.calculateGaugeTranslation(axisData, axisData.startAngle, axisData.endAngle, availableHeight, availableWidth);
                radius = translation.radius;
            }

            //Remove target label and recalculate gauge translation if radius is too small
            if (this.showTargetLabel && (radius < Math.max(margins.labelMargin.top, margins.labelMargin.bottom))) {
                this.showTargetLabel = false;

                margins = this.defineMargins(axisData);
                var availableHeight = this.getAvailebleHeight(viewport, margins, calloutValueSpace, calloutPercentSpace);

                if (availableHeight < 0) {
                    this.showAxisLabels = this.showTargetLabel = this.showCalloutValue = this.showCalloutPercent = false;
                    calloutValueSpace = calloutPercentSpace = 0;
                    margins = this.defineMargins(axisData);
                    availableHeight = Math.max(this.getAvailebleHeight(viewport, margins, calloutValueSpace, calloutPercentSpace), 0);
                }

                var availableWidth = this.getAvailebleWidth(viewport, margins);
                if (availableWidth < 0) {
                    this.showAxisLabels = false;
                    this.showTargetLabel = false;
                    margins.mainMargin.left = margins.mainMargin.right = Tachometer.ReducedHorizontalMargin;
                    availableWidth = viewport.width - margins.mainMargin.right - margins.mainMargin.left;
                    if (availableWidth < 0) {
                        availableWidth = 0;
                        this.showCalloutValue = false;
                        this.showCalloutPercent = false;
                    }
                }
                translation = this.calculateGaugeTranslation(axisData, axisData.startAngle, axisData.endAngle, availableHeight, availableWidth);
            }

            //the translation above should be moved down by this much to accomodate for target and axisLabels and margin
            var translationOffsetY = margins.mainMargin.top + margins.labelMargin.top + margins.targetMargin.top;
            translation.yOffset += translationOffsetY;
            translation.calloutyOffset += translationOffsetY + margins.labelMargin.bottom + margins.targetMargin.bottom;
            //the translation above should be moved right by this much to accomodate for target and axisLabels and margin
            var translationOffsetX = margins.mainMargin.left + Math.max(margins.labelMargin.left, margins.targetMargin.left);
            translation.xOffset += translationOffsetX;
            translation.calloutxOffset += translationOffsetX;

            viewModel.viewportHeight = viewport.height;
            viewModel.viewportWidth = viewport.width;
            viewModel.availableHeight = availableHeight;
            viewModel.availableWidth = availableWidth;
            viewModel.axis = this.completeAxis(axisData, translation);
            viewModel.callout = this.completeCallout(callout, translation);
            return viewModel;
        }

        public drawViewPort(viewModel: TachometerViewModel): void {
            this.updateVisualComponents(viewModel);
            this.updateCallout(viewModel);//callout should be updated after axis labels
            this.axisLabels = this.createAxisLabels();
            this.updateAxisLabelText(viewModel.axis, this.axisLabels);
            this.updateTarget(viewModel);//target should be updated after axis labels and callout

            this.svg.attr('height', this.currentViewport.height).attr('width', this.currentViewport.width);
        }

        private transformTachometerData(dataView: DataView): TachometerAxisData {
            var axisData = this.resetTachometerData();
            axisData = this.transformTachometerDataRoles(dataView, axisData);
            axisData = this.transformTachometerSettings(dataView, axisData);

            return axisData;
        }

        public static getMetaDataColumn(dataView: DataView) {
            if (dataView && dataView.metadata && dataView.metadata.columns) {
                for (var i = 0, ilen = dataView.metadata.columns.length; i < ilen; i++) {
                    var column = dataView.metadata.columns[i];
                    if (column.isMeasure) {
                        return column;
                    }
                }
            }
            return null;
        }

         private transformCalloutValue(dataView: DataView, axisData: TachometerAxisData): TachometerDataLabelsData {
            var callout = Tachometer.transformDataLabelSettings(dataView, 'calloutValue', Tachometer.getDefaultTachometerCalloutSettings());
            if (callout.show) {
                var value = axisData.value;
                var formatter = this.getFormatter(callout.displayUnits, callout.precision, value);
                var formattedValue = formatter.format(value);
                callout.formattedValue = formattedValue;
                callout.textWidth = Tachometer.getTextWidth(callout.fontSizePx, formattedValue);
            }
            return callout;
        }

        private transformCalloutPercent(dataView: DataView, axisData: TachometerAxisData): TachometerDataLabelsData {
            var callout = Tachometer.transformDataLabelSettings(dataView, 'calloutPercent', Tachometer.getDefaultTachometerCalloutPercentSettings());
            return callout;
        }

        private setCalloutPercentValue(calloutPercent: TachometerDataLabelsData, axisData: TachometerAxisData): TachometerDataLabelsData {
            if (calloutPercent && calloutPercent.show) {
                var value = calloutPercent.invert ? 100 - axisData.percent : axisData.percent;
                var formatter = this.getFormatter(calloutPercent.displayUnits, calloutPercent.precision, value, true);
                var formattedValue = formatter.format(value);
                formattedValue = (formattedValue === undefined) ? ' [-%]' : ' [' + formattedValue + '%]';
                calloutPercent.formattedValue = formattedValue;
                calloutPercent.textWidth = Tachometer.getTextWidth(calloutPercent.fontSizePx, formattedValue);
            }
            return calloutPercent;
        }
         private completeTargetTextProperties(axis: TachometerAxisData) {
            //this method has to be called before we calculate the gauge radius but
            //after reading target Properties as well as gauge axis label properties becaust of the dependancy below
            var targetSettings = axis.target;
            if (targetSettings.show) {
                var dataLabels = axis.dataLabels;
                var value = targetSettings.value;
                var formatter = this.getFormatter(dataLabels.displayUnits, dataLabels.precision, value); //Note: Target uses DataLabel settings
                var formattedValue = formatter.format(value);
                targetSettings.formattedValue = formattedValue;
                targetSettings.textWidth = Tachometer.getTextWidth(targetSettings.fontSizePx, formattedValue);
            }
        }
         private showLabelText(): boolean {
            if (this.tachometerSmallViewPortProperties) {
                if (this.tachometerSmallViewPortProperties.hideTachometerSideNumbersOnSmallViewPort) {
                    if (this.currentViewport.height < this.tachometerSmallViewPortProperties.MinHeightTachometerSideNumbersVisible) {
                        return false;
                    }
                }
            }
            return true;
        }

         private getWiderFormatter(dataLabelSettings: TachometerDataLabelsData, value1: number, value2: number): IValueFormatter {
            var widerLabelValue = Math.abs(value1) > Math.abs(value2) ? value1 : value2;
            return this.getFormatter(dataLabelSettings.displayUnits, dataLabelSettings.precision, widerLabelValue);
        }

        private defineMargins(axisData: TachometerAxisData): Margins {
            if (this.tachometerSmallViewPortProperties) {
                if (this.tachometerSmallViewPortProperties.smallTachometerMarginsOnSmallViewPort && (this.currentViewport.height < this.tachometerSmallViewPortProperties.MinHeightTachometerSideNumbersVisible)) {
                    var smallMargin = this.tachometerSmallViewPortProperties.TachometerMarginsOnSmallViewPort;
                    var margins: Margins = {
                        mainMargin: { top: smallMargin, bottom: smallMargin, left: smallMargin, right: smallMargin },
                        labelMargin: this.getZeroMargin(),
                        targetMargin: this.getZeroMargin()
                    };
                    return margins;
                }
            }

            var targetMargin: IMargin = this.addPadding(this.getTargetMargin(axisData), this.gaugeStyle.target.padding);
            var labelMargin: IMargin = this.addPadding(this.getLabelMargins(axisData), this.gaugeStyle.labels.padding);

            var MainMargin = {
                top: (targetMargin.top + labelMargin.top) > 0 ? Tachometer.ReducedVerticaltMargin : Tachometer.DefaultMarginSettings.top ,
                bottom: (targetMargin.bottom + labelMargin.bottom) > 0 ? Tachometer.ReducedVerticaltMargin : Tachometer.DefaultMarginSettings.bottom,
                left: (targetMargin.left + labelMargin.left) > 0 ? Tachometer.ReducedHorizontalMargin : Tachometer.DefaultMarginSettings.left,
                right: (targetMargin.right + labelMargin.right) > 0 ? Tachometer.ReducedHorizontalMargin: Tachometer.DefaultMarginSettings.right,
            };

            return {
                mainMargin: MainMargin,
                labelMargin: labelMargin,
                targetMargin: targetMargin
            };
        }

        private addPadding(margin: IMargin, padding:number): IMargin {
            return {
                top: margin.top > 0 ? margin.top + padding : 0,
                bottom: margin.bottom > 0 ? margin.bottom + padding : 0,
                left: margin.left > 0 ? margin.left + padding : 0,
                right: margin.right > 0 ? margin.right + padding : 0
            };
        }

        private getTargetMargin(axisData: TachometerAxisData): IMargin {
            var targetMargin = this.getZeroMargin();

            var target = axisData ? axisData.target : null;

            if (target == null || !this.showTargetLabel) {
                return targetMargin;
            }
            var verticalMargin = target.textHeight;
            var horizontalMargin = target.textWidth;
            var startAngle = axisData.startAngle;
            var endAngle = axisData.endAngle;
            var startQuadrant: number = axisData.startQuadrant;
            var endQuadrant: number = axisData.endQuadrant;
            var cosAlpha: number = Math.abs(axisData.cosStartAngle);
            var cosBeta: number = Math.abs(axisData.cosEndAngle);
            var targetAngle = this.axisScale(target.value);
            var unitRadialClosenessThreshold = Math.abs(Math.cos(Tachometer.RadialClosenessThreshold));
            //get general case targetMargins
            targetMargin = this.setClosestMargin(targetMargin, targetAngle, verticalMargin, horizontalMargin);

            //handle special cases
            switch (startQuadrant) {
                case 1:
                    switch (endQuadrant) {
                        case 1:
                            if (cosAlpha > cosBeta) {//start angle < endAngle
                                targetMargin.right = horizontalMargin;
                                if (targetAngle - startAngle < Tachometer.RadialClosenessThreshold) {//close to start
                                    targetMargin.top = verticalMargin;
                                }
                                if (this.showAxisLabels) { //Add room to adjust if axis labels are present
                                    if (Math.abs(Math.cos(targetAngle)) > unitRadialClosenessThreshold) {//close to vertical
                                        targetMargin.left = horizontalMargin;
                                    }
                                    else if (Math.sin(targetAngle) > unitRadialClosenessThreshold) { //close to PI/2
                                        targetMargin.bottom = verticalMargin;
                                    }
                                }
                            }
                            break;
                        case 2:
                            targetMargin.right = horizontalMargin;
                            if (targetAngle - startAngle < Tachometer.RadialClosenessThreshold) {
                                targetMargin.top = verticalMargin;
                                if ((this.showAxisLabels) //Add room to adjust if axis labels are present
                                    && (Math.abs(Math.cos(targetAngle)) > unitRadialClosenessThreshold)) {//close to vertical
                                    targetMargin.left = horizontalMargin;
                                }
                            }
                            else if (endAngle - targetAngle < Tachometer.RadialClosenessThreshold) {
                                targetMargin.bottom = verticalMargin;
                                if ((this.showAxisLabels) //Add room to adjust if axis labels are present
                                    && (Math.abs(Math.cos(targetAngle)) > unitRadialClosenessThreshold)) {//close to vertical
                                    targetMargin.left = horizontalMargin;
                                }
                            }
                            break;
                        case 3:
                            if (targetAngle - startAngle < Tachometer.RadialClosenessThreshold) {
                                targetMargin.top = verticalMargin;
                                if (this.showAxisLabels) { //Add room to adjust if axis labels are present
                                    if (Math.abs(Math.cos(targetAngle)) > unitRadialClosenessThreshold) {//close to vertical
                                        targetMargin.left = horizontalMargin;
                                    }
                                }
                            }
                            else if (endAngle - targetAngle < Tachometer.RadialClosenessThreshold) {
                                targetMargin.left = horizontalMargin;
                                if ((this.showAxisLabels) //Add room to adjust if axis labels are present
                                    && ((Math.abs(Math.sin(targetAngle)) > unitRadialClosenessThreshold) //closer to horizontal and start Angle too close to horizontal
                                        && ((endAngle - startAngle - Math.PI) < Tachometer.RadialClosenessThreshold))) {
                                    targetMargin.top = verticalMargin;
                                }
                            }
                            break;
                        case 4:
                            if (targetAngle - startAngle < Tachometer.RadialClosenessThreshold) { //closer to start
                                if (Math.abs(Math.sin(endAngle - startAngle)) < unitRadialClosenessThreshold) { //StartAngle closer to vertical than endAngle
                                    targetMargin.top = verticalMargin;
                                }
                            }
                            else if (endAngle - targetAngle < Tachometer.RadialClosenessThreshold) {//closer to end
                                if (Math.abs(Math.sin(endAngle - startAngle)) > unitRadialClosenessThreshold) {//endAngle closer to vertical than endAngle
                                    targetMargin.top = verticalMargin;
                                }
                            }
                            break;
                        default: //this should not be reached
                            break;
                    }
                    break;
                case 2:
                    switch (endQuadrant) {
                        case 1:
                            if (targetAngle - startAngle < Tachometer.RadialClosenessThreshold) { //closer to start
                                targetMargin.right = horizontalMargin;
                            }
                            else if (endAngle - targetAngle < Tachometer.RadialClosenessThreshold) {//closer to end
                                targetMargin.right = horizontalMargin;
                            }
                            break;
                        case 2:
                            if (cosAlpha < cosBeta) {//startAngle < endAngle
                                targetMargin.right = horizontalMargin;
                                if ((this.showAxisLabels) //Add room to adjust if axis labels are present
                                    && (Math.abs(Math.sin(targetAngle)) > unitRadialClosenessThreshold)) { //closer to PI/2
                                    targetMargin.top = verticalMargin;
                                }
                                if (endAngle - targetAngle < Tachometer.RadialClosenessThreshold) {
                                    targetMargin.bottom = verticalMargin;
                                }
                            }
                            break;
                        case 3:
                            if (targetAngle - startAngle < Tachometer.RadialClosenessThreshold) { //closer to start
                                targetMargin.right = horizontalMargin;
                            }
                            else if (endAngle - targetAngle < Tachometer.RadialClosenessThreshold) {//closer to end
                                targetMargin.left = horizontalMargin;
                            }
                            if (Math.abs(Math.sin(targetAngle)) > unitRadialClosenessThreshold) { //closer to horizontal
                                targetMargin.top = verticalMargin;
                            }
                            break;
                        case 4:
                            if (targetAngle - startAngle < Tachometer.RadialClosenessThreshold) { //closer to start
                                targetMargin.right = horizontalMargin;
                                if ((this.showAxisLabels) //Add room to adjust if axis labels are present
                                    && ((Math.abs(Math.sin(targetAngle)) > unitRadialClosenessThreshold) //closer to horizontal and end Angle too close to horizontal
                                        && ((endAngle - startAngle - Math.PI) < Tachometer.RadialClosenessThreshold))) {
                                    targetMargin.top = verticalMargin;
                                }
                            }
                            else if (endAngle - targetAngle < Tachometer.RadialClosenessThreshold) {//closer to end
                                targetMargin.top = verticalMargin;
                            }
                            break;
                        default: //this should not be reached
                            break;
                    }
                    break;
                case 3:
                    switch (endQuadrant) {
                        case 1:
                            if (targetAngle - startAngle < Tachometer.RadialClosenessThreshold) { //closer to start
                                targetMargin.bottom = verticalMargin;
                                if ((this.showAxisLabels) //Add room to adjust if axis labels are present
                                    && ((Math.abs(Math.cos(targetAngle)) > unitRadialClosenessThreshold) //closer to vertical and end Angle too close to vertical
                                        && ((endAngle - startAngle - Math.PI) < Tachometer.RadialClosenessThreshold))) {
                                    targetMargin.left = horizontalMargin;
                                }
                            }
                            else if (endAngle - targetAngle < Tachometer.RadialClosenessThreshold) {//closer to end
                                targetMargin.right = horizontalMargin;
                            }
                            break;
                        case 2:
                            if (targetAngle - startAngle < Tachometer.RadialClosenessThreshold) { //closer to start
                                targetMargin.bottom = verticalMargin;
                            }
                            else if (endAngle - targetAngle < Tachometer.RadialClosenessThreshold) {//closer to end
                                targetMargin.bottom = verticalMargin;
                            }
                            break;
                        case 3:
                            if (cosAlpha > cosBeta) { //start angle < end angle
                                if (targetAngle - startAngle < Tachometer.RadialClosenessThreshold) { //closer to start
                                    targetMargin.bottom = verticalMargin;
                                    if ((this.showAxisLabels) //Add room to adjust if axis labels are present
                                        && (Math.abs(Math.cos(targetAngle)) > unitRadialClosenessThreshold)) { //closer to vertical
                                        targetMargin.right = horizontalMargin;
                                    }
                                }
                                if (endAngle - targetAngle < Tachometer.RadialClosenessThreshold) {//closer to end
                                    targetMargin.left = horizontalMargin;
                                    if ((this.showAxisLabels) //Add room to adjust if axis labels are present
                                        && (Math.abs(Math.sin(targetAngle)) > unitRadialClosenessThreshold)) { //closer to horizontal
                                        targetMargin.top = verticalMargin;
                                    }
                                }
                            }
                            break;
                        case 4:
                            if (targetAngle - startAngle < Tachometer.RadialClosenessThreshold) { //closer to start
                                targetMargin.bottom = verticalMargin;
                            }
                            else if (endAngle - targetAngle < Tachometer.RadialClosenessThreshold) {//closer to end
                                targetMargin.top = verticalMargin;
                            }
                            if ((this.showAxisLabels) //Add room to adjust if axis labels are present
                                && (Math.abs(Math.cos(targetAngle)) > unitRadialClosenessThreshold)) { //closer to vertical
                                targetMargin.right = horizontalMargin;
                            }
                            break;
                        default: //this should not be reached
                            break;
                    }
                    break;
                case 4:
                    switch (endQuadrant) {
                        case 1:
                            if (targetAngle - startAngle < Tachometer.RadialClosenessThreshold) { //closer to start
                                targetMargin.left = horizontalMargin;
                            }
                            if (endAngle - targetAngle < Tachometer.RadialClosenessThreshold) {//closer to end
                                targetMargin.right = horizontalMargin;
                            }
                            if ((this.showAxisLabels) //Add room to adjust if axis labels are present
                                && (Math.abs(Math.sin(targetAngle)) > unitRadialClosenessThreshold)) { //closer to horizontal
                                targetMargin.bottom = verticalMargin;
                            }
                            break;
                        case 2:
                            if (targetAngle - startAngle < Tachometer.RadialClosenessThreshold) { //closer to start
                                targetMargin.left = horizontalMargin;
                                if ((this.showAxisLabels) //Add room to adjust if axis labels are present
                                    && ((Math.sin(targetAngle) > unitRadialClosenessThreshold) //closer to horiontal and end Angle too close to horizontal
                                        && ((endAngle - startAngle - Math.PI) < Tachometer.RadialClosenessThreshold))) {
                                    targetMargin.bottom = verticalMargin;
                                }
                            }
                            else if (endAngle - targetAngle < Tachometer.RadialClosenessThreshold) {//closer to end
                                targetMargin.bottom = verticalMargin;
                            }
                            break;
                        case 3:
                            if (targetAngle - startAngle < Tachometer.RadialClosenessThreshold) { //closer to start
                                targetMargin.left = horizontalMargin;
                            }
                            else if (endAngle - targetAngle < Tachometer.RadialClosenessThreshold) {//closer to end
                                targetMargin.left = horizontalMargin;
                            }
                            break;
                        case 4:
                            if (cosAlpha < cosBeta) { //start angle < end angle
                                if (targetAngle - startAngle < Tachometer.RadialClosenessThreshold) { //closer to start
                                    targetMargin.left = horizontalMargin;
                                }
                                else if (endAngle - targetAngle < Tachometer.RadialClosenessThreshold) {//closer to end
                                    targetMargin.top = verticalMargin;
                                }
                                if (this.showAxisLabels) {//Add room to adjust if axis labels are present
                                    if (Math.abs(Math.cos(targetAngle)) > unitRadialClosenessThreshold) { //close to vertical
                                        targetMargin.right = horizontalMargin;
                                    }
                                    else if (Math.abs(Math.sin(targetAngle)) > unitRadialClosenessThreshold) { //close to horizontal
                                        targetMargin.bottom = verticalMargin;
                                    }
                                }
                            }
                            break;
                        default: //this should not be reached
                            break;
                    }
                    break;
                default: //this should not be reached
                    break;
            }
            return targetMargin;
        }

        private getLabelMargins(axisData: TachometerAxisData): IMargin {
            var labelMargin = this.getZeroMargin();
            var dataLabels: TachometerDataLabelsData = axisData ? axisData.dataLabels : null;

            if (dataLabels == null || !this.showAxisLabels) {
                return labelMargin;
            }
            var labelFontSize = dataLabels.textHeight;
            var labelFontLength = dataLabels.textWidth;
            var startQuadrant: number = axisData.startQuadrant;
            var endQuadrant: number = axisData.endQuadrant;
            var cosAlpha: number = Math.abs(axisData.cosStartAngle);
            var cosBeta: number = Math.abs(axisData.cosEndAngle);
            var startAngle: number = axisData.startAngle;
            var endAngle: number = axisData.endAngle;

            switch (startQuadrant) {
                case 1:
                    switch (endQuadrant) {
                        case 1:
                            if (cosAlpha > cosBeta) {//start angle < endAngle
                                if (endAngle > Tachometer.PiBy4) {
                                    //closer to the right
                                    labelMargin.right += labelFontLength;
                                }
                                else {
                                    labelMargin.right = Tachometer.UnitMargin;
                                }
                                if (startAngle < Tachometer.PiBy4) {
                                    //closer to the top
                                    labelMargin.top += labelFontSize;
                                }
                                else {
                                    labelMargin.top = Tachometer.UnitMargin;
                                }
                            }
                            else {
                                labelMargin.top += labelFontSize;
                                labelMargin.bottom += labelFontSize;
                                labelMargin.left += labelFontLength;
                                labelMargin.right += labelFontLength;
                            }
                            break;
                        case 2:
                            labelMargin.right += labelFontLength;
                            if (startAngle < Tachometer.PiBy4) {
                                //closer to the top
                                labelMargin.top += labelFontSize;
                            }
                            else {
                                labelMargin.top = Tachometer.UnitMargin;
                            }
                            if (endAngle > Tachometer.ThreePiBy4) {
                                //closer to the bottom
                                labelMargin.bottom += labelFontSize;
                            }
                            else {
                                labelMargin.bottom = Tachometer.UnitMargin;
                            }
                            break;
                        case 3:
                            labelMargin.right += labelFontLength;
                            labelMargin.bottom += labelFontSize;
                            if (startAngle < Tachometer.PiBy4) {
                                //closer to the top
                                labelMargin.top += labelFontSize;
                            }
                            else {
                                labelMargin.top = Tachometer.UnitMargin;
                            }
                            if (endAngle > Tachometer.MinusThreePiBy4) {
                                //closer to the left
                                labelMargin.left += labelFontLength;
                            }
                            else {
                                labelMargin.left = Tachometer.UnitMargin;
                            }
                            break;
                        case 4:
                            labelMargin.right += labelFontLength;
                            labelMargin.bottom += labelFontSize;
                            labelMargin.left += labelFontLength;
                            if ((startAngle < Tachometer.PiBy4) || (endAngle > Tachometer.MinusPiBy4)) {
                                //closer to the top
                                labelMargin.top += labelFontSize;
                            }
                            else {
                                labelMargin.top = Tachometer.UnitMargin;
                            }
                            break;
                        default: //this should not be reached
                            break;
                    }
                    break;
                case 2:
                    switch (endQuadrant) {
                        case 1:
                            labelMargin.bottom += labelFontSize;
                            labelMargin.left += labelFontLength;
                            labelMargin.top += labelFontSize;
                            if ((startAngle < Tachometer.ThreePiBy4) || (endAngle > Tachometer.PiBy4)) {
                                //closer to the right
                                labelMargin.right += labelFontLength;
                            }
                            else {
                                labelMargin.right = Tachometer.UnitMargin;
                            }
                            break;
                        case 2:
                            if (cosAlpha < cosBeta) {//startAngle < endAngle
                                if (startAngle < Tachometer.ThreePiBy4) {
                                    //closer to the right
                                    labelMargin.right += labelFontLength;
                                }
                                else {
                                    labelMargin.right = Tachometer.UnitMargin;
                                }
                                if (endAngle > Tachometer.ThreePiBy4) {
                                    //closer to the bottom
                                    labelMargin.bottom += labelFontSize;
                                }
                                else {
                                    labelMargin.bottom = Tachometer.UnitMargin;
                                }
                            }
                            else { //startAngle > endAngle
                                labelMargin.top += labelFontSize;
                                labelMargin.bottom += labelFontSize;
                                labelMargin.left += labelFontLength;
                                labelMargin.right += labelFontLength;
                            }
                            break;
                        case 3:
                            labelMargin.bottom += labelFontSize;
                            if (startAngle < Tachometer.ThreePiBy4) {
                                //closer to the right
                                labelMargin.right += labelFontLength;
                            }
                            else {
                                labelMargin.right = Tachometer.UnitMargin;
                            }
                            if (endAngle > Tachometer.MinusThreePiBy4) {
                                //closer to the left
                                labelMargin.left += labelFontLength;
                            }
                            else {
                                labelMargin.left = Tachometer.UnitMargin;
                            }
                            break;
                        case 4:
                            labelMargin.bottom += labelFontSize;
                            labelMargin.left += labelFontLength;
                            if (endAngle > Tachometer.MinusPiBy4) {
                                //closer to the top
                                labelMargin.top += labelFontSize;
                            }
                            else {
                                labelMargin.top = Tachometer.UnitMargin;
                            }
                            break;
                        default: //this should not be reached
                            break;
                    }
                    break;
                case 3:
                    switch (endQuadrant) {
                        case 1:
                            labelMargin.left += labelFontLength;
                            labelMargin.top += labelFontSize;
                            if (endAngle > Tachometer.PiBy4) {
                                //closer to the right
                                labelMargin.right += labelFontLength;
                            }
                            else {
                                labelMargin.right = Tachometer.UnitMargin;
                            }
                            if (startAngle < Tachometer.MinusThreePiBy4) {
                                //closer to the bottom
                                labelMargin.bottom += labelFontSize;
                            }
                            else {
                                labelMargin.bottom = Tachometer.UnitMargin;
                            }
                            break;
                        case 2:
                            labelMargin.left += labelFontLength;
                            labelMargin.top += labelFontSize;
                            labelMargin.right += labelFontLength;
                            if ((startAngle < Tachometer.MinusThreePiBy4) || (endAngle > Tachometer.ThreePiBy4)) {
                                //closer to the bottom
                                labelMargin.bottom += labelFontSize;
                            }
                            else {
                                labelMargin.bottom = Tachometer.UnitMargin;
                            }
                            break;
                        case 3:
                            if (cosAlpha > cosBeta) { //start angle < end angle
                                if (startAngle < Tachometer.MinusThreePiBy4) {
                                    //closer to the bottom
                                    labelMargin.bottom += labelFontSize;
                                }
                                else {
                                    labelMargin.bottom = Tachometer.UnitMargin;
                                }
                                if (endAngle > Tachometer.MinusThreePiBy4) {
                                    //closer to the left
                                    labelMargin.left += labelFontLength;
                                }
                                else {
                                    labelMargin.left = Tachometer.UnitMargin;
                                }
                            }
                            else {
                                labelMargin.top += labelFontSize;
                                labelMargin.bottom += labelFontSize;
                                labelMargin.left += labelFontLength;
                                labelMargin.right += labelFontLength;
                            }
                            break;
                        case 4:
                            labelMargin.left += labelFontLength;
                            if (startAngle < Tachometer.MinusThreePiBy4) {
                                //closer to the bottom
                                labelMargin.bottom += labelFontSize;
                            }
                            else {
                                labelMargin.bottom = Tachometer.UnitMargin;
                            }
                            if (endAngle > Tachometer.MinusPiBy4) {
                                //closer to the rop
                                labelMargin.top += labelFontSize;
                            }
                            else {
                                labelMargin.top = Tachometer.UnitMargin;
                            }
                            break;
                        default: //this should not be reached
                            break;
                    }
                    break;
                case 4:
                    switch (endQuadrant) {
                        case 1:
                            labelMargin.top += labelFontSize;
                            if (startAngle < Tachometer.MinusPiBy4) {
                                //closer to the left
                                labelMargin.left += labelFontLength;
                            }
                            else {
                                labelMargin.left = Tachometer.UnitMargin;
                            }
                            if (endAngle > Tachometer.PiBy4) {
                                //closer to the right
                                labelMargin.right += labelFontLength;
                            }
                            else {
                                labelMargin.right = Tachometer.UnitMargin;
                            }
                            break;
                        case 2:
                            labelMargin.top += labelFontSize;
                            labelMargin.right += labelFontLength;
                            if (startAngle < Tachometer.MinusPiBy4) {
                                //closer to the left
                                labelMargin.left += labelFontLength;
                            }
                            else {
                                labelMargin.left = Tachometer.UnitMargin;
                            }
                            if (endAngle > Tachometer.ThreePiBy4) {
                                //closer to the bottom
                                labelMargin.bottom += labelFontSize;
                            }
                            else {
                                labelMargin.bottom = Tachometer.UnitMargin;
                            }
                            break;
                        case 3:
                            labelMargin.top += labelFontSize;
                            labelMargin.right += labelFontLength;
                            labelMargin.bottom += labelFontSize;
                            if (startAngle < Tachometer.MinusPiBy4) {
                                //closer to the left
                                labelMargin.left += labelFontLength;
                            }
                            else {
                                labelMargin.left = Tachometer.UnitMargin;
                            }
                            break;
                        case 4:
                            if (cosAlpha < cosBeta) { //start angle < end angle
                                if (startAngle < Tachometer.MinusPiBy4) {
                                    //closer to the left
                                    labelMargin.left += labelFontLength;
                                }
                                else {
                                    labelMargin.left = Tachometer.UnitMargin;
                                }
                                if (endAngle > Tachometer.MinusPiBy4) {
                                    //closer to the top
                                    labelMargin.top += labelFontSize;
                                }
                                else {
                                    labelMargin.top = Tachometer.UnitMargin;
                                }
                            }
                            else {
                                labelMargin.top += labelFontSize;
                                labelMargin.bottom += labelFontSize;
                                labelMargin.left += labelFontLength;
                                labelMargin.right += labelFontLength;
                            }
                            break;
                        default: //this should not be reached
                            break;
                    }
                    break;
                default: //this should not be reached
                    break;
            }
            return labelMargin;
        }

        private setClosestMargin(targetMargin: IMargin, angle: number, verticalMargin: number, horizontalMargin: number): IMargin {
            var cosAngle = Math.cos(angle);
            var sinAngle = Math.sin(angle);

            if (sinAngle >= 0) {
                if (cosAngle >= 0) {
                    if (Math.abs(cosAngle) < Tachometer.CloseToLeftOrRightThreshold) {
                        targetMargin.right = horizontalMargin;
                    }
                    if (Math.abs(cosAngle) > Tachometer.CloseToTopOrBottomThreshold) {
                        targetMargin.top = verticalMargin;
                    }
                }
                else {
                    if (Math.abs(cosAngle) < Tachometer.CloseToLeftOrRightThreshold) {
                        targetMargin.right = horizontalMargin;
                    }
                    if (Math.abs(cosAngle) > Tachometer.CloseToTopOrBottomThreshold) {
                        targetMargin.bottom = verticalMargin;
                    }
                }
            }
            else {
                if (cosAngle >= 0) {
                    if (Math.abs(cosAngle) < Tachometer.CloseToLeftOrRightThreshold) {
                        targetMargin.left = horizontalMargin;
                    }
                    if (Math.abs(cosAngle) > Tachometer.CloseToTopOrBottomThreshold) {
                        targetMargin.top = verticalMargin;
                    }
                }
                else {
                    if (Math.abs(cosAngle) < Tachometer.CloseToLeftOrRightThreshold) {
                        targetMargin.left = horizontalMargin;
                    }
                    if (Math.abs(cosAngle) > Tachometer.CloseToTopOrBottomThreshold) {
                        targetMargin.bottom = verticalMargin;
                    }
                }
            }
            return targetMargin;
        }

         private getAvailebleWidth(viewport: IViewport, margins: Margins): number {
            return viewport.width
                - margins.mainMargin.left - margins.mainMargin.right
                - Math.max(margins.targetMargin.right, margins.labelMargin.right)
                - Math.max(margins.targetMargin.left, margins.labelMargin.left) ;
        }

        //Convert the percent value of offset into a pixel value 
        private static translateUserYOffset
            (baseYOffset: number, callout: TachometerDataLabelsData, height: number, padding: number): number {
            var yOffsetPercent = callout.offset.y;

            if (yOffsetPercent !== 0) {
                var topThreshold = padding;
                var bottomThreshold = height - callout.textHeight - padding;
                var userYOffset = yOffsetPercent / 100 * baseYOffset;
                var offset = userYOffset + baseYOffset;

                return offset < topThreshold
                    ? topThreshold - baseYOffset //goinig too high
                    : offset > bottomThreshold
                        ? bottomThreshold - baseYOffset //going too low
                        : userYOffset;
            }
            else {
                return 0;
            }
        }

        private getAvailebleHeight(viewport: IViewport, margins: Margins, calloutValueSpace: number, calloutPercentSpace: number): number {
            return viewport.height
                - margins.mainMargin.top - margins.mainMargin.bottom
                - margins.labelMargin.top - margins.labelMargin.bottom
                - margins.targetMargin.top - margins.targetMargin.bottom
                - calloutValueSpace
                - calloutPercentSpace;
        }

        /*
        * Get arcRadius and translation Data depending on start angle, endAngle of the arc and the height and
        * width of the frame in which to draw the arc.
        * Assumptions:
        * 1. Arc is drawn clockwise from startAngle to endAngle and should be centered in the frame.
        * 2. startAngle and endAngle are in radians and can be positive or negative.
        * 3. startAngle and endAngle canbe negative infinity to positive infinity.
        * 4. startAngle can be larger or smaller or equal to endAngle. 
        */
        private calculateGaugeTranslation(axisData: TachometerAxisData, startAngle: number, endAngle: number, height: number, width: number
        ): TachometerTranslationSettings {
            var radius: number;
            var startQuadrant: number = axisData.startQuadrant;
            var endQuadrant: number = axisData.endQuadrant;
            var xOffset: number; //translation along x axis
            var yOffset: number; //translation along y axis
            var arcHeight: number; //height of the arc along y axis
            var arcWidth: number; //width of the arc along x axis
            var calloutyOffset: number; //Y offset of callout

            var sinAlpha: number = Math.abs(axisData.sinStartAngle);
            var sinBeta: number = Math.abs(axisData.sinEndAngle);
            var cosAlpha: number = Math.abs(axisData.cosStartAngle);
            var cosBeta: number = Math.abs(axisData.cosEndAngle);

            switch (startQuadrant) {
                case 1:
                    switch (endQuadrant) {
                        case 1:
                            if (cosAlpha > cosBeta) { //start angle < end angle
                                radius = Math.min(width / sinBeta, height / cosAlpha);
                                arcHeight = radius * cosAlpha;
                                arcWidth = radius * sinBeta;
                                xOffset = width > arcWidth ? (width - arcWidth) / 2 : 0;
                                yOffset = height > arcHeight ? (height + arcHeight) / 2 : height;
                                calloutyOffset = yOffset;
                            }
                            else {
                                radius = Math.min(width / 2, height / 2);
                                xOffset = width / 2;
                                yOffset = height / 2;
                                calloutyOffset = yOffset + radius;
                            }
                            break;
                        case 2:
                            radius = Math.min(width, height / (cosAlpha + cosBeta));
                            xOffset = width > radius ? (width - radius) / 2 : 0;
                            arcHeight = radius * (cosAlpha + cosBeta);
                            yOffset = height > arcHeight ?
                                (height - arcHeight) / 2 + radius * cosAlpha
                                : radius * cosAlpha;

                            calloutyOffset = yOffset + radius * cosBeta;
                            break;
                        case 3:
                            radius = Math.min(width / (1 + sinBeta), height / (1 + cosAlpha));
                            arcHeight = radius + radius * cosAlpha;
                            arcWidth = radius + radius * sinBeta;
                            xOffset = width > arcWidth ? (width + arcWidth) / 2 - radius : width - radius;
                            yOffset = height > arcHeight ? (height + arcHeight) / 2 - radius : height - radius;
                            calloutyOffset = yOffset + radius;
                            break;
                        case 4:
                            var max = Math.max(cosAlpha, cosBeta);
                            radius = Math.min(width / 2, height / (1 + max));
                            xOffset = width / 2;
                            arcHeight = radius + radius * max;
                            yOffset = height > arcHeight ? (height + arcHeight) / 2 - radius : height - radius;
                            calloutyOffset = yOffset + radius;
                            break;
                        default: //this should not be reached
                            break;
                    }
                    break;
                case 2:
                    switch (endQuadrant) {
                        case 1:
                            var max = Math.max(sinAlpha, sinBeta);
                            radius = Math.min(width / (1 + max), height / 2);
                            arcWidth = radius + radius * max;
                            xOffset = width > arcWidth ? (width - arcWidth) / 2 + radius : radius;
                            yOffset = height / 2;
                            calloutyOffset = yOffset + radius;
                            break;
                        case 2:
                            if (cosAlpha < cosBeta) {//start angle < end angle
                                radius = Math.min(width / sinAlpha, height / cosBeta);
                                arcHeight = radius * cosBeta;
                                arcWidth = radius * sinAlpha;
                                xOffset = width > arcWidth ? (width - arcWidth) / 2 : 0;
                                yOffset = height > arcHeight ? (height - arcHeight) / 2 : 0;
                                calloutyOffset = yOffset + radius * cosBeta;
                            }
                            else {
                                radius = Math.min(width / 2, height / 2);
                                xOffset = width / 2;
                                yOffset = height / 2;
                                calloutyOffset = yOffset + radius;
                            }
                            break;
                        case 3:
                            var widthFator = sinAlpha + sinBeta;
                            radius = Math.min(width / widthFator, height);
                            arcHeight = radius;
                            arcWidth = radius * widthFator;
                            xOffset = width > arcWidth ? (width + arcWidth) / 2 - radius * sinAlpha : width - radius * sinAlpha;
                            yOffset = height > arcHeight ? (height - arcHeight) / 2 : 0;
                            calloutyOffset = yOffset + radius;
                            break;
                        case 4:
                            radius = Math.min(width / (1 + sinAlpha), height / (1 + cosBeta));
                            arcHeight = radius * (1 + cosBeta);
                            arcWidth = radius * (1 + sinBeta);
                            xOffset = width > arcWidth ? (width - arcWidth) / 2 + radius : radius;
                            yOffset = height > arcHeight ? (height + arcHeight) / 2 - radius : height - radius;
                            calloutyOffset = yOffset + radius;
                            break;
                        default: //this should not be reached
                            break;
                    }
                    break;
                case 3:
                    switch (endQuadrant) {
                        case 1:
                            radius = Math.min(width / (1 + sinBeta), height / (1 + cosAlpha));
                            arcHeight = radius + radius * cosAlpha;
                            arcWidth = radius + radius * sinBeta;
                            xOffset = width > arcWidth ? (width - arcWidth) / 2 + radius : radius;
                            yOffset = height > arcHeight ? (height - arcHeight) / 2 + radius : radius;
                            calloutyOffset = yOffset + radius * cosAlpha;
                            break;
                        case 2:
                            radius = Math.min(width / 2, height / (1 + cosAlpha), height / (1 + cosBeta));
                            xOffset = width / 2;
                            arcHeight = radius + Math.max(radius * cosAlpha, radius * cosBeta);
                            yOffset = height > arcHeight ? (height - arcHeight) / 2 + radius : radius;
                            calloutyOffset = yOffset + radius * Math.max(cosAlpha, cosBeta);
                            break;
                        case 3:
                            if (cosAlpha > cosBeta) {//start angle < end angle
                                radius = Math.min(width / sinBeta, height / cosAlpha);
                                arcHeight = radius * cosAlpha;
                                arcWidth = radius * sinBeta;
                                xOffset = width > arcWidth ? (width + arcWidth) / 2 : width;
                                yOffset = height > arcHeight ? (height - arcHeight) / 2 : 0;
                                calloutyOffset = yOffset + radius * cosAlpha;
                            }
                            else {
                                radius = Math.min(width / 2, height / 2);
                                xOffset = width / 2;
                                yOffset = height / 2;
                                calloutyOffset = yOffset + radius;
                            }
                            break;
                        case 4:
                            radius = Math.min(width, height / (cosAlpha + cosBeta));
                            arcHeight = radius * cosAlpha + radius * cosBeta;
                            arcWidth = radius;
                            xOffset = width > arcWidth ? (width + arcWidth) / 2 : width;
                            yOffset = height > arcHeight ? (height - arcHeight) / 2 + radius * cosBeta : radius * cosBeta;
                            calloutyOffset = yOffset + radius * cosAlpha;
                            break;
                        default: //this should not be reached
                            break;
                    }
                    break;
                case 4:
                    switch (endQuadrant) {
                        case 1:
                            radius = Math.min(width / (sinAlpha + sinBeta), height);
                            arcHeight = radius;
                            arcWidth = radius * (sinAlpha + sinBeta);
                            xOffset = width > arcWidth ? (width - arcWidth) / 2 + radius * sinAlpha : radius * sinAlpha;
                            yOffset = height > arcHeight ? (height + arcHeight) / 2 : height;
                            calloutyOffset = yOffset;
                            break;
                        case 2:
                            radius = Math.min(width / (1 + sinAlpha), height / (1 + cosBeta));
                            arcHeight = radius + radius * cosBeta;
                            arcWidth = radius + radius * sinAlpha;
                            xOffset = width > arcWidth ? (width + arcWidth) / 2 - radius : width - radius;
                            yOffset = height > arcHeight ? (height - arcHeight) / 2 + radius : radius;
                            calloutyOffset = yOffset + radius * cosBeta;
                            break;
                        case 3:
                            radius = Math.min(width / (1 + Math.max(sinAlpha, sinBeta)), height / 2);
                            arcWidth = radius + Math.max(radius * sinAlpha, radius * sinBeta);
                            xOffset = width > arcWidth ? (width + arcWidth) / 2 - radius : width - radius;
                            yOffset = height / 2;
                            calloutyOffset = yOffset + radius;
                            break;
                        case 4:
                            if (cosAlpha < cosBeta) {//start angle < end angle
                                radius = Math.min(width / sinAlpha, height / cosBeta);
                                arcHeight = radius * cosBeta;
                                arcWidth = radius * sinAlpha;
                                xOffset = width > arcWidth ? (width + arcWidth) / 2 : width;
                                yOffset = height > arcHeight ? (height + arcHeight) / 2 : height;
                                calloutyOffset = yOffset;
                            }
                            else {
                                radius = Math.min(width / 2, height / 2);
                                xOffset = width / 2;
                                yOffset = height / 2;
                                calloutyOffset = yOffset + radius;
                            }
                            break;
                        default: //this should not be reached
                            break;
                    }
                    break;
                default: //this should not be reached
                    break;
            }
            return {
                radius,
                startAngle,
                endAngle,
                xOffset,
                yOffset,
                calloutxOffset: width / 2,
                calloutyOffset: calloutyOffset
            };
        }
        private completeAxis(axisData: TachometerAxisData, translation: TachometerTranslationSettings): TachometerAxisData {
            var radius = translation.radius;
            //TODO Convert ranges to an array in view model
            var range1 = axisData.range1;
            var range2 = axisData.range2;
            var range3 = axisData.range3;

            var currentStart = axisData.startValue;
            var currentEnd = axisData.endValue;

            var boarders: number[] = [
                currentStart,
                range2.startValue,
                range3.startValue,
                currentEnd
            ];

            var currVal = currentEnd;
            for (var index = boarders.length - 1; index > 0; index--) {
                if (boarders[index] === Tachometer.UnintializedRangeStartValue) {
                    boarders[index] = currVal;
                }
                else {
                    currVal = boarders[index];
                }
            }

            range1.startValue = boarders[0];
            range1.endValue = range2.startValue = boarders[1];
            range2.endValue = range3.startValue = boarders[2];
            range3.endValue = boarders[3];

            axisData.range1 = this.completeAxisRange(axisData.range1, radius);
            axisData.range2 = this.completeAxisRange(axisData.range2, radius);
            axisData.range3 = this.completeAxisRange(axisData.range3, radius);

            axisData.radius = radius;
            axisData.axisLabelRadius = radius + this.gaugeStyle.labels.padding;
            var xOffset: number = translation.xOffset;
            var yOffset: number = translation.yOffset;
            axisData.offset.x = xOffset;
            axisData.offset.y = yOffset;
            axisData.transformString = SVGUtil.translate(xOffset, yOffset);
            axisData.indicator = this.completeIndicator(axisData.indicator, translation, axisData.offset, axisData.value);
            axisData.target = this.completeTarget(axisData.target, axisData);

            return axisData;
        }

         private completeCallout(callout: TachometerCalloutSettings, translation: TachometerTranslationSettings): TachometerCalloutSettings {
            callout.baseOffset.x = translation.calloutxOffset;
            callout.baseOffset.y = translation.calloutyOffset;

            return callout;
        }

         private updateVisualComponents(viewModel: TachometerViewModel): void {
            var transformString = viewModel.axis.transformString;

            var range = viewModel.axis.range1;
            var range1Arc = this.range1Arc;

            range1Arc
                .innerRadius(range.innerRadius)
                .outerRadius(range.radius)
                .startAngle(range.startAngle)
                .endAngle(range.endAngle);

            this.range1ArcPath
                .attr('d', range1Arc)
                .attr('transform', transformString)
                .style('fill', range.rangeColor);
            ;

            var range = viewModel.axis.range2;
            var range2Arc = this.range2Arc;

            range2Arc
                .innerRadius(range.innerRadius)
                .outerRadius(range.radius)
                .startAngle(range.startAngle)
                .endAngle(range.endAngle);

            this.range2ArcPath
                .attr('transform', transformString)
                .attr('d', range2Arc)
                .style('fill', range.rangeColor);

            var range = viewModel.axis.range3;
            var range3Arc = this.range3Arc;

            range3Arc
                .innerRadius(range.innerRadius)
                .outerRadius(range.radius)
                .startAngle(range.startAngle)
                .endAngle(range.endAngle);

            this.range3ArcPath
                .attr('d', range3Arc)
                .attr('transform', transformString)
                .style('fill', range.rangeColor);

            var indicator = viewModel.axis.indicator;
            this.needle
                .attr('d', Tachometer.LineFunction(indicator.needlePoints))
                .attr('transform', indicator.needletransformString)
                .style('stroke', indicator.pointerColor);

            var centerArc = this.centerArc;

            centerArc
                .innerRadius(indicator.baseInnerRadius)
                .outerRadius(indicator.baseRadius)
                .startAngle(indicator.baseStartAngle)
                .endAngle(indicator.baseEndtAngle);

            this.centerArcPath
                .attr('d', centerArc)
                .attr('transform', transformString)
                .style('fill', indicator.baseColor);
        }
        private updateCallout(viewModel: TachometerViewModel): void {
            var callout = viewModel.callout;
            var calloutValue = callout.calloutValue;
            var calloutPercent = callout.calloutPercent;
            var yOffsetBase = callout.baseOffset.y;
            var xOffsetBase = callout.baseOffset.x;

            if (this.showCalloutValue) {
                var value = calloutValue.formattedValue;

                var userYOffset = Tachometer.translateUserYOffset(yOffsetBase, calloutValue, viewModel.viewportHeight, this.gaugeStyle.callout.padding);
                var userXOffset = Tachometer.translateUserXOffset(xOffsetBase, calloutValue, viewModel.viewportWidth, calloutValue.textWidth, this.gaugeStyle.callout.padding);

                this.calloutRectangle = {
                    left: xOffsetBase + userXOffset - calloutValue.textWidth / 2,
                    top: yOffsetBase + userYOffset,
                    right: xOffsetBase + userXOffset + calloutValue.textWidth / 2,
                    bottom: yOffsetBase + userYOffset + calloutValue.textHeight,
                };

                if (this.isWithinBounds(this.calloutRectangle)) {
                    this.calloutLabel
                        .attr('transform',
                        SVGUtil.translate(
                            xOffsetBase + userXOffset,
                            this.calloutRectangle.bottom))
                        .style({
                            'fill': calloutValue.labelColor,
                            'text-anchor': 'middle',
                            'font-size': calloutValue.fontSizePx,
                            'display': '',
                        })
                        .text(value);

                    yOffsetBase = yOffsetBase + calloutValue.textHeight + this.gaugeStyle.callout.padding;
                    //Set Base for CalloutPercent
                    if (userYOffset < 0) {
                        yOffsetBase = Math.max(yOffsetBase + userYOffset, callout.baseOffset.y);
                    }
                }
                else {
                    this.calloutLabel
                        .style({
                            'display': 'none',
                        });
                    this.calloutRectangle = null;
                }
            }
            else {
                this.calloutLabel
                    .style({
                        'display': 'none',
                    });
                this.calloutRectangle = null;
            }
            if (this.showCalloutPercent) {
                var value = calloutPercent.formattedValue;
                var userYOffset = Tachometer.translateUserYOffset(yOffsetBase, calloutPercent, viewModel.viewportHeight, this.gaugeStyle.callout.padding);
                var userXOffset = Tachometer.translateUserXOffset(xOffsetBase, calloutPercent, viewModel.viewportWidth, calloutPercent.textWidth, this.gaugeStyle.callout.padding);

                this.calloutPercentRectangle = {
                    left: xOffsetBase + userXOffset - calloutPercent.textWidth / 2,
                    top: yOffsetBase + userYOffset,
                    right: xOffsetBase + userXOffset + calloutPercent.textWidth / 2,
                    bottom: yOffsetBase + userYOffset + calloutPercent.textHeight,
                };

                if (this.isOverlapping(this.calloutRectangle, this.calloutPercentRectangle) || !this.isWithinBounds(this.calloutPercentRectangle)) {
                    this.calloutPercent.style({ 'display': 'none' });
                }
                else {
                    this.calloutPercent
                        .attr('transform',
                        SVGUtil.translate(
                            xOffsetBase + userXOffset,
                            this.calloutPercentRectangle.bottom
                        ))
                        .style({
                            'fill': calloutPercent.labelColor,
                            'text-anchor': 'middle',
                            'font-size': calloutPercent.fontSizePx,
                            'display': '',
                        })
                        .text(value);
                }
            }
            else {
                this.calloutPercent.style({ 'display': 'none' });
                this.calloutPercentRectangle = null;
            }
        }
 
         private createAxisLabels(): TachometerAxisLabel[] {

            if (this.showAxisLabels) {
                if (this.axisData.dataLabels.round) {
                    return this.createNiceRoundLabels();
                }
                else {
                    return this.createEquallySpacedLabels();
                }
            }
            var axisLabels: TachometerAxisLabel[] = [];
            return axisLabels;
        }

        private updateAxisLabelText(axis: TachometerAxisData, axisLabels: TachometerAxisLabel[]) {
            this.svg.selectAll(Tachometer.LabelText.selector).remove();
            if (!this.showAxisLabels) return;

            var axisLabels = this.axisLabels;
            var labelColor = axis.dataLabels.labelColor;
            var ticCount = axisLabels.length;
            var fontSizePx = axis.dataLabels.fontSizePx;

            if (this.showAxisLabels) {
                for (var count = 0; count < ticCount; count++) {
                    var axisLabel: TachometerAxisLabel = axisLabels[count];

                    var text = this.axisLabelsGraphicsContext
                        .append('text')
                        .attr({
                            'x': axisLabel.xOffset,
                            'y': axisLabel.yOffset,
                            'dy': 0,
                            'class': Tachometer.LabelText.class
                        })
                        .style({
                            'fill': labelColor,
                            'text-anchor': axisLabel.anchor,
                            'font-size': fontSizePx
                        })
                        .text(axisLabel.displayValue)
                        .append('title').text(axisLabel.displayValue);

                    this.truncateTextIfNeeded(text, axisLabel.xOffset, axisLabel.anchor === 'start');
                    axisLabel.graphicsElement = text;
                }
            }
        }

        private updateTarget(viewModel: TachometerViewModel) {
            var target = viewModel.axis.target;

            if ((target.show)&&(target.value !== Tachometer.UnintializedStartValue)) {
                this.updateTargeIndicator(target);
                if (this.showTargetLabel) {
                    this.updateTargetText(viewModel, this.axisLabels);
                }
                else {
                    this.removeTargetElements(false);
                }
            } else {
                this.removeTargetElements(true);
            }
        }

        private resetTachometerData(): TachometerAxisData {
            var axisData = this.axisData;

            axisData.startValue = Tachometer.UnintializedStartValue;
            axisData.endValue = Tachometer.UnintializedEndValue;
            axisData.value = 0;
            axisData.tooltipInfo = [];
            axisData.valueRange = 0;
            axisData.range1.startValue = Tachometer.UnintializedRangeStartValue;
            axisData.range1.endValue = Tachometer.UnintializedEndValue;
            axisData.range2.startValue = Tachometer.UnintializedRangeStartValue;
            axisData.range2.endValue = Tachometer.UnintializedEndValue;
            axisData.range3.startValue = Tachometer.UnintializedRangeStartValue;
            axisData.range3.endValue = Tachometer.UnintializedEndValue;
            axisData.target.value = Tachometer.UnintializedStartValue;
            axisData.target.innerRadiusRatio = Tachometer.UninitializedRatio;

            return axisData;
        }

        private transformTachometerDataRoles(dataView: DataView, axisData: TachometerAxisData): TachometerAxisData {
            if (dataView && dataView.categorical && dataView.categorical.values && dataView.metadata && dataView.metadata.columns) {
                var values = dataView.categorical.values;

                for (var i = 0; i < values.length; i++) {
                    var col = values[i].source;
                    var value: number = <number>values[i].values[0];
                    if (col && col.roles) {
                        if (col.roles[Tachometer.RoleNames.y]) {
                            if (value === undefined || isNaN(Number(value)))
                                axisData.value = Tachometer.UnintializedStartValue;
                            else {
                                axisData.value = value;
                                axisData.tooltipInfo.push({ displayName: Tachometer.RoleNames.y, value: value.toString() });
                            }
                        } if (col.roles[Tachometer.RoleNames.startValue]) {
                            if (value === undefined || isNaN(Number(value)))
                                axisData.startValue = Tachometer.UnintializedStartValue;
                            else {
                                axisData.startValue = value;
                                axisData.tooltipInfo.push({ displayName: Tachometer.RoleNames.startValue, value: value.toString() });
                            }
                        } if (col.roles[Tachometer.RoleNames.endValue]) {
                            if (value === undefined || isNaN(Number(value)))
                                axisData.endValue = Tachometer.UnintializedEndValue;
                            else {
                                axisData.endValue = value;
                                axisData.tooltipInfo.push({ displayName: Tachometer.RoleNames.endValue, value: value.toString() });
                            }
                        } if (col.roles[Tachometer.RoleNames.targetValue]) {
                            if (value === undefined || isNaN(Number(value)))
                                axisData.target.value = Tachometer.UnintializedStartValue;
                            else {
                                axisData.target.value = value;
                                axisData.tooltipInfo.push({ displayName: Tachometer.RoleNames.targetValue, value: value.toString() });
                            }
                        } if (col.roles[Tachometer.RoleNames.range2StartValue]) {
                            if (value === undefined || isNaN(Number(value)))
                                axisData.range2.startValue = Tachometer.UnintializedStartValue;
                            else {
                                axisData.range2.startValue = value;
                                axisData.tooltipInfo.push({ displayName: Tachometer.RoleNames.range2StartValue, value: value.toString() });
                            }
                        } if (col.roles[Tachometer.RoleNames.range3StartValue]) {
                            if (value === undefined || isNaN(Number(value)))
                                axisData.range3.startValue = Tachometer.UnintializedStartValue;
                            else {
                                axisData.range3.startValue = value;
                                axisData.tooltipInfo.push({ displayName: Tachometer.RoleNames.range3StartValue, value: value.toString() });
                            }
                        }
                    }
                }
            }

            return axisData;
        }

        private transformTachometerSettings(dataView: DataView, axisData: TachometerAxisData): TachometerAxisData {
            axisData = Tachometer.transformGaugeAxisSettings(dataView, axisData);
            axisData.range1 = Tachometer.transformRangeSettings(dataView, 'range1', axisData.range1, Tachometer.DefaultRange1Color);
            axisData.range2 = Tachometer.transformRangeSettings(dataView, 'range2', axisData.range2, Tachometer.DefaultRange2Color);
            axisData.range3 = Tachometer.transformRangeSettings(dataView, 'range3', axisData.range3, Tachometer.DefaultRange3Color);
            axisData.dataLabels = Tachometer.transformDataLabelSettings(dataView, 'labels', Tachometer.getDefaultTachometerLabelSettings());
            var dataLabels = axisData.dataLabels;
            if (dataLabels.show) {
                var value = Math.max(Math.abs(axisData.startValue), Math.abs(axisData.endValue));
                var formatter = this.getFormatter(dataLabels.displayUnits, dataLabels.precision, value);
                var formattedValue = formatter.format(value);
                dataLabels.textWidth = Tachometer.getTextWidth(dataLabels.fontSizePx, formattedValue);
            }

            axisData.target = this.transformTargetSettings(dataView, axisData.target, axisData.dataLabels);
            axisData.indicator = Tachometer.transformIndicatorSettings(dataView, axisData.indicator);

            return axisData;
        }

        private static transformDataLabelSettings(dataView: DataView, objectName: string, dataLabelsSettings: TachometerDataLabelsData): TachometerDataLabelsData {
            var objects: DataViewObjects = dataView && dataView.metadata ? dataView.metadata.objects : null;
            var labelsObj: TachometerLabelObject = objects ? <TachometerLabelObject>objects[objectName] : null;
            var haslabelObject: boolean = (objects != null && labelsObj != null);

            if (haslabelObject) {
                if (labelsObj.show !== undefined) {
                    dataLabelsSettings.show = <boolean>labelsObj.show;
                }
                if (labelsObj.color !== undefined) {
                    dataLabelsSettings.labelColor = labelsObj.color.solid.color;
                }
                if (labelsObj.labelDisplayUnits !== undefined) {
                    dataLabelsSettings.displayUnits = labelsObj.labelDisplayUnits;
                }
                if (labelsObj.labelPrecision !== undefined) {
                    dataLabelsSettings.precision = (labelsObj.labelPrecision >= 0) ? labelsObj.labelPrecision : dataLabelUtils.defaultLabelPrecision;
                }
                if (labelsObj.fontSize !== undefined) {
                    dataLabelsSettings.fontSize = labelsObj.fontSize;
                    dataLabelsSettings.fontSizePx = PixelConverter.fromPoint(labelsObj.fontSize);
                    dataLabelsSettings.textHeight = PixelConverter.fromPointToPixel(labelsObj.fontSize);
                }
                if (labelsObj.count != null && labelsObj.count !== undefined) {
                    dataLabelsSettings.count = labelsObj.count;
                }
                else {
                    dataLabelsSettings.count = Tachometer.DefaultLabelCount;
                }
                if (labelsObj.round != null && labelsObj.round !== undefined) {
                    dataLabelsSettings.round = labelsObj.round;
                }
                if (labelsObj.reduce != null && labelsObj.reduce !== undefined) {
                    dataLabelsSettings.reduce = labelsObj.reduce;
                }
                if (labelsObj.xOffset != null && labelsObj.xOffset !== undefined) {
                    dataLabelsSettings.offset.x = Tachometer.clamp(labelsObj.xOffset, -100, 100);
                }
                else if (dataLabelsSettings.offset) {
                    dataLabelsSettings.offset.x = 0;
                }
                if (labelsObj.yOffset != null && labelsObj.yOffset !== undefined) {
                    dataLabelsSettings.offset.y = Tachometer.clamp(-labelsObj.yOffset, -100, 100); //switching direction for intutive user experience of +ve up
                }
                else if (dataLabelsSettings.offset) {
                    dataLabelsSettings.offset.y = 0;
                }
                if (labelsObj.invert != null && labelsObj.invert !== undefined) {
                    dataLabelsSettings.invert = <boolean>labelsObj.invert;
                }
            }
            else {
                dataLabelsSettings.count = Tachometer.DefaultLabelCount;
                if (dataLabelsSettings.offset) {
                    dataLabelsSettings.offset.x = 0;
                    dataLabelsSettings.offset.y = 0;
                }
            }

            return dataLabelsSettings;
        }

        private static getDefaultTachometerCalloutSettings(): TachometerDataLabelsData {
            var dataLabelSettings: TachometerDataLabelsData = {
                show: true,
                fontSizePx: PixelConverter.fromPoint(Tachometer.DefaultCalloutFontSizeInPt),
                labelColor: null,
                displayUnits: 0,
                precision: dataLabelUtils.defaultLabelPrecision,
                fontSize: Tachometer.DefaultCalloutFontSizeInPt,
                offset: { x: undefined, y: undefined },
                textHeight: PixelConverter.fromPointToPixel(Tachometer.DefaultCalloutFontSizeInPt)
            };
            return dataLabelSettings;
        }

        private getFormatter(displayUnits: number, precision: number, value?: number, ignoreDataType: boolean = false): IValueFormatter {
            displayUnits = displayUnits == null ? 0 : displayUnits;
            var realValue = displayUnits === 0 ? value : null;
            var formatString: string = valueFormatter.getFormatString((ignoreDataType ? null : this.metadataColumn), Tachometer.formatStringProp);
            precision = dataLabelUtils.getLabelPrecision(precision, formatString);
            var valueFormatterOptions: ValueFormatterOptions = this.getOptionsForLabelFormatter(displayUnits, formatString, realValue, precision);
            return valueFormatter.create(valueFormatterOptions);
        }


        private static getTextWidth(fontSizePx: string, text: string) {
            var textProperties: TextProperties = {
                text: text,
                fontFamily: Tachometer.defaultLabelFontFamily,
                fontSize: fontSizePx,
                fontWeight: Tachometer.defaultLabelfontWeight,
            };
            return textMeasurementService.measureSvgTextWidth(textProperties);
        }

        private static getDefaultTachometerCalloutPercentSettings(): TachometerDataLabelsData {
            var dataLabelSettings: TachometerDataLabelsData = {
                show: false,
                fontSizePx: PixelConverter.fromPoint(Tachometer.DefaultCalloutPercentFontSizeInPt),
                labelColor: '#333333',
                precision: dataLabelUtils.defaultLabelPrecision,
                fontSize: Tachometer.DefaultCalloutPercentFontSizeInPt,
                offset: { x: undefined, y: undefined },
                textHeight: PixelConverter.fromPointToPixel(Tachometer.DefaultCalloutFontSizeInPt),
                invert: false
            };
            return dataLabelSettings;
        }

        private getZeroMargin(): IMargin {
            return { top: 0, bottom: 0, left: 0, right: 0 };
        }

        private completeAxisRange(range: TachometerRangeData, radius: number): TachometerRangeData {
            range.radius = radius;
            range.innerRadius = radius * range.innerRadiusRatio;
            range.startAngle = this.axisScale(range.startValue);
            range.endAngle = this.axisScale(range.endValue);

            return range;
        }

        private completeIndicator(indicator: TachometerIndicatorData, translation: TachometerTranslationSettings,
            offset: Offset, value: number): TachometerIndicatorData {
            var radius = translation.radius;
            var baseArcRadiusFactor = Tachometer.BaseArcRadiusFactor / 100;//radius of indicator base arc with respect to the dial radius

            var baseArcRadius = radius * baseArcRadiusFactor;
            var baseArcInnerRadius = baseArcRadius * indicator.baseThicknessFactor;

            var needleTip = -radius * indicator.pointerSizeFactor;
            var needleBase = -(baseArcRadius + baseArcInnerRadius) / 2;
            var needleHeight = needleTip - needleBase;
            var halfNeedleWidth = needleHeight * Tachometer.NeedleHeightToWidthRatio / 2;

            var needleAngleInDegrees: number = this.axisScale(value) * Tachometer.RadToDegreeConversionFactor;

            indicator.baseRadius = baseArcRadius;
            indicator.baseInnerRadius = baseArcInnerRadius;
            indicator.value = value;
            indicator.baseStartAngle = translation.startAngle;
            indicator.baseEndtAngle = translation.endAngle;
            indicator.needletransformString = SVGUtil.translateAndRotate(offset.x, offset.y, 0, 0, needleAngleInDegrees);
            indicator.needlePoints = [
                { 'x': -halfNeedleWidth, 'y': needleBase },
                { 'x': 0, 'y': needleTip },
                { 'x': halfNeedleWidth, 'y': needleBase },
                { 'x': -halfNeedleWidth, 'y': needleBase },
            ];

            return indicator;
        }

        private completeTarget(target: TachometerTargetData, axisData: TachometerAxisData): TachometerTargetData {
            target.radius = axisData.radius;
            target.innerRadius = target.innerRadiusRatio === Tachometer.UninitializedRatio
                ? Math.max(axisData.range1.innerRadius, axisData.range2.innerRadius, axisData.range3.innerRadius)
                : target.radius * target.innerRadiusRatio
                ;
            target.innerRadius = Tachometer.clamp(target.innerRadius, axisData.indicator.baseRadius, axisData.radius);
            target.offset.x = axisData.offset.x;
            target.offset.y = axisData.offset.y;

            return target;
        }

        //Convert the percent value of offset into a pixel value 
        private static translateUserXOffset
            (baseXOffset: number, callout: TachometerDataLabelsData, width: number, textWidth: number, padding: number): number {
            var xOffsetPercent = callout.offset.x;
            if (xOffsetPercent !== 0) {
                var userXOffset = xOffsetPercent / 200 * (width - textWidth - 2 * padding) ; //we have width /2 on either side
                var threshold: number = textWidth / 2 + padding;
                var offset = baseXOffset + userXOffset;

                //return the offset from the base offet
                return offset < threshold
                    ? threshold - baseXOffset //too far left
                    : offset > width - threshold
                        ? width - threshold - baseXOffset // too far right so clamp it
                        : userXOffset;
            }
            else {
                return 0;
            }
        }

        private isWithinBounds(rectangle: TachometerRectangle): boolean {
            return (rectangle != null) && ((rectangle.left > 0) && (rectangle.right < this.currentViewport.width) && (rectangle.top > 0) && (rectangle.bottom < this.currentViewport.height));
        }

        //Return true if the two labels defined by 
        private isOverlapping(rect1: TachometerRectangle, rect2: TachometerRectangle): boolean {
            if (!rect1 || !rect2) {
                return false;
            }

            var left = rect1.left - Tachometer.OverlapTolerance;
            var right = rect1.right + Tachometer.OverlapTolerance;
            var top = rect1.top - Tachometer.OverlapTolerance;
            var bottom = rect1.bottom + Tachometer.OverlapTolerance;

            return !(((left >= rect2.left && right >= rect2.left) && (left >= rect2.right && right >= rect2.right))
                || ((left <= rect2.left && right <= rect2.left) && (left <= rect2.right && right <= rect2.right))
                || ((top >= rect2.top && bottom >= rect2.top) && (top >= rect2.bottom && bottom >= rect2.bottom))
                || ((top <= rect2.top && bottom <= rect2.top) && (top <= rect2.bottom && bottom <= rect2.bottom)));
        }

        private isOverlappingWithCallout(rectangle: TachometerRectangle) {
            return this.isOverlapping(rectangle, this.calloutRectangle) || this.isOverlapping(rectangle, this.calloutPercentRectangle);
        }

        private createNiceRoundLabels(): TachometerAxisLabel[] {
            var axisLabels: TachometerAxisLabel[] = [];
            var axisData = this.axisData;
            var dataLabels: TachometerDataLabelsData = axisData.dataLabels;

            var ticCount = (Math.abs(axisData.valueRange) > 1) ? dataLabels.count
                : 1; //Show only the start and end values

            if (ticCount > 0) {
                var ticks: number[] = this.axisScale.ticks(ticCount);
                ticCount = ticks.length; //This is the real tic count when this.data.dataLabelsSettings.round = true
                var radius = this.axisData.radius;
                var fontSizePx = dataLabels.fontSizePx;
                var textHeight = PixelConverter.fromPointToPixel(dataLabels.fontSize);

                var lastAngle: number = Tachometer.UnintializedStartValue; // initialize to a very small number
                var reduce = dataLabels.reduce;
                var lastDisplayValue = '';
                var lastAxisLabel: TachometerAxisLabel;
                for (var i = 0; i < ticCount; i++) {
                    var value = ticks[i];
                    var angle = this.axisScale(value);
                    var currentDisplayValue = dataLabels.formatter.format(value);
                    if (((!reduce ||
                        (Math.abs(lastAngle - angle) * radius) >= Tachometer.MinLabelDistance)) //to avoid overcrowding with labels
                        && (lastDisplayValue !== currentDisplayValue)) //to avoid repeating labels when they become rounded by Display Units
                    {
                        var axisLabel: TachometerAxisLabel = this.createAxisLabel(currentDisplayValue, value, fontSizePx, textHeight, angle);

                        if (this.isWithinBounds(axisLabel.rect)
                            && (!lastAxisLabel || (lastAxisLabel && !this.isOverlapping(lastAxisLabel.rect, axisLabel.rect)))
                            && !this.isOverlappingWithCallout(axisLabel.rect)
                        ) {
                            axisLabels.push(axisLabel);
                            lastAngle = angle;
                            lastDisplayValue = currentDisplayValue;
                            lastAxisLabel = axisLabel;
                        }
                    }
                }
            }
            return axisLabels;
        }

        private createEquallySpacedLabels(): TachometerAxisLabel[] {
            var axisLabels: TachometerAxisLabel[] = [];
            var axisData = this.axisData;
            var dataLabels: TachometerDataLabelsData = this.axisData.dataLabels;

            var numberOfSteps = (Math.abs(axisData.valueRange) > 1) ? dataLabels.count - 1
                : 1; //Show only the start and end values
            if (numberOfSteps > 0) {
                var startAngle = axisData.startAngle;
                var angleStep = axisData.angleRange / numberOfSteps;
                var fontSizePx = dataLabels.fontSizePx;
                var textHeight = PixelConverter.fromPointToPixel(dataLabels.fontSize);
                var lastDisplayValue = '';
                var lastAxisLabel: TachometerAxisLabel;

                for (var i = 0; i <= numberOfSteps; i++) {
                    var angle = startAngle + (i * angleStep);
                    var value = this.axisScale.invert(angle);
                    var currentDisplayValue = dataLabels.formatter.format(value);
                    if (lastDisplayValue !== currentDisplayValue) //to avoid repeating labels when they become rounded by Display Units
                    {
                        var axisLabel = this.createAxisLabel(dataLabels.formatter.format(value), value, fontSizePx, textHeight, angle);
                        if (this.isWithinBounds(axisLabel.rect)
                            && (!lastAxisLabel || (lastAxisLabel && !this.isOverlapping(lastAxisLabel.rect, axisLabel.rect)))
                            && !this.isOverlappingWithCallout(axisLabel.rect)
                        ) {
                            axisLabels.push(axisLabel);
                            lastDisplayValue = currentDisplayValue;
                            lastAxisLabel = axisLabel;
                        }
                    }
                }
            }
            return axisLabels;
        }

        private truncateTextIfNeeded(text: d3.Selection<any>, positionX: number, onRightSide: boolean) {
            var availableSpace = (onRightSide ? this.currentViewport.width - positionX : positionX);
            text.call(AxisHelper.LabelLayoutStrategy.clip,
                availableSpace,
                textMeasurementService.svgEllipsis);
        }

        private updateTargeIndicator(target: TachometerTargetData) {
            var offset = target.offset;
            var radius = target.radius;
            var innerRadius = target.innerRadius;

            if (!this.targetIndicator) {
                this.targetIndicator = this.mainGraphicsContext.append('path');
                this.targetIndicator
                    .classed('targetIndicator', true)
                    .attr('stroke-width', Tachometer.DefaultStyleProperties.targetLine.thickness)
                    .attr('fill', 'none');
            }
            var targetIndicatorPath = [
                { 'x': 0, 'y': -radius },
                { 'x': 0, 'y': -innerRadius }
            ];

            var angleInDegrees = this.axisScale(target.value) * Tachometer.RadToDegreeConversionFactor;
            this.targetIndicator
                .attr('d', Tachometer.LineFunction(targetIndicatorPath))
                .attr('transform', SVGUtil.translateAndRotate(offset.x, offset.y, 0, 0, angleInDegrees))
                .style('stroke', target.lineColor);
        }

        private updateTargetText(viewModel: TachometerViewModel, axisLabels: TachometerAxisLabel[]) {
            var axis = viewModel.axis;
            var target = axis.target;
            var targetValue = target.value;
            var center = axis.offset;
            var radius = axis.radius;

            var targetAngle: number = this.axisScale(targetValue);
            var sinAngle = Math.sin(targetAngle);
            var cosAngle = Math.cos(targetAngle);

            var targetDetails: TargetDetails = {
                tipX: center.x + radius * sinAngle,
                tipY: center.y - radius * cosAngle,
                centerX: center.x,
                centerY: center.y,
                defaultTextAnchorX: center.x + axis.axisLabelRadius * sinAngle,
                defaultTextAnchorY: center.y - axis.axisLabelRadius * cosAngle,
                gaugeRadius: radius,
                labelRadius: axis.axisLabelRadius,
                onRightSide: sinAngle > 0,
                onTopHalf: cosAngle > 0,
                targetAngle: targetAngle
            };

            var targetRectangle = this.targetRectangle = this.getTargetRectangle(axis, axisLabels, targetDetails);
            var anchor: string;
            var anchorOffset: Offset = { x: 0, y: 0 };
            var connecterAnchor: Offset = { x: 0, y: 0 };

            if (targetRectangle == null) { //unable to place target
                this.showTargetLabel = false;
            }
            else {
                if (targetDetails.onRightSide) {
                    anchor = 'start';
                    anchorOffset.x = targetRectangle.left;
                }
                else {
                    anchor = 'end';
                    anchorOffset.x = targetRectangle.right;
                }

                anchorOffset.y = targetRectangle.bottom;
                //get nearest x between left, middle and right
                var targetCenterX = (targetRectangle.left + targetRectangle.right) / 2;
                var closestEdgeX = Math.abs(targetDetails.tipX - targetRectangle.left) > Math.abs(targetDetails.tipX - targetRectangle.right)
                    ? targetRectangle.right : targetRectangle.left;
                connecterAnchor.x = Math.abs(targetDetails.tipX - closestEdgeX) > Math.abs(targetDetails.tipX - targetCenterX) ? targetCenterX : closestEdgeX;

                //get the nearest y between top, bottom and middle
                var targetCenterY = (targetRectangle.top + targetRectangle.bottom) / 2;
                var closestEdgeY = Math.abs(targetDetails.tipY - targetRectangle.top) > Math.abs(targetDetails.tipY - targetRectangle.bottom)
                    ? targetRectangle.bottom
                    : targetRectangle.bottom - target.fontSize; // Settled for bottom - font size by experimentation
                connecterAnchor.y = Math.abs(targetDetails.tipY - closestEdgeY) > Math.abs(targetDetails.tipY - targetCenterY) ? targetCenterY : closestEdgeY;
            }

            if (!this.targetText) {
                this.targetText = this.mainGraphicsContext
                    .append('text')
                    .classed(Tachometer.TargetText.class, true);
            }

            this.targetText
                .attr({
                    'x': anchorOffset.x,
                    'y': anchorOffset.y,
                })
                .style({
                    'fill': target.textColor,
                    'text-anchor': anchor,
                    'display': this.showTargetLabel ? '' : 'none',
                    'font-size': target.fontSizePx
                })
                .text(target.formattedValue);

            this.truncateTextIfNeeded(this.targetText, anchorOffset.x, targetDetails.onRightSide);
            // Hide the target connector if the text is going to align with the target line in the arc
            // It should only be shown if the target text is displaced (ex. when the target is very close to start/end)
            if (this.showTargetLabel) {
                if (!this.targetConnector) {
                    this.targetConnector = this.mainGraphicsContext
                        .append('line')
                        .classed(Tachometer.TargetConnector.class, true);
                }

                var targetConnectorX = connecterAnchor.x - targetDetails.tipX;
                var targetConnectorY = connecterAnchor.y - targetDetails.tipY;

                var targetConnectorLength = Math.sqrt(targetConnectorX * targetConnectorX + targetConnectorY * targetConnectorY);
                if (targetConnectorLength - this.gaugeStyle.labels.padding < 1) {
                    this.targetConnector.style('display', 'none');
                }
                else {
                    this.targetConnector
                        .attr({
                            'x1': targetDetails.tipX,
                            'y1': targetDetails.tipY,
                            'x2': connecterAnchor.x,
                            'y2': connecterAnchor.y
                        })
                        .style({
                            'stroke-width': target.thickness,
                            'stroke': target.lineColor,
                            'opacity': 0.1,
                            'fill-opacity': 0,
                            'display': ''
                        });
                }
            }
            else if (this.targetConnector != null) {
                this.targetConnector.style('display', 'none');
            }
        }

        private removeTargetElements(removeAll: boolean) {

            if ((removeAll) && (this.targetIndicator)) {
                this.targetIndicator.remove();
                this.targetIndicator = null;
            }
            if (this.targetConnector) {
                this.targetText.remove();
                this.targetConnector.remove();
                this.targetConnector = this.targetText = null;
            }
        }

        private static transformGaugeAxisSettings(dataView: DataView, axisData: TachometerAxisData): TachometerAxisData {
            // Override settings according to property pane axis values
            var axisOptions: TachometerAxisObject = Tachometer.getTachometerObjectsProperties(dataView,axisData);

            axisData.startAngle = $.isNumeric(axisOptions.startAngle) ? (axisOptions.startAngle * Tachometer.DegreeToRadConversionFactor)
                : Tachometer.UnintializedStartAngle;
            axisData.endAngle = $.isNumeric(axisOptions.endAngle) ? (axisOptions.endAngle * Tachometer.DegreeToRadConversionFactor)
                : Tachometer.UnintializedEndAngle;

            if ($.isNumeric(axisOptions.endAngle)) {
                axisData.endAngle = (axisOptions.endAngle * Tachometer.DegreeToRadConversionFactor);
            }
            if (axisOptions.axisScaleType) {
                axisData.axisScaleType = axisOptions.axisScaleType;
            }
            if ($.isNumeric(axisOptions.startValue)) {
                axisData.startValue = axisOptions.startValue;
            }
            if ($.isNumeric(axisOptions.endValue)) {
                axisData.endValue = axisOptions.endValue;
            }

            var startAngle: number = Tachometer.normalizeAngle(axisData.startAngle);
            var endAngle: number = Tachometer.normalizeAngle(axisData.endAngle);

            if (startAngle > endAngle) {
                //convert from a circular scale to a linear scale for simplicity
                endAngle = endAngle + Tachometer.TwoPI;
            }

            axisData.startAngle = startAngle;
            axisData.endAngle = endAngle;
            axisData.angleRange = axisData.endAngle - axisData.startAngle;

            var startValue = (axisData.startValue === Tachometer.UnintializedStartValue) ? Tachometer.DefaultMin : axisData.startValue;
            var endValue = (axisData.endValue === Tachometer.UnintializedEndValue)
                ? (axisData.value != null && axisData.value !== undefined ? axisData.value * 2 : Tachometer.DefaultMax)
                : axisData.endValue;

            if (startValue === 0 && endValue === 0) {
                endValue = 1;
            }

            axisData.endValue = endValue;
            axisData.startValue = startValue;
            axisData.valueRange = endValue - startValue;
            //Checking that the value is plotted inside the tachometer boundaries
            var baseValue: number = Math.min(endValue, startValue);
            var percent: number = axisData.valueRange !== 0 ? Math.abs((axisData.value - baseValue) * 100 / (axisData.valueRange)) : 0;
            axisData.percent = percent;

            axisData.directionClockwise = (axisData.endValue - axisData.startValue >= 0);
            axisData.startQuadrant = Tachometer.getQuadrant(startAngle);
            axisData.endQuadrant = Tachometer.getQuadrant(endAngle);
            axisData.cosStartAngle = Math.cos(startAngle);
            axisData.cosEndAngle = Math.cos(endAngle);
            axisData.sinStartAngle = Math.sin(startAngle);
            axisData.sinEndAngle = Math.sin(endAngle);

            return axisData;
        }

        private static getTachometerObjectsProperties(dataView: DataView, axisData: TachometerAxisData): TachometerAxisObject {
            var properties: any = {};
            var objects: TachometerAxisObjects = dataView && dataView.metadata ? <TachometerAxisObjects>dataView.metadata.objects : null;
            var axisObject: TachometerAxisObject = objects ? objects.axis : null;
            var hasAxisObject: boolean = (objects != null && axisObject != null);
            var startValue: number;
            var endValue: number;

            properties.startAngle = hasAxisObject && axisObject.startAngle != null ? axisObject.startAngle : undefined;
            properties.endAngle = hasAxisObject && axisObject.endAngle != null ? axisObject.endAngle : undefined;
            if (!DataRoleHelper.hasRoleInDataView(dataView, Tachometer.RoleNames.startValue)) {
                startValue = properties.startValue = hasAxisObject && axisObject.startValue != null ? axisObject.startValue : undefined;
            }
            else {
                startValue = axisData.startValue;
            }
            if (!DataRoleHelper.hasRoleInDataView(dataView, Tachometer.RoleNames.endValue)) {
                endValue = properties.endValue = hasAxisObject && axisObject.endValue != null ? axisObject.endValue : undefined;                
            }
            else {
                endValue = axisData.endValue;
            }

            properties.axisScaleType = hasAxisObject && axisObject.axisScaleType
                && Tachometer.isNotNegative(startValue) && Tachometer.isNotNegative(endValue) //log scale not defined for negative values
                ? axisObject.axisScaleType : axisScaleType.linear;

            return properties;
        }

        private static transformRangeSettings(dataView: DataView, rangeName: string, rangeSettings: TachometerRangeData, defaultRangeColor: string): TachometerRangeData {
            var objects: DataViewObjects = dataView && dataView.metadata ? dataView.metadata.objects : null;
            var rangeObject: TachometerRangeObject = objects ? <TachometerRangeObject>objects[rangeName] : null;
            var hasRangeObject: boolean = (objects != null && rangeObject != null);
            var thickness: number;

            if (hasRangeObject) {
                if ((rangeSettings.startValue === Tachometer.UnintializedRangeStartValue //This basically means that the value is not defined in field wells
                    || rangeSettings.startValue === undefined)
                    && (rangeObject.startValue && rangeObject.startValue !== undefined)) {
                    rangeSettings.startValue = rangeObject.startValue;
                }
                if (rangeObject.rangeColor && rangeObject.rangeColor !== undefined) {
                    rangeSettings.rangeColor = rangeObject.rangeColor.solid.color;
                }
                else {
                    rangeSettings.rangeColor = defaultRangeColor;
                }
                if (rangeObject.thickness && rangeObject.thickness !== undefined) {
                    thickness = rangeObject.thickness;
                    thickness = Tachometer.clamp(thickness, 0, 100);
                    rangeObject.thickness = thickness; //We want to set this to clamped value for enumeration
                }
                else {
                    thickness = Tachometer.DefaultRangeThickness;
                }
            }
            else {
                rangeSettings.rangeColor = defaultRangeColor;
                thickness = Tachometer.DefaultRangeThickness;
            }
            rangeSettings.innerRadiusRatio = 1 - thickness / 100;

            return rangeSettings;
        }

        private static getDefaultTachometerLabelSettings(): TachometerDataLabelsData {
            var dataLabelSettings: TachometerDataLabelsData = {
                show: true,
                fontSizePx: PixelConverter.fromPoint(Tachometer.defaultLabelFontSizeInPt),
                labelColor: null,
                displayUnits: 0,
                precision: dataLabelUtils.defaultLabelPrecision,
                fontSize: Tachometer.defaultLabelFontSizeInPt,
                round: true,
                count: undefined,
                reduce: true, //avoid overcrowding labels when log scale is used
                textHeight: PixelConverter.fromPointToPixel(Tachometer.defaultLabelFontSizeInPt)
                + Tachometer.DefaultStyleProperties.labels.padding
            };
            return dataLabelSettings;
        }

        private transformTargetSettings(dataView: DataView, targetSettings: TachometerTargetData, dataLabels: TachometerDataLabelsData): TachometerTargetData {
            var objects: TachometerTargetObjects = dataView && dataView.metadata ? <TachometerTargetObjects>dataView.metadata.objects : null;
            var targetObject: TachometerTargetObject = objects ? objects.target : null;
            var hasTargetObject: boolean = (objects != null && targetObject != null);

            if (hasTargetObject) {
                if (targetObject.show !== undefined) {
                    targetSettings.show = <boolean>targetObject.show;
                }
                if (targetSettings.value === Tachometer.UnintializedStartValue //This basically means that the value is not defined in field wells
                    && targetObject.value && targetObject.value !== undefined) {
                    targetSettings.value = targetObject.value;
                }
                if (targetObject.lineColor && targetObject.lineColor !== undefined) {
                    targetSettings.lineColor = targetObject.lineColor.solid.color;
                }
                else {
                    targetSettings.lineColor = Tachometer.defaultTargetSettings.lineColor;
                }
                if (targetObject.innerRadiusRatio && targetObject.innerRadiusRatio !== undefined) {
                    targetSettings.innerRadiusRatio = 1 - (targetObject.innerRadiusRatio) / 100;
                }
                else {
                    targetSettings.innerRadiusRatio = Tachometer.defaultTargetSettings.innerRadiusRatio;
                }
                if (targetObject.textColor && targetObject.textColor !== undefined) {
                    targetSettings.textColor = targetObject.textColor.solid.color;
                }
                else {
                    targetSettings.textColor = Tachometer.defaultTargetSettings.textColor;
                }
                if (targetObject.fontSize && targetObject.fontSize !== undefined) {
                    targetSettings.fontSize = targetObject.fontSize;
                }
                else {
                    targetSettings.fontSize = Tachometer.defaultTargetSettings.fontSize;
                }
            }
            else {
                targetSettings.show = Tachometer.defaultTargetSettings.show;
                if (targetSettings.value === Tachometer.UnintializedStartValue) {//This basically means that the value is not defined in field wells
                    targetSettings.value = Tachometer.defaultTargetSettings.value;
                }
                targetSettings.lineColor = Tachometer.defaultTargetSettings.lineColor;
                targetSettings.innerRadiusRatio = Tachometer.defaultTargetSettings.innerRadiusRatio;
                targetSettings.innerRadius = Tachometer.defaultTargetSettings.innerRadius;
                targetSettings.textColor = Tachometer.defaultTargetSettings.textColor;
                targetSettings.fontSize = Tachometer.defaultTargetSettings.fontSize;
            }
            if (targetSettings.show) {
                targetSettings.fontSizePx = PixelConverter.fromPoint(targetSettings.fontSize);
                targetSettings.textHeight = PixelConverter.fromPointToPixel(targetSettings.fontSize);
            }
            return targetSettings;
        }

        private static transformIndicatorSettings(dataView: DataView, indicatorData: TachometerIndicatorData): TachometerIndicatorData {
            var objects: TachometerIndicatorObjects = dataView && dataView.metadata ? <TachometerIndicatorObjects>dataView.metadata.objects : null;
            var indicatorObject: TachometerIndicatorObject = objects ? objects.indicator : null;
            var hasIndicatorObject: boolean = (objects != null && indicatorObject != null);

            if (hasIndicatorObject) {
                if (indicatorObject.pointerSizeFactor && indicatorObject.pointerSizeFactor !== undefined) {
                    var thickness: number = Tachometer.clamp(indicatorObject.pointerSizeFactor, 0, 100);
                    indicatorObject.pointerSizeFactor = thickness; //We want to set this to clamped value for enumeration
                    indicatorData.pointerSizeFactor = thickness / 100;
                }
                else {
                    indicatorData.pointerSizeFactor = Tachometer.defaultIndicatorSettings.pointerSizeFactor;
                }
                if (indicatorObject.pointerColor && indicatorObject.pointerColor !== undefined) {
                    indicatorData.pointerColor = indicatorObject.pointerColor.solid.color;
                }
                else {
                    indicatorData.pointerColor = Tachometer.defaultIndicatorSettings.pointerColor;
                }
                if (indicatorObject.baseThicknessFactor && indicatorObject.baseThicknessFactor !== undefined) {
                    var thickness: number = Tachometer.clamp(indicatorObject.baseThicknessFactor, 0, 100);
                    indicatorObject.baseThicknessFactor = thickness; //We want to set this to clamped value for enumeration
                    indicatorData.baseThicknessFactor = 1 - thickness / 100;
                }
                else {
                    indicatorData.baseThicknessFactor = Tachometer.defaultIndicatorSettings.baseThicknessFactor;
                }
                if (indicatorObject.baseColor && indicatorObject.baseColor !== undefined) {
                    indicatorData.baseColor = indicatorObject.baseColor.solid.color;
                }
                else {
                    indicatorData.baseColor = Tachometer.defaultIndicatorSettings.baseColor;
                }
            }
            else {
                indicatorData.pointerSizeFactor = Tachometer.defaultIndicatorSettings.pointerSizeFactor;
                indicatorData.pointerColor = Tachometer.defaultIndicatorSettings.pointerColor;
                indicatorData.baseThicknessFactor = Tachometer.defaultIndicatorSettings.baseThicknessFactor;
                indicatorData.baseColor = Tachometer.defaultIndicatorSettings.baseColor;
            }

            return indicatorData;
        }

        //clamp values between min and max, not using scales due to overhead
        private static clamp(value: number, min: number, max: number): number {
            if (value > max) {
                return max;//clamp upper limit
            }
            else if (value < min) {
                return min;
            }
            return value;
        }

        
        private getOptionsForLabelFormatter(displayUnits: number, formatString: string, value2?: number, precision?: number): ValueFormatterOptions {
            return {
                displayUnitSystemType: DisplayUnitSystemType.DataLabels,
                format: formatString,
                precision: precision,
                value: displayUnits,
                value2: value2,
                allowFormatBeautification: true,
            };
        }

        private createAxisLabel(displayValue: string, value: number, textSizePx: string, fontHeight: number, angle: number): TachometerAxisLabel {
            var axis = this.axisData;
            var radius = axis.axisLabelRadius;
            var xOffset = axis.offset.x;
            var yOffset = axis.offset.y;

            var sinAngle = Math.sin(angle);
            var cosAngle = Math.cos(angle);
            var onBottomHalf = cosAngle < 0;
            var ticX = xOffset + radius * sinAngle;
            var ticY = yOffset - (radius + (onBottomHalf ? fontHeight : 0)) * cosAngle;

            //Is the target on left side or right side of verticle?
            var onRightSide: boolean = sinAngle > 0;
            var textWidth = Tachometer.getTextWidth(textSizePx, displayValue);
            var rect: TachometerRectangle = {
                left: onRightSide ? ticX : ticX - textWidth, //gauranteed that x1 < x2 for simplified processing later
                top: ticY - fontHeight, //gauranteed that y1 < y2 for simplified processing later
                right: onRightSide ? ticX + textWidth : ticX,
                bottom: ticY
            };

            return {
                show: true,
                displayValue: displayValue,
                value: value,
                angle: angle,
                anchor: onRightSide ? 'start' : 'end',
                xOffset: ticX,
                yOffset: ticY,
                textWidth: textWidth,
                textHeight: fontHeight,
                rect: rect,
                graphicsElement: null
            };
        }

        //Get the rectangle area where target value can be placed
        private getTargetRectangle(axis: TachometerAxisData, axisLabels: TachometerAxisLabel[], targetDetails: TargetDetails): TachometerRectangle {
            var target = axis.target;
            var targetValue = target.value;

            //Is the target on left side or right side of verticle?
            var targetTextWidth = target.textWidth;
            var targetTextHeight = target.textHeight;
            var targetPlaced: boolean = false;
            var targetRect: TachometerRectangle = {
                left: targetDetails.onRightSide ? targetDetails.defaultTextAnchorX : targetDetails.defaultTextAnchorX - targetTextWidth, //make sure that aways x1 < x2 and y1 < y2 for simplified processing
                top: targetDetails.onTopHalf ? targetDetails.defaultTextAnchorY - targetTextHeight : targetDetails.defaultTextAnchorY,
                right: targetDetails.onRightSide ? targetDetails.defaultTextAnchorX + target.textWidth : targetDetails.defaultTextAnchorX,
                bottom: targetDetails.onTopHalf ? targetDetails.defaultTextAnchorY : targetDetails.defaultTextAnchorY + target.textHeight
            };
            var tickCount = axisLabels.length;
            if (tickCount > 0) {
                //1. identify where the target label will be located
                // a linear search is fine because the number of axis labels are limited to a handful in the most common scenario
                var i = 0;
                for (var j = i + 1; j < tickCount; i++ , j++) {
                    if (this.isBetween(targetValue, axisLabels[i].value, axisLabels[j].value)) {
                        //2. Check if the target label can be placed between adjascent axis labels without overlapping
                        targetRect = this.placeTargetBetweenLabels(axisLabels[i].rect, axisLabels[j].rect, targetRect, targetDetails);
                        targetPlaced = true;
                        break; //match found
                    }
                }
                if (!targetPlaced) {
                    var startIndex;
                    var endIndex;
                    if (axis.directionClockwise) {
                        startIndex = 0;
                        endIndex = tickCount - 1;
                    }
                    else {
                        startIndex = tickCount - 1;
                        endIndex = 0;
                    }
                    if (this.isBetween(targetValue, axis.startValue, axisLabels[startIndex].value)) {
                        //target Value is between startValue and the first Axis Label
                        targetRect = this.placeTargetBeforeFirstLabel(axisLabels[startIndex].rect, targetRect, targetDetails);
                    }
                    else if (this.isBetween(targetValue, axisLabels[endIndex].value, axis.endValue)) {
                        //target Value is between last Axis Label and endValue
                        targetRect = this.placeTargetAfterLastLabel(axisLabels[endIndex].rect, targetRect, targetDetails);
                    }
                }
            }

            return this.isWithinBounds(targetRect) && !this.isOverlappingWithCallout(targetRect) ? targetRect : null;
        }

        /*
        * Return which quadrant the angle is in
        * Angle can be between negative infinity to positive infinity
        */
        private static getQuadrant(angle: number): number {
            var quadrant: number;
            if (Math.sin(angle) >= 0) {
                if (Math.cos(angle) >= 0) {
                    quadrant = 1;
                }
                else {
                    quadrant = 2;
                }
            }
            else {
                if (Math.cos(angle) >= 0) {
                    quadrant = 4;
                }
                else {
                    quadrant = 3;
                }
            }
            return quadrant;
        }

        //Translate the angle to the scale -PI to + PI
        private static normalizeAngle(angle: number): number {
            var normalizedAngle: number = angle % Tachometer.TwoPI;

            if (normalizedAngle > Math.PI) {
                normalizedAngle = normalizedAngle - Tachometer.TwoPI;
            }
            else if (normalizedAngle < - Math.PI) {
                normalizedAngle = normalizedAngle + Tachometer.TwoPI;
            }
            return normalizedAngle;
        }

        private static isNotNegative(value: number): Boolean {
            return value === undefined || value >= 0;
        }

        private isBetween(value: number, startValue: number, endValue: number): Boolean {
            return (
                (value > startValue && value <= endValue)
                || (value < startValue && value >= endValue) // for reversed values
            )
                ;
        }

        private placeTargetBetweenLabels(firstRect: TachometerRectangle, secondRect: TachometerRectangle, targetRect: TachometerRectangle, targetDetails: TargetDetails): TachometerRectangle {
            var moveTargetClockwise = this.axisData.directionClockwise;
            var overlappingRect = null;
            var nextRect = null;
            if (this.isOverlapping(targetRect, firstRect)) {
                overlappingRect = firstRect;
                nextRect = secondRect;
            }
            else if (this.isOverlapping(targetRect, secondRect)) {
                overlappingRect = secondRect;
                nextRect = firstRect;
                moveTargetClockwise = !moveTargetClockwise;
            }
            else {
                return targetRect;
            }
            return this.moveTargetAwayFromLabel(overlappingRect, nextRect, targetRect, targetDetails, moveTargetClockwise);
        }

        private placeTargetBeforeFirstLabel(labelRectangle: TachometerRectangle, targetRect: TachometerRectangle, targetDetails: TargetDetails): TachometerRectangle {
            // There may be room between the first label and start of the dial
            //Create a rectangle of 1 pixel width at the start of the dial and use it along with the last label to place the target
            var axisData = this.axisData;
            var startRectOnAxis: TachometerRectangle = this.getUnitRectangle(axisData.startAngle);
            var endRectOnAxis: TachometerRectangle = this.getUnitRectangle(axisData.endAngle);

            var targetRectangle;
            if (axisData.directionClockwise) {
                targetRectangle = this.placeTargetBetweenLabels(startRectOnAxis, labelRectangle, targetRect, targetDetails);
            }
            else {
                targetRectangle = this.placeTargetBetweenLabels(labelRectangle, startRectOnAxis, targetRect, targetDetails);
            }
            if (targetRectangle != null) {
                return this.moveTargetCloserToGaugeStart(targetRectangle, startRectOnAxis, endRectOnAxis);
            }
            return null;
        }

        private placeTargetAfterLastLabel(labelRectangle: TachometerRectangle, targetRect: TachometerRectangle, targetDetails: TargetDetails): TachometerRectangle {
            // There may be room between the last label and end of the dial
            //Create a rectangle of 1 pixel width at the end of the dial and use it along with the last label to place the target
            var axisData = this.axisData;
            var startRectOnAxis: TachometerRectangle = this.getUnitRectangle(axisData.startAngle);
            var endRectOnAxis: TachometerRectangle = this.getUnitRectangle(axisData.endAngle);

            var targetRectangle;
            if (axisData.directionClockwise) {
                targetRectangle = this.placeTargetBetweenLabels(labelRectangle, endRectOnAxis, targetRect, targetDetails);
            }
            else {
                targetRectangle = this.placeTargetBetweenLabels(endRectOnAxis, labelRectangle, targetRect, targetDetails);
            }

            if (targetRectangle != null) {
                return this.moveTargetCloserToGaugeEnd(targetRectangle, startRectOnAxis, endRectOnAxis);
            }
            return null;
        }

        private moveTargetAwayFromLabel(overlappingLabel: TachometerRectangle, nextLabel: TachometerRectangle, targetRect: TachometerRectangle, targetDetails: TargetDetails, moveTargetClockwise: boolean): TachometerRectangle {
            var newTargetRect: TachometerRectangle = null;
            var absSinTargetAngle = Math.abs(Math.sin(targetDetails.targetAngle));

            if (absSinTargetAngle < Tachometer.PreferHorizontalThreshold) { //closer to the vertical top or bottom of the circle
                newTargetRect = this.getHorizontalRoomBetweenLabels(overlappingLabel, nextLabel, targetRect, targetDetails);
                if (newTargetRect == null) {
                    newTargetRect = this.getVerticalRoomBetweenLabels(overlappingLabel, nextLabel, targetRect, targetDetails, moveTargetClockwise);
                }
            }
            else {
                //1. check whether we have room between the two labels to accomodate the target
                newTargetRect = this.getVerticalRoomBetweenLabels(overlappingLabel, nextLabel, targetRect, targetDetails, moveTargetClockwise);
                if (newTargetRect == null) {
                    newTargetRect = this.getHorizontalRoomBetweenLabels(overlappingLabel, nextLabel, targetRect, targetDetails);
                }
            }
            if (newTargetRect == null) {
                newTargetRect = this.getPlacementBetweenLabels(overlappingLabel, nextLabel, targetRect, targetDetails);
            }
            return newTargetRect;
        }

        //get a rectangle 1px wide and 1px tall along gauge axis at the given angle
        private getUnitRectangle(angle: number): TachometerRectangle {
            var axisData = this.axisData;
            var axisStartX = axisData.offset.x + axisData.radius * Math.sin(angle);
            var axisStartY = axisData.offset.y - axisData.radius * Math.cos(angle);

            return {
                left: axisStartX,
                top: axisStartY,
                right: axisStartX + 1,
                bottom: axisStartY + 1
            };
        }

        //Attempt to move the target rectangle close to gauge dial when placed too far by the methods translateYFromGaugeAxis and translateXFromGaugeAxis
        private moveTargetCloserToGaugeStart(target: TachometerRectangle, startPoint: TachometerRectangle, endPoint: TachometerRectangle): TachometerRectangle {
            var altTarget: TachometerRectangle;

            switch (this.axisData.startQuadrant) {
                case 1:
                    return target;
                case 2:
                    if (target.left > startPoint.right) {
                        altTarget = this.copyRectangle(target);
                        var requiredWidth = altTarget.right - altTarget.left;
                        altTarget.left = startPoint.right + this.gaugeStyle.target.padding;
                        altTarget.right = altTarget.left + requiredWidth;
                    }
                    break;
                case 3:
                    return target;
                case 4:
                    if (target.right < startPoint.left) {
                        altTarget = this.copyRectangle(target);
                        var requiredWidth = altTarget.right - altTarget.left;
                        altTarget.right = startPoint.left - this.gaugeStyle.target.padding;
                        altTarget.left = altTarget.right - requiredWidth;
                    }
                    break;
            }

            if (altTarget != null) {
                if (this.isOverlapping(altTarget, endPoint)) {
                    return target; //can't move Target
                }
                else {
                    //gaurantee that we do not overlap new target with any axis label
                    var tickCount = this.axisLabels.length;
                    for (var i = 0; i < tickCount; i++) {
                        if (this.isOverlapping(altTarget, this.axisLabels[i].rect)) {
                            return target;
                        }
                    }
                    //reaching here means that we can move the target closer to the axis
                    return altTarget;
                }
            }
            return target;
        }

        //Attempt to move the target rectangle close to gauge dial when placed too far by the methods translateYFromGaugeAxis and translateXFromGaugeAxis
        private moveTargetCloserToGaugeEnd(target: TachometerRectangle, startPoint: TachometerRectangle, endPoint: TachometerRectangle): TachometerRectangle {
            var altTarget: TachometerRectangle;

            switch (this.axisData.endQuadrant) {
                case 1:
                    if (target.left > endPoint.right) {
                        altTarget = this.copyRectangle(target);
                        var requiredWidth = altTarget.right - altTarget.left;
                        altTarget.left = endPoint.right + this.gaugeStyle.target.padding;
                        altTarget.right = altTarget.left + requiredWidth;
                    }
                    break;
                case 2:
                    return target;
                case 3:
                    if (target.right < endPoint.left) {
                        altTarget = this.copyRectangle(target);
                        var requiredWidth = altTarget.right - altTarget.left;
                        altTarget.right = endPoint.left - this.gaugeStyle.target.padding;
                        altTarget.left = altTarget.right - requiredWidth;
                    }
                    break;
                case 4:
                    return target;
            }

            if (altTarget != null) {
                if (this.isOverlapping(altTarget, startPoint)) {
                    return target; //can't move Target
                }
                else {
                    //gaurantee that we do not overlap new target with any axis label
                    var tickCount = this.axisLabels.length;
                    for (var i = 0; i < tickCount; i++) {
                        if (this.isOverlapping(altTarget, this.axisLabels[i].rect)) {
                            return target;
                        }
                    }
                    //reaching here means that we can move the target closer to the axis
                    return altTarget;
                }
            }
            return target;
        }

        //if there is room return valid rectangle, otherwise return null
        private getHorizontalRoomBetweenLabels(rectangle1: TachometerRectangle, rectangle2: TachometerRectangle, targetRectangle: TachometerRectangle, targetDetails: TargetDetails): TachometerRectangle {
            var requiredRoom = targetRectangle.right - targetRectangle.left;
            var roomBetweenLabels = 0;

            var rectangle1OnTopHalf = rectangle1.bottom < targetDetails.centerY;
            var rectangle1OnLeftHalf = rectangle1.left < targetDetails.centerX;
            var rectangle2OnTopHalf = rectangle2.bottom < targetDetails.centerY;
            var rectangle2OnLeftHalf = rectangle2.left < targetDetails.centerX;

            if ((rectangle1OnTopHalf !== rectangle2OnTopHalf) || (rectangle1OnLeftHalf === rectangle2OnLeftHalf)) {
                //to move horizontally, the two rectangles should be on the top or bottom and across the vertical axis
                return null;
            }

            var baseX = 0;
            if (rectangle1.left < rectangle2.left) {
                roomBetweenLabels = rectangle2.left - rectangle1.right;
                baseX = rectangle1.right;
            }
            else {
                roomBetweenLabels = rectangle1.left - rectangle2.right;
                baseX = rectangle2.right;
            }

            if (roomBetweenLabels > requiredRoom) {
                //has room between the two labels to fit the target
                baseX = baseX + ((roomBetweenLabels - requiredRoom) / 2); //center between labels
                targetRectangle.left = baseX;
                targetRectangle.right = baseX + requiredRoom;
                //move X to gaurantee that target text does not overlap the gauge dial
                targetRectangle = this.translateYFromGaugeAxis(targetRectangle, targetDetails);
                if (this.isOverlapping(targetRectangle, rectangle1) || this.isOverlapping(targetRectangle, rectangle2) || this.isOverlappingWithCallout(targetRectangle)) {
                    return null;
                }
                return targetRectangle;
            }
            return null;
        }

        //if there is room return valid rectangle, otherwise return null
        //move the target towards the next rectangle along the gauge axis clockwise or counter clockwise as indicated
        private getVerticalRoomBetweenLabels(overlappingRectangle: TachometerRectangle, nextRectangle: TachometerRectangle, targetRectangle: TachometerRectangle, targetDetails: TargetDetails, targetMoveDirection: boolean): TachometerRectangle {
            var requiredRoom = targetRectangle.bottom - targetRectangle.top;
            var targetTop = 0;
            if ((targetDetails.onRightSide && targetMoveDirection)
                || (!targetDetails.onRightSide && !targetMoveDirection)
            ) {//means that we have to move target down
                targetTop = overlappingRectangle.bottom + this.gaugeStyle.target.padding;
            }
            else {//means that we have to move the target up
                targetTop = overlappingRectangle.top - requiredRoom - this.gaugeStyle.target.padding;
            }

            var newTargetRectangle: TachometerRectangle = {
                left: targetRectangle.left,
                top: targetTop,
                right: targetRectangle.right,
                bottom: targetTop + requiredRoom
            };
            //move X to gaurantee that target text does not overlap the gauge dial
            newTargetRectangle = this.translateXFromGaugeAxis(newTargetRectangle, targetDetails);

            if (newTargetRectangle != null && !this.isOverlapping(newTargetRectangle, nextRectangle) && !this.isOverlappingWithCallout(newTargetRectangle)) {
                return newTargetRectangle;
            }

            return null;
        }

        private getPlacementBetweenLabels(overlappingRect: TachometerRectangle, nextRect: TachometerRectangle, targetRectangle: TachometerRectangle, targetDetails: TargetDetails): TachometerRectangle {
            var onRightSide: boolean = targetRectangle.left >= targetDetails.centerX;
            var onBottom: boolean = targetRectangle.bottom >= targetDetails.centerY;
            var requiredHeight = targetRectangle.bottom - targetRectangle.top;
            var requiredWidth = targetRectangle.right - targetRectangle.left;
            var targetBottom = 0;
            var targetLeft = 0;

            if (onBottom) {
                targetBottom = Math.min(overlappingRect.bottom, nextRect.bottom) + requiredHeight + this.gaugeStyle.target.padding;
            }
            else {
                targetBottom = Math.max(overlappingRect.top, nextRect.top) - this.gaugeStyle.target.padding;
            }
            if (onRightSide) {
                targetLeft = Math.min(overlappingRect.right, nextRect.right) + this.gaugeStyle.target.padding;
            }
            else {
                targetLeft = Math.max(overlappingRect.left, nextRect.left) - this.gaugeStyle.target.padding - requiredWidth;
            }

            targetRectangle.left = targetLeft;
            targetRectangle.right = targetLeft + requiredWidth;
            targetRectangle.top = targetBottom - requiredHeight;
            targetRectangle.bottom = targetBottom;
            targetRectangle = this.translateXFromGaugeAxis(targetRectangle, targetDetails);
            targetRectangle = this.translateYFromGaugeAxis(targetRectangle, targetDetails);

            if (this.isOverlapping(targetRectangle, overlappingRect) || this.isOverlapping(targetRectangle, nextRect) || this.isOverlappingWithCallout(targetRectangle)) {
                //Note, this part is switched
                if (onRightSide) {
                    targetLeft = Math.max(overlappingRect.left, nextRect.left) - this.gaugeStyle.target.padding - requiredWidth;
                }
                else {
                    targetLeft = Math.min(overlappingRect.right, nextRect.right) + this.gaugeStyle.target.padding;
                }
                targetRectangle.left = targetLeft;
                targetRectangle.right = targetLeft + requiredWidth;
                //When we switch above logic, there is potential of overlapping with gauge
                targetRectangle = this.translateXFromGaugeAxis(targetRectangle, targetDetails);
                targetRectangle = this.translateYFromGaugeAxis(targetRectangle, targetDetails);
                if (this.isOverlapping(targetRectangle, overlappingRect) || this.isOverlapping(targetRectangle, nextRect) || this.isOverlappingWithCallout(targetRectangle)) {
                    //now try to go far left or far right as possible
                    if (onRightSide) {
                        targetLeft = Math.max(overlappingRect.right, nextRect.right) + this.gaugeStyle.target.padding;
                    }
                    else {
                        targetLeft = Math.min(overlappingRect.left, nextRect.left) - this.gaugeStyle.target.padding - requiredWidth;
                    }
                    targetRectangle.left = targetLeft;
                    targetRectangle.right = targetLeft + requiredWidth;
                    //When we switch above logic, there is potential of overlapping with gauge
                    targetRectangle = this.translateXFromGaugeAxis(targetRectangle, targetDetails);
                    targetRectangle = this.translateYFromGaugeAxis(targetRectangle, targetDetails);
                    if (this.isOverlapping(targetRectangle, overlappingRect) || this.isOverlapping(targetRectangle, nextRect) || this.isOverlappingWithCallout(targetRectangle)) {
                        return null;
                    }
                }
            }
            return targetRectangle;
        }

        private copyRectangle(rectangle: TachometerRectangle): TachometerRectangle {
            return {
                top: rectangle.top,
                bottom: rectangle.bottom,
                left: rectangle.left,
                right: rectangle.right
            };
        }

        //move along Y axis to avoid overlap
        private translateYFromGaugeAxis(rectangle: TachometerRectangle, targetDetails: TargetDetails): TachometerRectangle {
            if (rectangle == null) {
                return null;
            }

            var targetLeftOnGaugeRight: boolean = rectangle.left >= targetDetails.centerX;
            var targetRightOnGaugeRight: boolean = rectangle.right >= targetDetails.centerX;
            var targetTopOnGaugeTop: boolean = rectangle.top <= targetDetails.centerY;
            var requiredHeight = rectangle.bottom - rectangle.top;

            if (targetLeftOnGaugeRight === targetRightOnGaugeRight) { //both on right or left
                //minimun distance required from gauge center along Y axis to avoid overlap
                var gaugePivotX = targetRightOnGaugeRight ? Math.abs(rectangle.left - targetDetails.centerX) : Math.abs(targetDetails.centerX - rectangle.right);
                var gaugePivotYLimit = targetDetails.labelRadius * Math.cos(Math.asin(gaugePivotX / targetDetails.labelRadius));
                if (!isNaN(gaugePivotYLimit)) {
                    //means that x is already ourside of the circle so no need to change Y
                    if (targetTopOnGaugeTop) {
                        gaugePivotYLimit = targetDetails.centerY - gaugePivotYLimit;
                        if (gaugePivotYLimit < rectangle.bottom) { //potential overlap with gauge
                            rectangle.top = gaugePivotYLimit - requiredHeight;
                            rectangle.bottom = gaugePivotYLimit;
                        }
                    }
                    else {
                        gaugePivotYLimit = targetDetails.centerY + gaugePivotYLimit;
                        if (gaugePivotYLimit > rectangle.top) { //potential overlap with gauge
                            rectangle.top = gaugePivotYLimit;
                            rectangle.bottom = gaugePivotYLimit + requiredHeight;
                        }
                    }
                }
            }
            else { //target spanning left to right of the center
                if (targetTopOnGaugeTop) { //upper hemisphere
                    gaugePivotYLimit = targetDetails.centerY - targetDetails.labelRadius;
                    if (rectangle.bottom > gaugePivotYLimit) {
                        rectangle.top = gaugePivotYLimit - requiredHeight;
                        rectangle.bottom = gaugePivotYLimit;
                    }
                }
                else {
                    gaugePivotYLimit = targetDetails.centerY + targetDetails.labelRadius;
                    if (rectangle.top < gaugePivotYLimit) {
                        rectangle.top = gaugePivotYLimit;
                        rectangle.bottom = gaugePivotYLimit + requiredHeight;
                    }
                }
            }
            return this.isWithinBounds(rectangle) ? rectangle : null;
        }

        //move along X axis to avoid overlap
        private translateXFromGaugeAxis(rectangle: TachometerRectangle, targetDetails: TargetDetails): TachometerRectangle {
            if (rectangle == null) {
                return null;//going out of range
            }
            var targetLeftOnGaugeRight: boolean = rectangle.left >= targetDetails.centerX;
            var targetRightOnGaugeRight: boolean = rectangle.right >= targetDetails.centerX;
            var targetTopOnGaugeTop: boolean = rectangle.top <= targetDetails.centerY;
            var targetBottomOnGageBottom: boolean = rectangle.bottom <= targetDetails.centerY;
            var requiredWidth = rectangle.right - rectangle.left;

            var gaugePivotY = 0;
            var gaugePivotXLimit;
            if (targetTopOnGaugeTop === targetBottomOnGageBottom) { //both on tophalf or bottom half
                gaugePivotY = targetTopOnGaugeTop ? targetDetails.centerY - rectangle.bottom : rectangle.top - targetDetails.centerY;

                gaugePivotXLimit = targetDetails.labelRadius * Math.sin(Math.acos(gaugePivotY / targetDetails.labelRadius));

                if (!isNaN(gaugePivotXLimit)) { //this means that y is already outside the circle
                    if (targetLeftOnGaugeRight && targetRightOnGaugeRight) {//bot on right
                        gaugePivotXLimit = targetDetails.centerX + gaugePivotXLimit;
                        if (gaugePivotXLimit > rectangle.left) { //potential overlap with gauge
                            rectangle.left = gaugePivotXLimit;
                            rectangle.right = gaugePivotXLimit + requiredWidth;
                        }
                    }
                    else if (!targetLeftOnGaugeRight && !targetRightOnGaugeRight) { //both on left
                        gaugePivotXLimit = targetDetails.centerX - gaugePivotXLimit;
                        if (gaugePivotXLimit < rectangle.right) {//potential overlap with gauge
                            rectangle.right = gaugePivotXLimit;
                            rectangle.left = gaugePivotXLimit - requiredWidth;
                        }
                    }
                }
            }
            else {
                if (targetLeftOnGaugeRight) {
                    gaugePivotXLimit = targetDetails.centerX + targetDetails.labelRadius;
                    if (rectangle.left < gaugePivotXLimit) {
                        rectangle.left = gaugePivotXLimit;
                        rectangle.right = gaugePivotXLimit + requiredWidth;
                    }
                }
                else {
                    gaugePivotXLimit = targetDetails.centerX - targetDetails.labelRadius;
                    if (rectangle.right > gaugePivotXLimit) {
                        rectangle.right = gaugePivotXLimit;
                        rectangle.left = gaugePivotXLimit - requiredWidth;
                    }
                }
            }

            return this.isWithinBounds(rectangle) ? rectangle : null;
        }

        public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstanceEnumeration {
            var enumeration : VisualObjectInstance[] = [];

            switch (options.objectName) {
                case 'axis':
                    this.enumerateAxis(enumeration);
                    break;
                case 'range1':
                    this.enumerateRange(enumeration, 'range1', 'Range 1', false);
                    break;
                case 'range2':
                    this.enumerateRange(enumeration, 'range2', 'Range 2', true, Tachometer.RoleNames.range2StartValue);
                    break;
                case 'range3':
                    this.enumerateRange(enumeration, 'range3', 'Range 3', true, Tachometer.RoleNames.range3StartValue);
                    break;
                case 'target':
                    this.enumerateTarget(enumeration);
                    break;
                case 'indicator':
                    this.enumerateIndicator(enumeration);
                    break;
                case 'labels':
                    this.enumerateDataLabels(enumeration, 'labels');
                    break;
                case 'calloutValue':
                    var labelSettings = this.viewModel && this.viewModel.callout.calloutValue ? this.viewModel.callout.calloutValue
                        : Tachometer.getDefaultTachometerCalloutSettings();
                    this.enumerateCalloutProperties(enumeration, 'calloutValue', 'Callout Value', labelSettings);
                    break;
                case 'calloutPercent':
                    var labelSettings = this.viewModel && this.viewModel.callout.calloutPercent ? this.viewModel.callout.calloutPercent
                        : Tachometer.getDefaultTachometerCalloutPercentSettings();
                    this.enumerateCalloutPercentProperties(enumeration, 'calloutPercent', 'Callout Percent', labelSettings);
                    break;
            }
            return enumeration;
        }

        private enumerateAxis(enumeration: VisualObjectInstance[]): void {
            var properties = Tachometer.getTachometerObjectsProperties(this.dataView, this.axisData);

            enumeration.push({
                objectName: 'axis',
                displayName: 'Axis',
                properties: <any>properties,
                selector: null,
            });
        }

        private enumerateRange(enumeration: VisualObjectInstance[], rangeName: string, rangeDisplayName: string, showStartValue: boolean, startValueDataRoleName?: string): void {
            var dataView = this.dataView;
            var properties: any = {};

            var objects = dataView && dataView.metadata ? dataView.metadata.objects : null;
            var rangeObject: TachometerRangeObject = objects ? <TachometerRangeObject>objects[rangeName] : null;
            var hasRangeObject: boolean = (objects != null && rangeObject != null);

            properties.rangeColor = hasRangeObject && rangeObject.rangeColor ? rangeObject.rangeColor.solid.color : undefined;
            properties.thickness = hasRangeObject && rangeObject.thickness != null ? rangeObject.thickness : undefined;
            if (showStartValue && startValueDataRoleName && !DataRoleHelper.hasRoleInDataView(dataView, startValueDataRoleName)) {
                properties.startValue = hasRangeObject && rangeObject.startValue != null ? rangeObject.startValue : undefined;
            }

            enumeration.push({
                objectName: rangeName,
                displayName: rangeDisplayName,
                properties: <any>properties,
                selector: null,
            });
        }
        private enumerateTarget(enumeration: VisualObjectInstance[]): void {
            var dataView = this.dataView;
            var properties: any = {};

            var objects: TachometerTargetObjects = dataView && dataView.metadata ? <TachometerTargetObjects>dataView.metadata.objects : null;
            var targetObject: TachometerTargetObject = objects ? objects.target : null;
            var hasTargetObject: boolean = (objects != null && targetObject != null);

            properties['show'] = hasTargetObject && targetObject.show != null ? targetObject.show : true;
            if (!DataRoleHelper.hasRoleInDataView(dataView, Tachometer.RoleNames.targetValue)) {
                properties.value = hasTargetObject && targetObject.value ? targetObject.value : undefined;
            }

            properties.lineColor = hasTargetObject && targetObject.lineColor ? targetObject.lineColor.solid.color : undefined;
            properties.innerRadiusRatio = hasTargetObject && targetObject.innerRadiusRatio ? Tachometer.clamp(targetObject.innerRadiusRatio, 0, Tachometer.MaxTargetRadiusFactor)
                : undefined;
            properties.textColor = hasTargetObject && targetObject.textColor ? targetObject.textColor.solid.color : Tachometer.defaultLabelColor;
            properties.fontSize = hasTargetObject && targetObject.fontSize ? targetObject.fontSize : minLabelFontSize;

            enumeration.push({
                objectName: 'target',
                displayName: 'Target',
                properties: <any>properties,
                selector: null,
            });
        }

        private enumerateIndicator(enumeration: VisualObjectInstance[]): void {
            var dataView = this.dataView;
            var properties: any = {};

            var objects: TachometerIndicatorObjects = dataView && dataView.metadata ? <TachometerIndicatorObjects>dataView.metadata.objects : null;
            var indicator: TachometerIndicatorObject = objects ? objects.indicator : null;
            var hasIndicatorObject: boolean = (objects != null && indicator != null);

            properties.pointerColor = hasIndicatorObject && indicator.pointerColor != null ? indicator.pointerColor.solid.color : undefined;
            properties.pointerSizeFactor = hasIndicatorObject && indicator.pointerSizeFactor != null ? indicator.pointerSizeFactor : undefined;
            properties.baseColor = hasIndicatorObject && indicator.baseColor != null ? indicator.baseColor.solid.color : undefined;
            properties.baseThicknessFactor = hasIndicatorObject && indicator.baseThicknessFactor != null ? indicator.baseThicknessFactor : undefined;

            enumeration.push({
                selector: null,
                objectName: 'indicator',
                displayName: 'Indicator',
                properties: <any>properties,
            });
        }

        private enumerateDataLabels(enumeration: VisualObjectInstance[], objectName: string): void {

            var labelSettings = this.viewModel && this.axisData.dataLabels ? this.axisData.dataLabels : Tachometer.getDefaultTachometerLabelSettings();
            var objects: DataViewObjects = this.dataView && this.dataView.metadata ? this.dataView.metadata.objects : null;
            var labelsObj: TachometerLabelObject = objects ? <TachometerLabelObject>objects[objectName] : null;
            var haslabelObject: boolean = (objects != null && labelsObj != null);

            var instance: VisualObjectInstance = {
                objectName: objectName,
                selector: null,
                properties: {},
            };

            this.enumerateLabelInstance(instance, labelSettings);

            //Add specific properties of Data labels.
            instance.properties['round'] = labelSettings.round; //Show nicely rounded labels such as 100, 200 etc.

            // Allow user to specify the number of ticks only if the axis settings are not initialized
            // or scale is linear
            // or user has not requested to round the scale
            if ((this.axisData == null)
                || ((this.axisData != null) && (this.axisData.axisScaleType === axisScaleType.linear))
                || (!labelSettings.round)) {

                if (haslabelObject) {
                    instance.properties['count'] = labelsObj.count;
                }
                else {
                    instance.properties['count'] = undefined;
                }
            }
            //If the scale is log, and user speficied 'round', there is a possibility of displaying a
            //very large number of labels. So give the option to reduce the number of 
            else if ((this.axisData != null)
                && (this.axisData.axisScaleType === axisScaleType.log)
                && (labelSettings.round)
            ) {
                instance.properties['reduce'] = labelSettings.reduce;
            }

            enumeration.push(instance);
        }

        private enumerateCalloutProperties(enumeration: VisualObjectInstance[], objectName: string, displayName: string, labelSettings: TachometerDataLabelsData): void {
            var instance: VisualObjectInstance = {
                objectName: objectName,
                displayName: displayName,
                properties: {},
                selector: null,
            };

            this.enumerateLabelInstance(instance, labelSettings);

            var objects: DataViewObjects = this.dataView && this.dataView.metadata ? this.dataView.metadata.objects : null;
            var labelsObj: TachometerLabelObject = objects ? <TachometerLabelObject>objects[objectName] : null;
            var haslabelObject: boolean = labelsObj != null;

            instance.properties['xOffset'] =
                (haslabelObject && labelsObj.xOffset !== undefined) && (labelSettings.offset && labelSettings.offset.x) ?
                    labelSettings.offset.x : undefined;
            instance.properties['yOffset'] =
                (haslabelObject && labelsObj.yOffset !== undefined) && (labelSettings.offset && labelSettings.offset.y && labelSettings.offset.y !== undefined) ?
                    -labelSettings.offset.y //switching direction for intutive user experience of +ve up
                    : undefined;

            enumeration.push(instance);
        }

        private enumerateCalloutPercentProperties(enumeration: VisualObjectInstance[], objectName: string, displayName: string, labelSettings: TachometerDataLabelsData): void {
            var instance: VisualObjectInstance = {
                objectName: objectName,
                displayName: displayName,
                properties: {},
                selector: null,
            };

            this.enumerateLabelInstance(instance, labelSettings);

            var objects: DataViewObjects = this.dataView && this.dataView.metadata ? this.dataView.metadata.objects : null;
            var labelsObj: TachometerLabelObject = objects ? <TachometerLabelObject>objects[objectName] : null;
            var haslabelObject: boolean = (labelsObj != null);

            instance.properties['xOffset'] =
                (haslabelObject && labelsObj.xOffset !== undefined) && (labelSettings.offset && labelSettings.offset.x) ?
                    labelSettings.offset.x : undefined;
            instance.properties['yOffset'] =
                (haslabelObject && labelsObj.yOffset !== undefined) && (labelSettings.offset && labelSettings.offset.y && labelSettings.offset.y !== undefined) ?
                    -labelSettings.offset.y //switching direction for intutive user experience of +ve up
                    : undefined;
            instance.properties['invert'] = haslabelObject ? labelsObj.invert : labelSettings.invert;

            enumeration.push(instance);
        }

        private enumerateLabelInstance(instance: VisualObjectInstance, labelSettings: TachometerDataLabelsData) {
            var precision = labelSettings.precision;
            instance.properties['show'] = labelSettings.show;
            instance.properties['color'] = labelSettings.labelColor || Tachometer.defaultLabelColor;
            if (labelSettings.displayUnits != null) {
                instance.properties['labelDisplayUnits'] = labelSettings.displayUnits;
            }
            instance.properties['labelPrecision'] = precision === dataLabelUtils.defaultLabelPrecision ? undefined : precision;
            instance.properties['fontSize'] = labelSettings.fontSize;
        }
    }
}