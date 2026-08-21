"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { Brush, Eraser, RotateCcw, Check, Sparkles } from "lucide-react";

interface CanvasMaskProps {
  baseImage: string;
  onMaskChange: (maskBase64: string | null) => void;
  aspectRatio: string;
}

export const CanvasMask: React.FC<CanvasMaskProps> = ({
  baseImage,
  onMaskChange,
  aspectRatio,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushSize, setBrushSize] = useState(30);
  const [tool, setTool] = useState<"brush" | "eraser">("brush");
  const [hasDrawn, setHasDrawn] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  const imageObjRef = useRef<HTMLImageElement | null>(null);

  // Initialize image and canvas
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = baseImage.startsWith("data:")
      ? baseImage
      : `data:image/jpeg;base64,${baseImage}`;

    img.onload = () => {
      imageObjRef.current = img;
      setImgLoaded(true);
      resetCanvas(img);
    };
  }, [baseImage]);

  const resetCanvas = (img?: HTMLImageElement) => {
    const activeImg = img || imageObjRef.current;
    const canvas = canvasRef.current;
    if (!canvas || !activeImg) return;

    // Set canvas internal resolution to match image resolution for crisp mask
    canvas.width = activeImg.naturalWidth || 800;
    canvas.height = activeImg.naturalHeight || 800;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
    onMaskChange(null);
  };

  const getCoordinates = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    let clientX = 0;
    let clientY = 0;

    if ("touches" in e) {
      if (e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      }
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  const startDrawing = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    setIsDrawing(true);
    setHasDrawn(true);

    const { x, y } = getCoordinates(e);

    ctx.beginPath();
    ctx.moveTo(x, y);
    draw(e);
  };

  const draw = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    if (!isDrawing) return;
    e.preventDefault();

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { x, y } = getCoordinates(e);

    ctx.lineWidth = brushSize * (canvas.width / 500); // Scale brush relative to resolution
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    if (tool === "eraser") {
      ctx.globalCompositeOperation = "destination-out";
    } else {
      ctx.globalCompositeOperation = "source-over";
      // Visually rendered as bright amber with glow
      ctx.fillStyle = "rgba(245, 158, 11, 0.75)";
      ctx.strokeStyle = "rgba(245, 158, 11, 0.75)";
    }

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.beginPath();

    // Export binary mask for API (white on black or transparent PNG)
    exportMask(canvas);
  };

  const exportMask = (sourceCanvas: HTMLCanvasElement) => {
    // Create an offscreen canvas to generate pure black/white mask for AI inpainting
    const maskCanvas = document.createElement("canvas");
    maskCanvas.width = sourceCanvas.width;
    maskCanvas.height = sourceCanvas.height;
    const maskCtx = maskCanvas.getContext("2d");
    if (!maskCtx) return;

    // Fill black
    maskCtx.fillStyle = "#000000";
    maskCtx.fillRect(0, 0, maskCanvas.width, maskCanvas.height);

    // Draw source canvas with white overlay where painted
    maskCtx.globalCompositeOperation = "source-over";
    // Convert alpha from source to pure white
    const sourceCtx = sourceCanvas.getContext("2d");
    if (!sourceCtx) return;

    const imgData = sourceCtx.getImageData(0, 0, sourceCanvas.width, sourceCanvas.height);
    const maskImgData = maskCtx.createImageData(sourceCanvas.width, sourceCanvas.height);

    for (let i = 0; i < imgData.data.length; i += 4) {
      const alpha = imgData.data[i + 3];
      if (alpha > 20) {
        maskImgData.data[i] = 255;     // R
        maskImgData.data[i + 1] = 255; // G
        maskImgData.data[i + 2] = 255; // B
        maskImgData.data[i + 3] = 255; // A
      } else {
        maskImgData.data[i] = 0;
        maskImgData.data[i + 1] = 0;
        maskImgData.data[i + 2] = 0;
        maskImgData.data[i + 3] = 255;
      }
    }

    maskCtx.putImageData(maskImgData, 0, 0);
    const maskBase64 = maskCanvas.toDataURL("image/png");
    onMaskChange(maskBase64);
  };

  const handleClear = () => {
    resetCanvas();
  };

  return (
    <div className="flex flex-col gap-3 w-full" ref={containerRef}>
      {/* Canvas Tool Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-xl bg-zinc-950/80 border border-zinc-800 text-xs">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setTool("brush")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
              tool === "brush"
                ? "bg-amber-500 text-zinc-950 font-semibold shadow-sm"
                : "text-zinc-400 hover:text-zinc-200 bg-zinc-900"
            }`}
          >
            <Brush className="w-3.5 h-3.5" />
            <span>Paint Inpaint Mask</span>
          </button>

          <button
            type="button"
            onClick={() => setTool("eraser")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
              tool === "eraser"
                ? "bg-amber-500 text-zinc-950 font-semibold shadow-sm"
                : "text-zinc-400 hover:text-zinc-200 bg-zinc-900"
            }`}
          >
            <Eraser className="w-3.5 h-3.5" />
            <span>Eraser</span>
          </button>

          <button
            type="button"
            onClick={handleClear}
            className="flex items-center gap-1 px-2.5 py-1.5 text-zinc-400 hover:text-rose-300 bg-zinc-900 rounded-lg transition-colors"
            title="Clear Inpaint Mask"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
        </div>

        {/* Brush Size Slider */}
        <div className="flex items-center gap-2 flex-1 sm:flex-initial min-w-[150px]">
          <span className="text-[11px] text-zinc-400 font-mono">Size:</span>
          <input
            type="range"
            min="10"
            max="80"
            value={brushSize}
            onChange={(e) => setBrushSize(Number(e.target.value))}
            className="w-full accent-amber-500 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
          />
          <span className="text-[11px] font-mono text-amber-400 w-6">
            {brushSize}
          </span>
        </div>
      </div>

      {/* Canvas Viewport Overlay */}
      <div className="relative w-full rounded-xl overflow-hidden bg-zinc-950 border border-zinc-800 flex items-center justify-center select-none touch-none">
        {/* Base Image */}
        <img
          src={
            baseImage.startsWith("data:")
              ? baseImage
              : `data:image/jpeg;base64,${baseImage}`
          }
          alt="Base reference for inpainting"
          className="w-full h-auto max-h-[500px] object-contain pointer-events-none"
        />

        {/* Mask Drawing Canvas */}
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="absolute inset-0 w-full h-full cursor-crosshair touch-none"
        />

        {/* Instruction Badge */}
        {!hasDrawn && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 pointer-events-none px-3 py-1.5 rounded-lg bg-black/80 text-zinc-200 text-xs border border-white/10 backdrop-blur-md flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Use finger or mouse to paint the inpaint modification area</span>
          </div>
        )}
      </div>
    </div>
  );
};
