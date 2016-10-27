/*
*  Power BI Visualizations
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

module powerbi.visuals {
    import ClassAndSelector = jsCommon.CssConstants.ClassAndSelector;
    import createClassAndSelector = jsCommon.CssConstants.createClassAndSelector;
    import PixelConverter = jsCommon.PixelConverter;
    import DataRoleHelper = powerbi.data.DataRoleHelper;

    module axisType {
        export var linear: string = 'linear';
        export var log: string = 'log';

        export var type: IEnumType = createEnumType([
            { value: linear, displayName: linear },
            { value: log, displayName: log },
        ]);
    }

    export interface Offset {
        x: number;
        y: number;
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
    }

    export interface TachometerViewModel extends TooltipEnabledDataPoint {
        viewportHeight: number;
        viewportWidth: number;
        availableHeight: number;
        availableWidth: number;
        metadataColumn: DataViewMetadataColumn;
        axis: TachometerAxisData;
        callout: TachometerCalloutSettings;
        margin?: IMargin;
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

    export interface TachometerAxisData {
        value: number;
        percent: number;
        startAngle: number;  //The angle to start the dial
        endAngle: number; //The angle to end the dial
        axisScaleType: string; //Scale to measure data in the gauge
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
        tooltipItems: TooltipSeriesDataItem[];
        valueRange: number; //range between startValue and endValue
        angleRange: number; //angle between startAngle and endAngle
        radius: number;
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
    }

    export interface TachometerSmallViewPortProperties {
        hideTachometerSideNumbersOnSmallViewPort: boolean;
        smallTachometerMarginsOnSmallViewPort: boolean;
        MinHeightTachometerSideNumbersVisible: number;
        TachometerMarginsOnSmallViewPort: number;
    }

    export interface TachometerAxisLabel {
        angle: number;
        value: number;
        displayValue: string;
    }

    export interface TachometerConstructorOptions {
        tachometerSmallViewPortProperties?: TachometerSmallViewPortProperties;
        animator?: IGenericAnimator;
        tooltipsEnabled?: boolean;
    }

    export interface TachometerAxisObject extends DataViewObject {
        startAngle?: number;
        endAngle?: number;
        startValue?: number;
        endValue?: number;
        axisScaleType?: string; //Scale to measure data in the gauge
    }

    export interface TachometerAxisObjects extends DataViewObjects {
        axis: TachometerAxisObject;
    }

    export interface TachometerRangeObject extends DataViewObject {
        rangeColor?: Fill;
        thickness?: string;
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
        pointerSizeFactor?: string; //Ratio of distance to Pointer tip as a factor of radius
        baseColor?: Fill;
        baseThicknessFactor?: string; //Inner Radius of the base as a ratio of its outer radius
    }

    export interface TachometerIndicatorObjects extends DataViewObjects {
        indicator: TachometerIndicatorObject;
    }

    export interface TachometerDataLabelsSettingsOptions {
        show: boolean;
        enumeration: ObjectEnumerationBuilder;
        dataLabelsSettings: TachometerDataLabelsData;
        displayUnits?: boolean;
        precision?: boolean;
        position?: boolean;
        positionObject?: string[];
        selector?: powerbi.data.Selector;
        fontSize?: boolean;
        showAll?: boolean;
        labelDensity?: boolean;
        labelStyle?: boolean;
        round?: boolean;
        count?: number;
        reduce?: boolean;
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
    }

    export interface TachometerRoleNames {
        y: string;
        startValue: string;
        endValue: string;
        targetValue: string;
        range2StartValue: string;
        range3StartValue: string;
    };

    /** 
     * Renders a data value in a gauge. The gauge can start and end in any user defined angle/orientation.
     * Gauge has 3 main regions to indicate for example fail, average, high values.
     * Almost every component in the gauge is customizable through capabilities.
     */
    export class Tachometer implements IVisual {
        private static UnintializedStartValue = -Infinity;
        private static UnintializedEndValue = +Infinity;
        private static UnintializedRangeStartValue = Tachometer.UnintializedEndValue; //uninitialize to UNINITIALIZED_END_VALUE so that the range is invalid
        private static UninitializedRatio = +Infinity;
        private static UnintializedStartAngle = -Math.PI * 2 / 3;
        private static UnintializedEndAngle = Math.PI * 2 / 3;

        private static MinDistanceFromTicks = 30;
        private static MinWidthForTargetLabel = 150;
        private static ReducedLeftRightMargin = 15;
        private static DefaultMarginSettings: IMargin = {
            top: 20,
            bottom: 15,
            left: 45,
            right: 45
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
            }
        };
        private static DefaultRange1Color = '#0EFF23'; //Green;
        private static DefaultRange2Color = '#FFFE00'; //Yellow
        private static DefaultRange3Color = 'red'; //Red

        private static DefaultCalloutFontSizeInPt = 20;
        private static DefaultCalloutPercentFontSizeInPt = 14;
        private static BaseArcRadiusFactor = 20; //Radius of center arc as a factor of main arc
        private static MaxTargetRadiusFactor = 100 - Tachometer.BaseArcRadiusFactor;
        private static NeedleHeightToWidthRatio: number = 0.05; //Width of needle as a factor of its height
        private static MainTachometerGroupClassName = 'mainGroup';
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

        private currentViewport: IViewport;
        private element: JQuery;
        private style: IVisualStyle;
        private viewModel: TachometerViewModel;
        private currentScaleType: string = 'undefined';

        private static LineFunction = d3.svg.line()
            .x(function (d) { return d.x; })
            .y(function (d) { return d.y; })
            .interpolate('linear');

        private svg: D3.Selection;
        private mainGraphicsContext: D3.Selection;
        private overlayGraphicsContext: D3.Selection;
        private axisScale: D3.Scale.LinearScale;
        private range1Arc: D3.Svg.Arc;
        private range2Arc: D3.Svg.Arc;
        private range3Arc: D3.Svg.Arc;
        private centerArc: D3.Svg.Arc;

        private range1ArcPath: D3.Selection;
        private range2ArcPath: D3.Selection;
        private range3ArcPath: D3.Selection;
        private centerArcPath: D3.Selection;
        private calloutLabel: D3.Selection;
        private calloutPercent: D3.Selection;
        private needle: D3.Selection;
        private targetIndicator: D3.Selection;
        private targetConnector: D3.Selection;
        private targetText: D3.Selection;
        private gaugeStyle: TachometerStyle;
        private axisData: TachometerAxisData;
        private axisLabels: TachometerAxisLabel[];
        private tachometerSmallViewPortProperties: TachometerSmallViewPortProperties;
        private showTargetLabel: boolean = false;
        private tooltipsEnabled: boolean;
        private hostService: IVisualHostServices;
        private dataView: DataView;

        public static RoleNames: TachometerRoleNames = {
            y: 'Y',
            startValue: 'StartValue',
            endValue: 'EndValue',
            targetValue: 'TargetValue',
            range2StartValue: 'Range2StartValue',
            range3StartValue: 'Range3StartValue',
        };

        public static capabilities: VisualCapabilities = {
            dataRoles: [
                {
                    name: 'Y',
                    kind: powerbi.VisualDataRoleKind.Measure,
                    displayName: 'Value',
                    description: 'Data field that define the value you want to plot',
                    requiredTypes: [{ numeric: true }, { integer: true }],
                }, {
                    name: 'StartValue',
                    kind: powerbi.VisualDataRoleKind.Measure,
                    displayName: 'Start Value',
                    description: 'Data field that define start value',
                    requiredTypes: [{ numeric: true }, { integer: true }],
                }, {
                    name: 'EndValue',
                    kind: powerbi.VisualDataRoleKind.Measure,
                    displayName: 'End Value',
                    description: 'Data field that define end value',
                    requiredTypes: [{ numeric: true }, { integer: true }],
                }, {
                    name: 'TargetValue',
                    kind: powerbi.VisualDataRoleKind.Measure,
                    displayName: 'Target Value',
                    description: 'Data field that define target value',
                    requiredTypes: [{ numeric: true }, { integer: true }],
                }, {
                    name: 'Range2StartValue',
                    kind: powerbi.VisualDataRoleKind.Measure,
                    displayName: 'Range2 Start Value',
                    description: 'Start value of Range2',
                    requiredTypes: [{ numeric: true }, { integer: true }],
                }, {
                    name: 'Range3StartValue',
                    kind: powerbi.VisualDataRoleKind.Measure,
                    displayName: 'Range3 Start Value',
                    description: 'Start value of Range3',
                    requiredTypes: [{ numeric: true }, { integer: true }],
                }
            ],
            objects: {
                general: {
                    properties: {
                        formatString: {
                            type: { formatting: { formatString: true } },
                        },
                    },
                },
                axis: {
                    displayName: 'Gauge Axis',
                    properties: {
                        startAngle: {
                            displayName: 'Start Angle',
                            description: 'Angle in Degrees from verticle to startValue',
                            placeHolderText: '-120',
                            type: { numeric: true }
                        },
                        endAngle: {
                            displayName: 'End Angle',
                            description: 'Angle in Degrees from verticle to endValue',
                            placeHolderText: '120',
                            type: { numeric: true }
                        },
                        startValue: {
                            displayName: 'Start Value',
                            description: 'Fixed start value',
                            type: { numeric: true }
                        },
                        endValue: {
                            displayName: 'End Value',
                            description: 'Fixed end value',
                            type: { numeric: true }
                        },
                        axisScaleType: {
                            displayName: 'Scale',
                            description: 'Scale to measure data in the gauge',
                            placeHolderText: axisType.linear,
                            type: { enumeration: axisType.type }
                        },
                    },
                },
                range1: {
                    displayName: 'Range 1',
                    properties: {
                        rangeColor: {
                            displayName: 'Color',
                            description: 'Range1 arc color',
                            type: { fill: { solid: { color: true } } }
                        },
                        thickness: {
                            displayName: 'Thickness',
                            description: 'Range1 thickness as a fraction of gauge radius',
                            placeHolderText: '50%',
                            type: { numeric: true }
                        },
                        startValue: {
                            displayName: 'Start Value',
                            description: 'Range1 start value',
                            type: { numeric: true }
                        },
                    },
                },
                range2: {
                    displayName: 'Range 2',
                    properties: {
                        rangeColor: {
                            displayName: 'Color',
                            description: 'Range2 arc color',
                            type: { fill: { solid: { color: true } } }
                        },
                        thickness: {
                            displayName: 'Thickness',
                            description: 'Range2 thickness as percentage of gauge radius',
                            placeHolderText: '50%',
                            type: { numeric: true }
                        },
                        startValue: {
                            displayName: 'Start Value',
                            description: 'Range2 start value',
                            type: { numeric: true }
                        },
                    },
                },
                range3: {
                    displayName: 'Range 3',
                    properties: {
                        rangeColor: {
                            displayName: 'Color',
                            description: 'Range3 color',
                            type: { fill: { solid: { color: true } } }
                        },
                        thickness: {
                            displayName: 'Thickness',
                            description: 'Range3 thickness as percentage of gauge radius',
                            placeHolderText: '50%',
                            type: { numeric: true }
                        },
                        startValue: {
                            displayName: 'Start Value',
                            description: 'Range3 start value',
                            type: { numeric: true }
                        },
                    },
                },
                target: {
                    displayName: 'Target',
                    properties: {
                        show: {
                            type: { bool: true }
                        },
                        value: {
                            displayName: 'Value',
                            description: 'Constant value as target',
                            type: { numeric: true }
                        },
                        lineColor: {
                            displayName: 'Line Color',
                            description: 'Target line color',
                            type: { fill: { solid: { color: true } } }
                        },
                        innerRadiusRatio: {
                            displayName: 'Length',
                            description: 'Length of target line as percentage of gauge radius',
                            placeHolderText: '50%',
                            type: { numeric: true }
                        },
                        textColor: {
                            displayName: 'Text Color',
                            type: { fill: { solid: { color: true } } }
                        },
                        fontSize: {
                            displayName: 'TextSize',
                            type: { formatting: { fontSize: true } }
                        },
                    },
                },
                indicator: {
                    displayName: 'Indicator',
                    properties: {
                        pointerColor: {
                            displayName: 'Needle Color',
                            description: 'Color of the needle',
                            type: { fill: { solid: { color: true } } }
                        },
                        pointerSizeFactor: {
                            displayName: 'Needle Size',
                            description: 'Distance to needle tip as percentage of gauge radius',
                            placeHolderText: '70%',
                            type: { numeric: true }
                        },
                        baseColor: {
                            displayName: 'Base Color',
                            description: 'Color of indicator base arc',
                            type: { fill: { solid: { color: true } } }
                        },
                        baseThicknessFactor: {
                            displayName: 'Base Thickness',
                            description: 'Thickness of indicator base as percentage of its radius',
                            placeHolderText: '30%',
                            type: { numeric: true }
                        },
                    },
                },
                labels: {
                    displayName: 'Axis Labels',
                    properties: {
                        show: {
                            type: { bool: true }
                        },
                        color: {
                            displayName: 'Color',
                            type: { fill: { solid: { color: true } } }
                        },
                        fontSize: {
                            displayName: 'Text Size',
                            type: { formatting: { fontSize: true } }
                        },
                        labelDisplayUnits: {
                            displayName: 'Display Units',
                            type: { formatting: { labelDisplayUnits: true } }
                        },
                        labelPrecision: {
                            displayName: 'Precision',
                            placeHolderText: 'Auto',
                            type: { numeric: true }
                        },
                        round: {
                            displayName: 'Round',
                            description: 'Round label values for better visualization',
                            type: { bool: true }
                        },
                        count: {
                            displayName: 'Count',
                            description: 'Approximate count of labels to display',
                            placeHolderText: '4 Approximately',
                            type: { numeric: true }
                        },
                        reduce: {
                            displayName: 'Reduce',
                            description: 'Reduce the number of labels',
                            type: { bool: true }
                        },
                    },
                },
                calloutValue: {
                    displayName: 'Callout Value',
                    properties: {
                        show: {
                            type: { bool: true }
                        },
                        color: {
                            displayName: 'Color',
                            type: { fill: { solid: { color: true } } }
                        },
                        fontSize: {
                            displayName: 'Text Size',
                            type: { formatting: { fontSize: true } }
                        },
                        labelDisplayUnits: {
                            displayName: 'Display Units',
                            type: { formatting: { labelDisplayUnits: true } }
                        },
                        labelPrecision: {
                            displayName: 'Precision',
                            placeHolderText: 'Auto',
                            type: { numeric: true }
                        },
                        xOffset: {
                            displayName: 'X Offset',
                            description: 'Horizontal percent displacement of Callout Value from default position',
                            placeHolderText: '0%',
                            type: { numeric: true }
                        },
                        yOffset: {
                            displayName: 'Y Offset',
                            description: 'Vertical percent displacement of Callout Value from default position',
                            placeHolderText: '0%',
                            type: { numeric: true }
                        },
                    },
                },
                calloutPercent: {
                    displayName: 'Callout Percent',
                    properties: {
                        show: {
                            type: { bool: true }
                        },
                        color: {
                            displayName: 'Color',
                            type: { fill: { solid: { color: true } } }
                        },
                        fontSize: {
                            displayName: 'TextSize',
                            type: { formatting: { fontSize: true } }
                        },
                        labelPrecision: {
                            displayName: 'Precision',
                            placeHolderText: 'Auto',
                            type: { numeric: true }
                        },
                        xOffset: {
                            displayName: 'X Offset',
                            description: 'Horizontal percent displacement of Callout Percent from default position',
                            placeHolderText: '0%',
                            type: { numeric: true }
                        },
                        yOffset: {
                            displayName: 'Y Offset',
                            description: 'Vertical percent displacement of Callout Percent from default position',
                            placeHolderText: '0%',
                            type: { numeric: true }
                        },
                        invert: {
                            displayName: 'Invert',
                            description: 'Invert the percentage value',
                            type: { bool: true }
                        },
                    },
                },
            },
            dataViewMappings: [{
                conditions: [
                    {
                        'Y': { min: 0, max: 1 },
                        'StartValue': { min: 0, max: 1 },
                        'EndValue': { min: 0, max: 1 },
                        'TargetValue': { min: 0, max: 1 },
                        'Range2StartValue': { min: 0, max: 1 },
                        'Range3StartValue': { min: 0, max: 1 }
                    },
                ],
                categorical: {
                    values: {
                        select: [
                            { bind: { to: 'Y' } },
                            { bind: { to: 'StartValue' } },
                            { bind: { to: 'EndValue' } },
                            { bind: { to: 'TargetValue' } },
                            { bind: { to: 'Range2StartValue' } },
                            { bind: { to: 'Range3StartValue' } },
                        ]
                    },
                },
            }],
            supportsSelection: false,
        };

        constructor(options?: TachometerConstructorOptions) {
            if (options) {
                if (options.tachometerSmallViewPortProperties) {
                    this.tachometerSmallViewPortProperties = options.tachometerSmallViewPortProperties;
                }
                this.tooltipsEnabled = options.tooltipsEnabled;
            }
        }

        public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstanceEnumeration {
            var enumeration = new ObjectEnumerationBuilder();

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
            return enumeration.complete();
        }

        private enumerateDataLabels(enumeration: ObjectEnumerationBuilder, objectName: string): void {

            var labelSettings = this.viewModel && this.viewModel.axis.dataLabels ? this.viewModel.axis.dataLabels : Tachometer.getDefaultTachometerLabelSettings();
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
                || ((this.axisData != null) && (this.axisData.axisScaleType === axisType.linear))
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
                && (this.axisData.axisScaleType === axisType.log)
                && (labelSettings.round)
            ) {
                instance.properties['reduce'] = labelSettings.reduce;
            }

            enumeration.pushInstance(instance);
        }

        private static defaultLabelColor: string = '#777777';
        private enumerateLabelInstance(instance: VisualObjectInstance, labelSettings: TachometerDataLabelsData) {
            var precision = labelSettings.precision;
            instance.properties['show'] = labelSettings.show;
            instance.properties['color'] = labelSettings.labelColor || Tachometer.defaultLabelColor;
            if (labelSettings.displayUnits != null) {
                instance.properties['labelDisplayUnits'] = labelSettings.displayUnits;
            }
            instance.properties['labelPrecision'] = precision === dataLabelUtils.defaultLabelPrecision ? null : precision;
            instance.properties['fontSize'] = labelSettings.fontSize;
        }

        private enumerateCalloutProperties(enumeration: ObjectEnumerationBuilder, objectName: string, displayName: string, labelSettings: TachometerDataLabelsData): void {
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

            enumeration.pushInstance(instance);
        }

        private enumerateCalloutPercentProperties(enumeration: ObjectEnumerationBuilder, objectName: string, displayName: string, labelSettings: TachometerDataLabelsData): void {
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

            enumeration.pushInstance(instance);
        }

        private enumerateAxis(enumeration: ObjectEnumerationBuilder): void {
            var properties = Tachometer.getTachometerObjectsProperties(this.dataView);

            enumeration.pushInstance({
                objectName: 'axis',
                displayName: 'Axis',
                properties: <any>properties,
                selector: null,
            });
        }

        private static DefaultRangeThickness = 50;

        private enumerateRange(enumeration: ObjectEnumerationBuilder, rangeName: string, rangeDisplayName: string, showStartValue: boolean, startValueDataRoleName?: string): void {
            var dataView = this.dataView;
            var properties: any = {};

            var objects = dataView && dataView.metadata ? dataView.metadata.objects : null;
            var rangeObject: TachometerRangeObject = objects ? <TachometerRangeObject>objects[rangeName] : null;
            var hasRangeObject: boolean = (objects != null && rangeObject != null);

            properties.rangeColor = hasRangeObject && rangeObject.rangeColor ? rangeObject.rangeColor.solid.color : undefined;
            properties.thickness = hasRangeObject && rangeObject.thickness ? rangeObject.thickness : undefined;
            if (showStartValue && startValueDataRoleName && !DataRoleHelper.hasRoleInDataView(dataView, startValueDataRoleName)) {
                properties.startValue = hasRangeObject && rangeObject.startValue != null ? rangeObject.startValue : undefined;
            }

            enumeration.pushInstance({
                objectName: rangeName,
                displayName: rangeDisplayName,
                properties: <any>properties,
                selector: null,
            });
        }

        private enumerateTarget(enumeration: ObjectEnumerationBuilder): void {
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
            properties.fontSize = hasTargetObject && targetObject.fontSize ? targetObject.fontSize : dataLabelUtils.minLabelFontSize;

            enumeration.pushInstance({
                objectName: 'target',
                displayName: 'Target',
                properties: <any>properties,
                selector: null,
            });
        }

        private enumerateIndicator(enumeration: ObjectEnumerationBuilder): void {
            var dataView = this.dataView;
            var properties: any = {};

            var objects: TachometerIndicatorObjects = dataView && dataView.metadata ? <TachometerIndicatorObjects>dataView.metadata.objects : null;
            var indicator: TachometerIndicatorObject = objects ? objects.indicator : null;
            var hasIndicatorObject: boolean = (objects != null && indicator != null);

            properties.pointerColor = hasIndicatorObject && indicator.pointerColor != null ? indicator.pointerColor.solid.color : undefined;
            properties.pointerSizeFactor = hasIndicatorObject && indicator.pointerSizeFactor ? indicator.pointerSizeFactor : undefined;
            properties.baseColor = hasIndicatorObject && indicator.baseColor != null ? indicator.baseColor.solid.color : undefined;
            properties.baseThicknessFactor = hasIndicatorObject && indicator.baseThicknessFactor ? indicator.baseThicknessFactor : undefined;

            enumeration.pushInstance({
                selector: null,
                objectName: 'indicator',
                displayName: 'Indicator',
                properties: <any>properties,
            });
        }

        private static getTachometerObjectsProperties(dataView: DataView): TachometerAxisObject {
            var properties: any = {};
            var objects: TachometerAxisObjects = dataView && dataView.metadata ? <TachometerAxisObjects>dataView.metadata.objects : null;
            var axisObject: TachometerAxisObject = objects ? objects.axis : null;
            var hasAxisObject: boolean = (objects != null && axisObject != null);

            properties.startAngle = hasAxisObject && axisObject.startAngle != null ? axisObject.startAngle : undefined;
            properties.endAngle = hasAxisObject && axisObject.endAngle != null ? axisObject.endAngle : undefined;
            if (!DataRoleHelper.hasRoleInDataView(dataView, Tachometer.RoleNames.startValue)) {
                properties.startValue = hasAxisObject && axisObject.startValue != null ? axisObject.startValue : undefined;
            }
            if (!DataRoleHelper.hasRoleInDataView(dataView, Tachometer.RoleNames.endValue)) {
                properties.endValue = hasAxisObject && axisObject.endValue != null ? axisObject.endValue : undefined;
            }
            properties.axisScaleType = hasAxisObject && axisObject.axisScaleType ? axisObject.axisScaleType : axisType.linear;

            return properties;
        }

        private setAxisScale(axisData: TachometerAxisData) {
            var domainStart: number = axisData.startValue;
            var domainEnd: number = axisData.endValue;

            if (axisData.axisScaleType
                && axisData.axisScaleType === axisType.log
            ) {
                if ((domainStart > 0 && domainEnd > 0) || (domainStart < 0 && domainEnd < 0)) {
                    this.axisScale = d3.scale.log();
                    this.currentScaleType = axisType.log;
                }
                else if ((domainStart === 0) && (Math.abs(domainEnd) > 1)) {
                    axisData.startValue = domainStart = Math.min(1, Math.exp(Math.log(domainEnd) / 10)); //make it close to zero as possible 
                    this.axisScale = d3.scale.log();
                    this.currentScaleType = axisType.log;
                }
                else if ((domainEnd === 0) && (Math.abs(domainStart) > 1)) {
                    axisData.endValue = domainEnd = Math.min(1, Math.exp(Math.log(domainStart) / 10)); //make it close to zero as possible 
                    this.axisScale = d3.scale.log();
                    this.currentScaleType = axisType.log;
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
            this.currentScaleType = axisType.linear;
            var dataLabels: TachometerDataLabelsData = (this.viewModel && this.viewModel.axis) ? this.viewModel.axis.dataLabels : null;
            if (dataLabels && dataLabels.show && dataLabels.round) { //get rounded tick marks
                if (dataLabels.count > 0) {
                    this.axisScale.nice(dataLabels.count);
                }
                else {
                    this.axisScale.nice();
                }
            }
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

        public init(options: VisualInitOptions) {
            this.element = options.element;
            this.currentViewport = options.viewport;
            this.style = options.style;
            this.gaugeStyle = Tachometer.DefaultStyleProperties;
            this.axisData = Tachometer.initializeTachometerData();
            this.setAxisScale(this.axisData);
            this.hostService = options.host;

            var svg = this.svg = d3.select(this.element.get(0)).append('svg');
            svg.classed(Tachometer.VisualClassName, true);
            var mainGraphicsContext = this.mainGraphicsContext = svg.append('g')
                .attr('class', Tachometer.MainTachometerGroupClassName);
            var overlayGraphicsContext = this.overlayGraphicsContext = svg.append('g')
                .attr('class', Tachometer.OverlayTachometerGroupClassName);

            this.range1Arc = d3.svg.arc();
            this.range2Arc = d3.svg.arc();
            this.range3Arc = d3.svg.arc();
            this.centerArc = d3.svg.arc();

            this.range1ArcPath = mainGraphicsContext.append('path')
                .classed('range1Arc', true);

            this.range2ArcPath = mainGraphicsContext.append('path')
                .classed('range2Arc', true);

            this.range3ArcPath = mainGraphicsContext.append('path')
                .classed('range3Arc', true);

            this.needle = overlayGraphicsContext.append('path') //The needle is added to overlay context to make sure it always renders above target indicator
                .classed('needle', true)
                .attr('stroke-width', Tachometer.DefaultStyleProperties.indicator.thickness)
                .attr('fill', Tachometer.DefaultStyleProperties.indicator.fill);

            this.centerArcPath = overlayGraphicsContext.append('path') //center arc should be rendered above the needle
                .classed('centerArc', true);

            this.calloutLabel = overlayGraphicsContext.append('text')
                .classed('calloutLabel', true);

            this.calloutPercent = overlayGraphicsContext.append('text')
                .classed('calloutPercent', true);
        }

        public update(options: VisualUpdateOptions) {
            debug.assertValue(options, 'options');

            this.currentViewport = options.viewport;
            var dataViews = options.dataViews;

            if (!dataViews || !dataViews[0]) {
                return;
            }
            this.dataView = dataViews[0];

            var viewModel = this.viewModel = this.transform(dataViews[0], this.tooltipsEnabled);
            viewModel = this.completeViewModel(viewModel);
            this.drawViewPort(viewModel);

            this.axisLabels = this.createAxisLabels();
            this.updateAxisLabelText(viewModel.axis, this.axisLabels);
            this.updateTarget(viewModel);//target should be updated after tic values
            //            this.updateVisualStyles();
            this.updateTooltips();

            var warnings = getInvalidValueWarnings(
                dataViews,
                false /*supportsNaN*/,
                false /*supportsNegativeInfinity*/,
                false /*supportsPositiveInfinity*/);

            this.hostService.setWarnings(warnings);
        }

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
            fontSize: dataLabelUtils.minLabelFontSize,
        };

        private static initializeTachometerData(): TachometerAxisData {
            var axisData: TachometerAxisData = {
                startValue: Tachometer.UnintializedStartValue,
                endValue: Tachometer.UnintializedEndValue,
                startAngle: Tachometer.UnintializedStartAngle,
                endAngle: Tachometer.UnintializedEndAngle,
                axisScaleType: axisType.linear,
                value: 0,
                radius: 1,
                tooltipItems: [],
                valueRange: 0,
                angleRange: 0,
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

        private resetTachometerData(): TachometerAxisData {
            var axisData = this.axisData;

            axisData.startValue = Tachometer.UnintializedStartValue;
            axisData.endValue = Tachometer.UnintializedEndValue;
            axisData.value = 0;
            axisData.tooltipItems = [];
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

        private transformTachometerData(dataView: DataView): TachometerAxisData {
            var axisData = this.resetTachometerData();
            axisData = this.transformTachometerDataRoles(dataView, axisData);
            axisData = this.transformTachometerSettings(dataView, axisData);

            var startAngle: number = Tachometer.normalizeAngle(axisData.startAngle);
            var endAngle: number = Tachometer.normalizeAngle(axisData.endAngle);

            if (startAngle > endAngle) {
                //convert from a circular scale to a linear scale for simplicity
                startAngle = startAngle - Tachometer.TwoPI;
            }

            axisData.startAngle = startAngle;
            axisData.endAngle = endAngle;
            axisData.angleRange = axisData.endAngle - axisData.startAngle;

            return axisData;
        }

        private transformTachometerDataRoles(dataView: DataView, axisData: TachometerAxisData): TachometerAxisData {
            if (dataView && dataView.categorical && dataView.categorical.values && dataView.metadata && dataView.metadata.columns) {
                var values = dataView.categorical.values;

                for (var i = 0; i < values.length; i++) {
                    var col = values[i].source;
                    var value: number = <number>values[i].values[0] || 0;
                    if (col && col.roles) {
                        if (col.roles[Tachometer.RoleNames.y]) {
                            if (isNaN(Number(value)))
                                axisData.value = 0;
                            else
                                axisData.value = value;
                        } else if (col.roles[Tachometer.RoleNames.startValue]) {
                            if (isNaN(Number(value)))
                                axisData.startValue = 0;
                            else
                                axisData.startValue = value;
                        } else if (col.roles[Tachometer.RoleNames.endValue]) {
                            if (isNaN(Number(value)))
                                axisData.endValue = 0;
                            else
                                axisData.endValue = value;
                        } else if (col.roles[Tachometer.RoleNames.targetValue]) {
                            if (isNaN(Number(value)))
                                axisData.target.value = 0;
                            else
                                axisData.target.value = value;
                            if (value) axisData.tooltipItems.push({ value: value, metadata: values[i] });
                        } else if (col.roles[Tachometer.RoleNames.range2StartValue]) {
                            if (isNaN(Number(value)))
                                axisData.range2.startValue = 0;
                            else
                                axisData.range2.startValue = value;
                            if (value) axisData.tooltipItems.push({ value: value, metadata: values[i] });
                        } else if (col.roles[Tachometer.RoleNames.range3StartValue]) {
                            if (isNaN(Number(value)))
                                axisData.range3.startValue = 0;
                            else
                                axisData.range3.startValue = value;
                            if (value) axisData.tooltipItems.push({ value: value, metadata: values[i] });
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
            axisData.target = Tachometer.transformTargetSettings(dataView, axisData.target);
            axisData.indicator = Tachometer.transformIndicatorSettings(dataView, axisData.indicator);
            axisData.dataLabels = Tachometer.transformDataLabelSettings(dataView, 'labels', Tachometer.getDefaultTachometerLabelSettings());

            return axisData;
        }

        //Translate the angle to the scale -PI to + PI
        private static normalizeAngle(angle: number): number {
            var normalizedAngle: number = angle % Tachometer.TwoPI;

            if (angle > Math.PI) {
                normalizedAngle = angle - Tachometer.TwoPI;
            }
            else if (angle < - Math.PI) {
                normalizedAngle = angle + Tachometer.TwoPI;
            }
            return normalizedAngle;
        }

        private static transformGaugeAxisSettings(dataView: DataView, axisData: TachometerAxisData): TachometerAxisData {
            // Override settings according to property pane axis values
            var axisOptions: TachometerAxisObject = Tachometer.getTachometerObjectsProperties(dataView);

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

            return axisData;
        }

        private transform(dataView: DataView, tooltipsEnabled: boolean = true): TachometerViewModel {
            var axisData: TachometerAxisData = this.transformTachometerData(dataView);

            return {
                metadataColumn: Tachometer.getMetaDataColumn(dataView),
                axis: axisData,
                tooltipInfo: Tachometer.getToolTipInfo(dataView, axisData, tooltipsEnabled),
                callout: {
                    calloutValue: Tachometer.transformDataLabelSettings(dataView, 'calloutValue', Tachometer.getDefaultTachometerCalloutSettings()),
                    calloutPercent: Tachometer.transformDataLabelSettings(dataView, 'calloutPercent', Tachometer.getDefaultTachometerCalloutPercentSettings()),
                    baseOffset: { x: 0, y: 0 },
                },
                availableHeight: 0,
                availableWidth: 0,
                viewportHeight: 0,
                viewportWidth: 0
            };
        }

        private static getToolTipInfo(dataView: DataView, axisData: TachometerAxisData, tooltipsEnabled: boolean): TooltipDataItem[] {
            var tooltipInfo: TooltipDataItem[];

            if (tooltipsEnabled && dataView) {
                if (axisData.tooltipItems.length > 0) {
                    tooltipInfo = TooltipBuilder.createTooltipInfo(Tachometer.formatStringProp, null, null, null, null, axisData.tooltipItems);
                }
                else {
                    var dataViewCat = dataView.categorical;

                    if (dataViewCat && dataViewCat.values && dataViewCat.values.length > 0) {
                        var categoryValue: DataViewValueColumn = dataViewCat.values[0];
                        var value = categoryValue.values[0];

                        tooltipInfo = TooltipBuilder.createTooltipInfo(Tachometer.formatStringProp, dataViewCat, null, value);
                    }
                }
            }
            return tooltipInfo;
        }

        private static getDefaultTachometerLabelSettings(): TachometerDataLabelsData {
            var dataLabelSettings: TachometerDataLabelsData = {
                show: true,
                fontSizePx: PixelConverter.fromPoint(NewDataLabelUtils.DefaultLabelFontSizeInPt),
                labelColor: null,
                displayUnits: 0,
                precision: dataLabelUtils.defaultLabelPrecision,
                fontSize: NewDataLabelUtils.DefaultLabelFontSizeInPt,
                round: true,
                count: undefined,
                reduce: true, //avoid overcrowding labels when log scale is used
                textHeight: PixelConverter.fromPointToPixel(NewDataLabelUtils.DefaultLabelFontSizeInPt)
                + Tachometer.DefaultStyleProperties.labels.padding
            };
            return dataLabelSettings;
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
                + Tachometer.DefaultStyleProperties.callout.padding
            };
            return dataLabelSettings;
        }

        private static getDefaultTachometerCalloutPercentSettings(): TachometerDataLabelsData {
            var dataLabelSettings: TachometerDataLabelsData = {
                show: false,
                fontSizePx: PixelConverter.fromPoint(Tachometer.DefaultCalloutPercentFontSizeInPt),
                labelColor: '#333333',
                precision: dataLabelUtils.defaultLabelPrecision,
                fontSize: Tachometer.DefaultCalloutPercentFontSizeInPt,
                offset: { x: undefined, y: undefined },
                textHeight: PixelConverter.fromPointToPixel(Tachometer.DefaultCalloutFontSizeInPt)
                + Tachometer.DefaultStyleProperties.callout.padding,
                invert: false
            };
            return dataLabelSettings;
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
                    dataLabelsSettings.textHeight = PixelConverter.fromPointToPixel(labelsObj.fontSize)
                        + Tachometer.DefaultStyleProperties.callout.padding;
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
                    thickness = +rangeObject.thickness;
                    thickness = Tachometer.clamp(thickness, 0, 100);
                    rangeObject.thickness = thickness.toString(); //We want to set this to clamped value for enumeration
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

        private static transformTargetSettings(dataView: DataView, targetSettings: TachometerTargetData): TachometerTargetData {
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
            return targetSettings;
        }

        private static transformIndicatorSettings(dataView: DataView, indicatorData: TachometerIndicatorData): TachometerIndicatorData {
            var objects: TachometerIndicatorObjects = dataView && dataView.metadata ? <TachometerIndicatorObjects>dataView.metadata.objects : null;
            var indicatorObject: TachometerIndicatorObject = objects ? objects.indicator : null;
            var hasIndicatorObject: boolean = (objects != null && indicatorObject != null);

            if (hasIndicatorObject) {
                if (indicatorObject.pointerSizeFactor && indicatorObject.pointerSizeFactor !== undefined) {
                    var thickness: number = Tachometer.clamp(+indicatorObject.pointerSizeFactor, 0, 100);
                    indicatorObject.pointerSizeFactor = thickness.toString(); //We want to set this to clamped value for enumeration
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
                    var thickness: number = Tachometer.clamp(+indicatorObject.baseThicknessFactor, 0, 100);
                    indicatorObject.baseThicknessFactor = thickness.toString(); //We want to set this to clamped value for enumeration
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

        private removeTargetElements() {
            if (this.targetIndicator) {
                this.targetIndicator.remove();
                this.targetText.remove();
                this.targetConnector.remove();
                this.targetIndicator = this.targetConnector = this.targetText = null;
            }
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

        private completeViewModel(viewModel: TachometerViewModel): TachometerViewModel {
            var viewport = this.currentViewport;
            var calloutTextHeight = 0;
            var calloutValueSpace = 0;
            var calloutPercentTextHeight = 0;
            var calloutPercentSpace = 0;
            var axisData = viewModel.axis;
            var calloutValueUserDefinedYOffset = 0;
            var calloutPercentUserDefinedYOffset = 0;

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

            this.axisData = axisData;
            this.setAxisScale(axisData);

            // Only show the target label if:
            //   1. There is a target
            //   2. The viewport width is big enough for a target
            this.showTargetLabel = (axisData.target.value !== Tachometer.UnintializedStartValue)
                && axisData.target.show
                && (this.currentViewport.width > Tachometer.MinWidthForTargetLabel)
                && this.showLabelText();

            axisData.dataLabels.formatter = this.getWiderFormatter(axisData.dataLabels, axisData.startValue, axisData.endValue);
            var margin = this.defineMargins();
            var width = viewport.width - margin.right - margin.left;

            var callout: TachometerCalloutSettings = viewModel.callout;
            if (callout && callout.calloutPercent && callout.calloutPercent.show) {
                calloutPercentTextHeight = callout.calloutPercent.textHeight;
                var yOffsetBaseEstimate = viewport.height - (margin.bottom + calloutPercentTextHeight);
                //Adjust for user defined label displacement
                calloutPercentUserDefinedYOffset = Tachometer.translateUserYOffset(yOffsetBaseEstimate, callout.calloutPercent, viewport.height);
            }
            calloutPercentSpace = calloutPercentUserDefinedYOffset >= 0 ?
                calloutPercentTextHeight : Math.max(calloutPercentTextHeight + calloutPercentUserDefinedYOffset, 0);

            if (callout && callout.calloutValue && callout.calloutValue.show) {
                calloutTextHeight = callout.calloutValue.textHeight;
                var yOffsetBaseEstimate = viewport.height - (margin.bottom + calloutTextHeight);
                //Adjust for user defined label displacement
                calloutValueUserDefinedYOffset = Tachometer.translateUserYOffset(yOffsetBaseEstimate, callout.calloutValue, viewport.height);
            }
            calloutValueSpace = calloutValueUserDefinedYOffset >= 0 ?
                calloutTextHeight : Math.max(calloutTextHeight + calloutValueUserDefinedYOffset, 0);

            var availableHeight = viewport.height - margin.top - margin.bottom - calloutValueSpace - calloutPercentSpace;
            var translation: TachometerTranslationSettings =
                this.calculateTranslation(axisData.startAngle, axisData.endAngle, availableHeight, width);

            viewModel.viewportHeight = viewport.height;
            viewModel.viewportWidth = viewport.width;
            viewModel.availableHeight = availableHeight;
            viewModel.availableWidth = width;
            viewModel.axis = this.completeAxis(axisData, translation, margin);
            viewModel.callout = this.completeCallout(callout, translation, margin);
            viewModel.margin = margin;

            return viewModel;
        }

        private completeAxis(axisData: TachometerAxisData, translation: TachometerTranslationSettings, margin: IMargin): TachometerAxisData {
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
            var xOffset: number = margin.left + translation.xOffset;
            var yOffset: number = margin.top + translation.yOffset;
            axisData.offset.x = xOffset;
            axisData.offset.y = yOffset;
            axisData.transformString = SVGUtil.translate(xOffset, yOffset);
            axisData.indicator = this.completeIndicator(axisData.indicator, translation, axisData.offset, axisData.value);
            axisData.target = this.completeTarget(axisData.target, axisData);

            //Checking that the value is plotted inside the tachometer boundaries
            var baseValue: number = Math.min(axisData.endValue, axisData.startValue);
            var percent: number = axisData.valueRange !== 0 ? Math.abs((axisData.value - baseValue) * 100 / (axisData.valueRange)) : 0;

            axisData.percent = percent;

            return axisData;
        }

        private completeAxisRange(range: TachometerRangeData, radius: number): TachometerRangeData {
            range.radius = radius;
            range.innerRadius = radius * range.innerRadiusRatio;
            range.startAngle = this.axisScale(range.startValue);
            range.endAngle = this.axisScale(range.endValue);

            return range;
        }

        private completeCallout(callout: TachometerCalloutSettings, translation: TachometerTranslationSettings, margin: IMargin): TachometerCalloutSettings {
            callout.baseOffset.x = margin.left + translation.calloutxOffset;
            callout.baseOffset.y = margin.top + translation.calloutyOffset;

            return callout;
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
            target.fontSizePx = PixelConverter.fromPoint(target.fontSize);

            return target;
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

        /** Note: public for testability */
        public drawViewPort(viewModel: TachometerViewModel): void {
            debug.assertAnyValue(viewModel, 'Tachometer options');

            this.updateVisualComponents(viewModel);
            this.updateCallout(viewModel);

            this.svg.attr('height', this.currentViewport.height).attr('width', this.currentViewport.width);
        }

        private updateTarget(viewModel: TachometerViewModel) {
            var axis = viewModel.axis;
            var target = axis.target;

            if (this.showTargetLabel) {
                this.updateTargeIndicator(target);
                this.updateTargetText(viewModel, this.axisLabels);
            } else {
                this.removeTargetElements();
            }
        }

        //Convert the percent value of offset into a pixel value 
        private static translateUserYOffset
            (baseYOffset: number, callout: TachometerDataLabelsData, height: number): number {
            var yOffsetPercent = callout.offset.y;

            if (yOffsetPercent !== 0) {
                var halfTextHight = callout.textHeight / 2;
                var userYOffset = yOffsetPercent / 100 * height;
                var offset = userYOffset + baseYOffset;

                return offset < halfTextHight
                    ? halfTextHight - baseYOffset //goinig too high
                    : offset > height
                        ? height - halfTextHight - baseYOffset //going too low
                        : userYOffset;
            }
            else {
                return 0;
            }
        }

        private static getTextWidth(dataLabelSettings: TachometerDataLabelsData, text: string) {
            var textProperties: TextProperties = {
                text: text,
                fontFamily: NewDataLabelUtils.LabelTextProperties.fontFamily,
                fontSize: dataLabelSettings.fontSizePx,
                fontWeight: NewDataLabelUtils.LabelTextProperties.fontWeight,
            };
            return TextMeasurementService.measureSvgTextWidth(textProperties);
        }

        //Convert the percent value of offset into a pixel value 
        private static translateUserXOffset
            (baseXOffset: number, callout: TachometerDataLabelsData, width: number, text: string): number {
            var xOffsetPercent = callout.offset.x;
            if (xOffsetPercent !== 0) {
                var userXOffset = xOffsetPercent / 200 * width; //we have width /2 on either side
                var halftextWidth: number = Tachometer.getTextWidth(callout, text) / 2;
                var offset = baseXOffset + userXOffset;

                return offset < halftextWidth
                    ? halftextWidth - baseXOffset //too far left
                    : offset > width - halftextWidth
                        ? width - halftextWidth - baseXOffset // too far right so clamp it
                        : userXOffset;
            }
            else {
                return 0;
            }
        }

        private updateCallout(viewModel: TachometerViewModel): void {
            var callout = viewModel.callout;
            var calloutValue = callout.calloutValue;
            var calloutPercent = callout.calloutPercent;
            var axis = viewModel.axis;
            var total = axis.value;
            var dataLabels = viewModel.axis.dataLabels;
            var yOffsetBase = callout.baseOffset.y + (dataLabels.show ? dataLabels.textHeight : 0); //leave room for datalabels
            var xOffsetBase = callout.baseOffset.x;

            if (calloutValue.show) {
                var formatter = this.getFormatter(calloutValue, total);
                var value = formatter.format(total);
                yOffsetBase = yOffsetBase + calloutValue.textHeight / 2;

                var userYOffset = Tachometer.translateUserYOffset(yOffsetBase, calloutValue, viewModel.viewportHeight);
                var userXOffset = Tachometer.translateUserXOffset(xOffsetBase, calloutValue, viewModel.viewportWidth, value);

                this.calloutLabel
                    .attr('transform',
                    SVGUtil.translate(
                        xOffsetBase + userXOffset,
                        yOffsetBase + userYOffset))
                    .style({
                        'fill': calloutValue.labelColor,
                        'text-anchor': 'middle',
                        'font-size': calloutValue.fontSizePx,
                        'display': '',
                    })
                    .text(value);

                yOffsetBase = yOffsetBase + calloutValue.textHeight / 2;
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
            }
            if (calloutPercent.show) {
                var percent = calloutPercent.invert ? 100 - axis.percent : axis.percent;

                var formatter = this.getFormatter(calloutPercent, percent, true);
                var value = formatter.format(percent);
                value = ' [' + value + '%]';
                yOffsetBase = yOffsetBase + calloutPercent.textHeight / 2;

                var userYOffset = Tachometer.translateUserYOffset(yOffsetBase, calloutPercent, viewModel.viewportHeight);
                var userXOffset = Tachometer.translateUserXOffset(xOffsetBase, calloutPercent, viewModel.viewportWidth, value);

                this.calloutPercent
                    .attr('transform',
                    SVGUtil.translate(
                        xOffsetBase + userXOffset,
                        yOffsetBase + userYOffset
                    ))
                    .style({
                        'fill': calloutPercent.labelColor,
                        'text-anchor': 'middle',
                        'font-size': calloutPercent.fontSizePx,
                        'display': '',
                    })
                    .text(value);
            }
            else {
                this.calloutPercent
                    .style({
                        'display': 'none',
                    });
            }
        }

        private getWiderFormatter(dataLabelSettings: TachometerDataLabelsData, value1: number, value2: number): IValueFormatter {
            var widerLabelValue = Math.abs(value1) > Math.abs(value2) ? value1 : value2;
            return this.getFormatter(dataLabelSettings, widerLabelValue);
        }

        private createNiceRoundLabels(): TachometerAxisLabel[] {
            var axisLabels: TachometerAxisLabel[] = [];
            var axisData = this.axisData;
            var dataLabels: TachometerDataLabelsData = this.viewModel.axis.dataLabels;

            var ticCount = (Math.abs(axisData.valueRange) > 1) ? dataLabels.count
                : 1; //Show only the start and end values

            if (ticCount > 0) {
                var ticks: number[] = this.axisScale.ticks(ticCount);
                ticCount = ticks.length; //This is the real tic count when this.data.dataLabelsSettings.round = true
                var radius = this.viewModel.axis.radius;
                var lastAngle: number = Tachometer.UnintializedStartValue; // initialize to a very small number
                var reduce = dataLabels.reduce;
                var lastDisplayValue = '';
                for (var i = 0; i < ticCount; i++) {
                    var value = ticks[i];
                    var angle = this.axisScale(value);
                    var currentDisplayValue = dataLabels.formatter.format(value);
                    if (((!reduce ||
                        (Math.abs(lastAngle - angle) * radius) >= Tachometer.MinLabelDistance)) //to avoid overcrowding with labels
                        && (lastDisplayValue !== currentDisplayValue)) //to avoid repeating labels when they become rounded by Display Units
                    {
                        var axisLabel: TachometerAxisLabel = {
                            displayValue: currentDisplayValue,
                            value: value,
                            angle: angle
                        };
                        axisLabels.push(axisLabel);
                        lastAngle = angle;
                        lastDisplayValue = currentDisplayValue;
                    }
                }
            }
            return axisLabels;
        }

        private createEquallySpacedLabels(): TachometerAxisLabel[] {
            var axisLabels: TachometerAxisLabel[] = [];
            var axisData = this.axisData;
            var dataLabels: TachometerDataLabelsData = this.viewModel.axis.dataLabels;

            var numberOfSteps = (Math.abs(axisData.valueRange) > 1) ? dataLabels.count - 1
                : 1; //Show only the start and end values
            if (numberOfSteps > 0) {

                var startAngle = axisData.startAngle;
                var angleStep = axisData.angleRange / numberOfSteps;

                for (var i = 0; i <= numberOfSteps; i++) {
                    var angle = startAngle + (i * angleStep);
                    var value = this.axisScale.invert(angle);
                    var axisLabel: TachometerAxisLabel = {
                        displayValue: dataLabels.formatter.format(value),
                        value: value,
                        angle: angle
                    };

                    axisLabels.push(axisLabel);
                }
            }
            return axisLabels;
        }

        private createAxisLabels(): TachometerAxisLabel[] {

            if (this.viewModel.axis.dataLabels.show) {
                if (this.viewModel.axis.dataLabels.round) {
                    return this.createNiceRoundLabels();
                }
                else {
                    return this.createEquallySpacedLabels();
                }
            }
            var axisLabels: TachometerAxisLabel[] = [];
            return axisLabels;
        }

        private updateTooltips() {
            var data = this.viewModel;
            if (this.tooltipsEnabled) {
                TooltipManager.addTooltip(this.range1ArcPath, (tooltipEvent: TooltipEvent) => data.tooltipInfo);
                TooltipManager.addTooltip(this.range2ArcPath, (tooltipEvent: TooltipEvent) => data.tooltipInfo);
                TooltipManager.addTooltip(this.range3ArcPath, (tooltipEvent: TooltipEvent) => data.tooltipInfo);
            }
        }

        private updateAxisLabelText(axis: TachometerAxisData, axisLabels: TachometerAxisLabel[]) {
            this.svg.selectAll(Tachometer.LabelText.selector).remove();
            if (!axis.dataLabels.show) return;

            //radius of arc where labels will be rendered from
            var radius = axis.radius + this.gaugeStyle.labels.padding;
            var axisLabels = this.axisLabels;
            var labelColor = axis.dataLabels.labelColor;

            var ticCount = axisLabels.length;
            var fontSizePx = axis.dataLabels.fontSizePx;
            var xOffset = axis.offset.x;
            var yOffset = axis.offset.y;

            if (this.showLabelText()) {
                for (var count = 0; count < ticCount; count++) {
                    var axisLabel: TachometerAxisLabel = axisLabels[count];

                    var tickAngle = axisLabel.angle;
                    var sinAngle = Math.sin(tickAngle);
                    var ticX = xOffset + radius * sinAngle;
                    var ticY = yOffset - radius * Math.cos(tickAngle);

                    var anchor: string;
                    //Is the target on left side or right side of verticle?
                    var onRightSide: boolean = sinAngle > 0;

                    anchor = onRightSide ? 'start' : 'end';

                    var text = this.mainGraphicsContext
                        .append('text')
                        .attr({
                            'x': ticX,
                            'y': ticY,
                            'dy': 0,
                            'class': Tachometer.LabelText.class
                        })
                        .style({
                            'fill': labelColor,
                            'text-anchor': anchor,
                            'font-size': fontSizePx
                        })
                        .text(axisLabel.displayValue)
                        .append('title').text(axisLabel.displayValue);

                    this.truncateTextIfNeeded(text, ticX, onRightSide);
                }
            }
        }

        private truncateTextIfNeeded(text: D3.Selection, positionX: number, onRightSide: boolean) {
            var availableSpace = (onRightSide ? this.currentViewport.width - positionX : positionX);
            text.call(AxisHelper.LabelLayoutStrategy.clip,
                availableSpace,
                TextMeasurementService.svgEllipsis);
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

        private getFormatter(dataLabelSettings: TachometerDataLabelsData, value?: number, ignoreDataType: boolean = false): IValueFormatter {
            var displayUnits = dataLabelSettings.displayUnits == null ? 0 : dataLabelSettings.displayUnits;
            var realValue = displayUnits === 0 ? value : null;
            var formatString: string = valueFormatter.getFormatString((ignoreDataType ? null : this.viewModel.metadataColumn), Tachometer.formatStringProp);
            var precision = dataLabelUtils.getLabelPrecision(dataLabelSettings.precision, formatString);
            var valueFormatterOptions: ValueFormatterOptions = this.getOptionsForLabelFormatter(displayUnits, formatString, realValue, precision);
            valueFormatterOptions.formatSingleValues = displayUnits > 0 ? false : true;
            return valueFormatter.create(valueFormatterOptions);
        }

        //Convert all angles to a scale of zero to TwoPI
        //Angles should be in Radians
        private convertToTwoPIScale(angle: number): number {
            var angleInTwoPI: number = angle % Tachometer.TwoPI;
            if (angleInTwoPI < 0) {
                angleInTwoPI = angleInTwoPI + Tachometer.TwoPI; // Convert to positive angle
            }
            return angleInTwoPI;
        }

        // Determine whether the targetAngle is in the visinity of baseAngle
        // Visinity is defined by thresholdAngle. Angles must be in radians
        private isInVicinity(baseAngle: number, targetAngle: number, thresholdAngle: number): boolean {
            var base: number = this.convertToTwoPIScale(baseAngle);
            var target: number = this.convertToTwoPIScale(targetAngle);
            var threshold: number = Math.abs(this.convertToTwoPIScale(thresholdAngle));

            if (base + threshold > target) {
                if (base - threshold < target) {
                    return true;
                }
                else if (base + threshold - Tachometer.TwoPI > target) {
                    //Overflow case
                    return true;
                }
            }
            return false;
        }

        private updateTargetText(viewModel: TachometerViewModel, axisLabels: TachometerAxisLabel[]) {
            var axis = viewModel.axis;
            var target = axis.target;
            var targetValue = target.value;
            var baseOffserX = axis.offset.x;
            var baseOffsetY = axis.offset.y;
            var radius = axis.radius;

            var targetAngle: number = this.axisScale(targetValue);
            //Is the target on left side or right side of verticle?
            var onRightSide: boolean = Math.sin(targetAngle) > 0;

            var padding = this.gaugeStyle.labels.padding;
            var anchor = onRightSide ? 'start' : 'end';
            var formatter = this.getFormatter(axis.dataLabels, targetValue);

            var deltaAngle = Math.asin(Tachometer.MinDistanceFromTicks / radius) * (target.fontSize / dataLabelUtils.minLabelFontSize);

            var altTargetAngle = targetAngle;
            var tickCount = axisLabels.length;

            for (var count = 0; count < tickCount; count++) {
                var axisLabel: TachometerAxisLabel = axisLabels[count];
                if (this.isInVicinity(axisLabel.angle, targetAngle, deltaAngle)) {
                    var tickAngle = axisLabel.angle;
                    if (tickAngle > targetAngle) {
                        altTargetAngle = axisLabel.angle - deltaAngle;
                    }
                    else {
                        altTargetAngle = axisLabel.angle + deltaAngle;
                    }
                    break;
                }
            }
            var targetX = baseOffserX + (radius + padding) * Math.sin(altTargetAngle);
            var targetY = baseOffsetY - (radius + padding) * Math.cos(altTargetAngle);

            if (!this.targetText) {
                this.targetText = this.mainGraphicsContext
                    .append('text')
                    .classed(Tachometer.TargetText.class, true);
            }

            this.targetText
                .attr({
                    'x': targetX,
                    'y': targetY,
                })
                .style({
                    'fill': target.textColor,
                    'text-anchor': anchor,
                    'display': this.showTargetLabel ? '' : 'none',
                    'font-size': target.fontSizePx
                })
                .text(formatter.format(targetValue));

            this.truncateTextIfNeeded(this.targetText, targetX, onRightSide);
            this.targetText.call(tooltipUtils.tooltipUpdate, [formatter.format(targetValue)]);

            if (!this.targetConnector && this.showTargetLabel) {
                this.targetConnector = this.mainGraphicsContext
                    .append('line')
                    .classed(Tachometer.TargetConnector.class, true);
            }

            // Hide the target connector if the text is going to align with the target line in the arc
            // It should only be shown if the target text is displaced (ex. when the target is very close to start/end)
            if (targetAngle === altTargetAngle) {
                this.targetConnector.style('display', 'none');
            }
            else {
                this.targetConnector
                    .attr({
                        'x1': baseOffserX + radius * Math.sin(targetAngle),
                        'y1': baseOffsetY - radius * Math.cos(targetAngle),
                        'x2': targetX,
                        'y2': targetY
                    })
                    .style({
                        'stroke-width': target.thickness,
                        'stroke': target.lineColor,
                        'display': ''
                    });
            }
        }

        private static PiBy4 = Math.PI / 4;
        private static ThreePiBy4 = Math.PI * 3 / 4;
        private static MinusPiBy4 = - Math.PI / 4;
        private static MinusThreePiBy4 = - Math.PI * 3 / 4;

        private defineMargins(): IMargin {
            if (this.tachometerSmallViewPortProperties) {
                if (this.tachometerSmallViewPortProperties.smallTachometerMarginsOnSmallViewPort && (this.currentViewport.height < this.tachometerSmallViewPortProperties.MinHeightTachometerSideNumbersVisible)) {
                    var margins = this.tachometerSmallViewPortProperties.TachometerMarginsOnSmallViewPort;
                    var margin = { top: margins, bottom: margins, left: margins, right: margins };
                    return margin;
                }
            }

            var margin = {
                top: Tachometer.DefaultMarginSettings.top,
                bottom: Tachometer.DefaultMarginSettings.bottom,
                left: Tachometer.DefaultMarginSettings.left,
                right: Tachometer.DefaultMarginSettings.right
            };

            var targetMargin = {
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
            };

            var labelMargin = {
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
            };

            // If we're not labels, reduce the margin so that the tachometer has more room to display
            if (!this.showLabelText() && (!this.showTargetLabel)) {
                margin.left = margin.right = Tachometer.ReducedLeftRightMargin;
            }
            else {
                var axisData = this.axisData;
                var dataLabels: TachometerDataLabelsData = this.viewModel && this.viewModel.axis ? this.viewModel.axis.dataLabels : null;

                if (this.showTargetLabel) {
                    var targetFontSize = PixelConverter.fromPointToPixel(axisData.target.fontSize - NewDataLabelUtils.DefaultLabelFontSizeInPt);
                    if (targetFontSize > 0) {
                        var targetFontLength = dataLabels.formatter.format(axisData.target.value).length / 2;

                        // If we're showing the target label, only reduce the margin on the side that doesn't have a target label
                        var targetAngle = this.axisScale(axisData.target.value);

                        if (targetAngle >= Tachometer.MinusPiBy4 && targetAngle < Tachometer.PiBy4) { //closer to top
                            targetMargin.top = margin.top + targetFontSize;
                            targetMargin.left = targetMargin.right = Tachometer.ReducedLeftRightMargin;
                        }
                        else if (targetAngle >= Tachometer.PiBy4 && targetAngle < Tachometer.ThreePiBy4) {//closer to right
                            targetMargin.right = margin.right + targetFontSize * targetFontLength;
                        }
                        else if (targetAngle >= Tachometer.MinusThreePiBy4 && targetAngle < Tachometer.MinusPiBy4) {//closer to left
                            targetMargin.left = margin.left + targetFontSize * targetFontLength;
                        }
                        else {//closer to bottom
                            targetMargin.bottom = margin.bottom + targetFontSize;
                            targetMargin.left = targetMargin.right = Tachometer.ReducedLeftRightMargin;
                        }
                    }
                }

                var labelFontSize = 0;
                var labelFontLength = 0;
                if (dataLabels && dataLabels.show
                    && dataLabels.fontSize
                    && dataLabels.fontSize >= NewDataLabelUtils.DefaultLabelFontSizeInPt) {
                    labelFontSize = PixelConverter.fromPointToPixel(dataLabels.fontSize - NewDataLabelUtils.DefaultLabelFontSizeInPt);
                    labelFontLength = Math.max(dataLabels.formatter.format(this.axisData.startValue).length, dataLabels.formatter.format(this.axisData.endValue).length) / 2;
                }

                labelMargin.top = margin.top + labelFontSize;
                labelMargin.bottom = margin.bottom + labelFontSize;
                labelMargin.left = margin.left + labelFontSize * labelFontLength;
                labelMargin.right = margin.right + labelFontSize * labelFontLength;

                margin.top = labelMargin.top > targetMargin.top ? labelMargin.top : targetMargin.top;
                margin.bottom = labelMargin.bottom > targetMargin.bottom ? labelMargin.bottom : targetMargin.bottom;
                margin.left = labelMargin.left > targetMargin.left ? labelMargin.left : targetMargin.left;
                margin.right = labelMargin.right > targetMargin.right ? labelMargin.right : targetMargin.right;
            }
            return margin;
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

        /*
        * Return which quadrant the angle is in
        * Angle can be between negative infinity to positive infinity
        */
        private getQuadrant(angle: number): number {
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

        /*
        * Get arcRadius and translation Data depending on start angle, endAngle of the arc and the height and
        * width of the frame in which to draw the arc.
        * Assumptions:
        * 1. Arc is drawn clockwise from startAngle to endAngle and should be centered in the frame.
        * 2. startAngle and endAngle are in radians and can be positive or negative.
        * 3. startAngle and endAngle canbe negative infinity to positive infinity.
        * 4. startAngle can be larger or smaller or equal to endAngle. 
        */
        private calculateTranslation(startAngle: number, endAngle: number, height: number, width: number
        ): TachometerTranslationSettings {
            var radius: number;
            var startQuadrant: number = this.getQuadrant(startAngle);
            var endQuadrant: number = this.getQuadrant(endAngle);
            var xOffset: number; //translation along x axis
            var yOffset: number; //translation along y axis
            var arcHeight: number; //height of the arc along y axis
            var arcWidth: number; //width of the arc along x axis
            var calloutyOffset: number; //Y offset of callout

            var sinAlpha: number = Math.abs(Math.sin(startAngle));
            var sinBeta: number = Math.abs(Math.sin(endAngle));
            var cosAlpha: number = Math.abs(Math.cos(startAngle));
            var cosBeta: number = Math.abs(Math.cos(endAngle));

            switch (startQuadrant) {
                case 1:
                    switch (endQuadrant) {
                        case 1:
                            if (cosAlpha > cosBeta) {
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
                            debug.assertFailFunction('DEBUG: Unhandled startAngle and endAngle scenario.');
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
                            if (cosAlpha < cosBeta) {
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
                            debug.assertFailFunction('DEBUG: Unhandled startAngle and endAngle scenario.');
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
                            if (cosAlpha > cosBeta) {
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
                            debug.assertFailFunction('DEBUG: Unhandled startAngle and endAngle scenario.');
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
                            if (cosAlpha < cosBeta) {
                                radius = Math.min(width / sinAlpha, height / cosBeta);
                                arcHeight = radius * cosBeta;
                                arcWidth = radius * sinAlpha;
                                xOffset = width > arcWidth ? (width + arcWidth) / 2 : width;
                                yOffset = height > arcHeight ? (height + arcHeight) / 2 : height;
                                calloutyOffset = yOffset + radius;
                            }
                            else {
                                radius = Math.min(width / 2, height / 2);
                                xOffset = width / 2;
                                yOffset = height / 2;
                                calloutyOffset = yOffset;
                            }
                            break;
                        default: //this should not be reached
                            debug.assertFailFunction('DEBUG: Unhandled startAngle and endAngle scenario.');
                            break;
                    }
                    break;
                default: //this should not be reached
                    debug.assertFailFunction('DEBUG: Unhandled startAngle and endAngle scenario.');
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
    }
}