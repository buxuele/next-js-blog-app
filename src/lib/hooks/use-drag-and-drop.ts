import * as React from 'react';
import { DragItem, DropResult } from '@/lib/types';

export interface UseDragAndDropOptions {
  onReorder?: (dragIndex: number, hoverIndex: number) => void;
  onDrop?: (result: DropResult) => void;
}

export interface UseDragAndDropReturn {
  draggedItem: DragItem | null;
  isDragging: boolean;
  dragPreview: React.RefObject<HTMLDivElement>;
  handleDragStart: (e: React.DragEvent, item: DragItem) => void;
  handleDragEnd: () => void;
  handleDragOver: (e: React.DragEvent) => void;
  handleDrop: (e: React.DragEvent, targetIndex: number) => void;
  getDragProps: (item: DragItem) => {
    draggable: boolean;
    onDragStart: (e: React.DragEvent) => void;
    onDragEnd: () => void;
    className: string;
  };
  getDropProps: (index: number) => {
    onDragOver: (e: React.DragEvent) => void;
    onDrop: (e: React.DragEvent) => void;
    className: string;
  };
}

export function useDragAndDrop(
  options: UseDragAndDropOptions = {}
): UseDragAndDropReturn {
  const { onReorder, onDrop } = options;

  const [draggedItem, setDraggedItem] = React.useState<DragItem | null>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const dragPreview = React.useRef<HTMLDivElement>(null);

  // 处理拖拽开始
  const handleDragStart = React.useCallback(
    (e: React.DragEvent, item: DragItem) => {
      setDraggedItem(item);
      setIsDragging(true);

      // 设置拖拽数据
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('application/json', JSON.stringify(item));

      // 设置拖拽图像
      if (dragPreview.current) {
        e.dataTransfer.setDragImage(dragPreview.current, 0, 0);
      }
    },
    []
  );

  // 处理拖拽结束
  const handleDragEnd = React.useCallback(() => {
    setDraggedItem(null);
    setIsDragging(false);
  }, []);

  // 处理拖拽悬停
  const handleDragOver = React.useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  // 处理放置
  const handleDrop = React.useCallback(
    (e: React.DragEvent, targetIndex: number) => {
      e.preventDefault();

      try {
        const dragData = e.dataTransfer.getData('application/json');
        const draggedItem = JSON.parse(dragData) as DragItem;

        if (draggedItem.index === targetIndex) {
          return;
        }

        const result: DropResult = {
          dragIndex: draggedItem.index,
          hoverIndex: targetIndex,
        };

        // 调用回调函数
        onReorder?.(draggedItem.index, targetIndex);
        onDrop?.(result);
      } catch (error) {
        console.error('拖拽放置失败:', error);
      } finally {
        handleDragEnd();
      }
    },
    [onReorder, onDrop, handleDragEnd]
  );

  // 获取拖拽属性
  const getDragProps = React.useCallback(
    (item: DragItem) => ({
      draggable: true,
      onDragStart: (e: React.DragEvent) => handleDragStart(e, item),
      onDragEnd: handleDragEnd,
      className:
        draggedItem?.id === item.id
          ? 'opacity-50 cursor-grabbing'
          : 'cursor-grab',
    }),
    [draggedItem, handleDragStart, handleDragEnd]
  );

  // 获取放置属性
  const getDropProps = React.useCallback(
    (index: number) => ({
      onDragOver: handleDragOver,
      onDrop: (e: React.DragEvent) => handleDrop(e, index),
      className: isDragging ? 'border-dashed border-2 border-primary/50' : '',
    }),
    [isDragging, handleDragOver, handleDrop]
  );

  return {
    draggedItem,
    isDragging,
    dragPreview,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDrop,
    getDragProps,
    getDropProps,
  };
}
