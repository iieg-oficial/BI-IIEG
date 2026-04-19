declare module 'react-grid-layout' {
  import type { Component, RefObject } from 'react';

  export interface Layout {
    i: string;
    x: number;
    y: number;
    w: number;
    h: number;
    minW?: number;
    maxW?: number;
    minH?: number;
    maxH?: number;
    static?: boolean;
    isDraggable?: boolean;
    isResizable?: boolean;
  }

  export interface ReactGridLayoutProps {
    className?: string;
    layout?: Layout[];
    cols?: number;
    rowHeight?: number;
    width: number;
    isDraggable?: boolean;
    isResizable?: boolean;
    draggableCancel?: string;
    draggableHandle?: string;
    margin?: [number, number];
    onLayoutChange?: (layout: Layout[]) => void;
    children?: React.ReactNode;
  }

  export interface UseContainerWidthOptions {
    measureBeforeMount?: boolean;
    initialWidth?: number;
  }

  export interface UseContainerWidthResult {
    containerRef: RefObject<HTMLDivElement | null>;
    width: number;
    mounted: boolean;
  }

  export function useContainerWidth(
    options?: UseContainerWidthOptions,
  ): UseContainerWidthResult;

  export default class GridLayout extends Component<ReactGridLayoutProps> {}
}
