declare module powerbi.extensibility.utils.tooltip {
    interface TooltipEventArgs<TData> {
        data: TData;
        coordinates: number[];
        elementCoordinates: number[];
        context: HTMLElement;
        isTouchEvent: boolean;
    }
    interface ITooltipServiceWrapper {
        addTooltip<T>(selection: d3.Selection<any>, getTooltipInfoDelegate: (args: TooltipEventArgs<T>) => VisualTooltipDataItem[], getDataPointIdentity?: (args: TooltipEventArgs<T>) => ISelectionId, reloadTooltipDataOnMouseMove?: boolean): void;
        hide(): void;
    }
    interface TooltipEnabledDataPoint {
        tooltipInfo?: VisualTooltipDataItem[];
    }
}
declare module powerbi.extensibility.utils.tooltip.touch {
    function touchStartEventName(): string;
    function touchEndEventName(): string;
    function usePointerEvents(): boolean;
}
declare module powerbi.extensibility.utils.tooltip {
    import ISelectionId = powerbi.visuals.ISelectionId;
    import ITooltipService = powerbi.extensibility.ITooltipService;
    import VisualTooltipDataItem = powerbi.extensibility.VisualTooltipDataItem;
    function createTooltipServiceWrapper(tooltipService: ITooltipService, rootElement: Element, handleTouchDelay?: number): ITooltipServiceWrapper;
    class TooltipServiceWrapper implements ITooltipServiceWrapper {
        private handleTouchTimeoutId;
        private visualHostTooltipService;
        private rootElement;
        private handleTouchDelay;
        constructor(tooltipService: ITooltipService, rootElement: Element, handleTouchDelay?: number);
        addTooltip<T>(selection: d3.Selection<any>, getTooltipInfoDelegate: (args: TooltipEventArgs<T>) => VisualTooltipDataItem[], getDataPointIdentity?: (args: TooltipEventArgs<T>) => ISelectionId, reloadTooltipDataOnMouseMove?: boolean): void;
        private getSelectionIds<T>(tooltipEventArgs, getDataPointIdentity);
        hide(): void;
        private makeTooltipEventArgs<T>(rootNode, isPointerEvent, isTouchEvent);
        private canDisplayTooltip(d3Event);
        private getCoordinates(rootNode, isPointerEvent);
    }
}
