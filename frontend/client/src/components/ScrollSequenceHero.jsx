import React, { useEffect, useRef, useState } from 'react';
import { useScroll, useTransform, useMotionValueEvent } from 'framer-motion';

const FRAME_COUNT = 192;

export default function ScrollSequenceHero({ externalRef }) {
  const [loadedCount, setLoadedCount] = useState(0);
  const [isFirstFrameDrawn, setIsFirstFrameDrawn] = useState(false);
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const imagesRef = useRef([]);
  const currentFrameIndexRef = useRef(0);

  // Preload images into memory
  useEffect(() => {
    let loaded = 0;
    const imageSequence = [];

    const handleLoad = () => {
      loaded++;
      setLoadedCount(loaded);
    };

    for (let i = 1; i <= FRAME_COUNT; i++) {
      const img = new Image();

      // 1. Changed padding to 5 to match "00001"
      // 2. Removed the "frame_" prefix
      const frameNumber = i.toString().padStart(5, '0');

      // 3. Changed extension to .jpg and updated folder path
      img.src = `/hero_sequence/${frameNumber}.jpg`;

      img.onload = handleLoad;
      img.onerror = () => {
        console.warn(`404: Could not find image at ${img.src}`);
        handleLoad();
      };
      imageSequence.push(img);
    }

    imagesRef.current = imageSequence;

    // Cleanup logic to prevent any memory leaks from floating handlers
    return () => {
      imageSequence.forEach((img) => {
        img.onload = null;
        img.onerror = null;
      });
    };
  }, []);

  // Drawing Function utilizing Object-Cover logic
  const drawFrame = (index) => {
    if (!canvasRef.current || !imagesRef.current[index]) return;
    const canvas = canvasRef.current;

    // Fast path: context retrieval without alpha channel for performance
    const ctx = canvas.getContext("2d", { alpha: false });
    const img = imagesRef.current[index];

    // Basic sanity check ensuring image is actually loadable
    if (!img.complete || img.naturalWidth === 0) return;

    const canvasW = canvas.width;
    const canvasH = canvas.height;
    const imgW = img.width;
    const imgH = img.height;

    // Simulate Object-Cover mapped to exact canvas logical pixels
    const scale = Math.max(canvasW / imgW, canvasH / imgH);
    const w = imgW * scale;
    const h = imgH * scale;

    const x = (canvasW - w) / 2;
    const y = (canvasH - h) / 2;

    // Fill solid bg to match design guidelines
    ctx.fillStyle = '#edeaf5';
    ctx.fillRect(0, 0, canvasW, canvasH);
    ctx.drawImage(img, x, y, w, h);

    // Sync ref after complete draw to prevent redundant render loop
    currentFrameIndexRef.current = index;
  };

  // Canvas context scaling and the "Initial Frame Fix"
  useEffect(() => {
    // Only set dimensions and force a paint when all images are successfully cached
    if (loadedCount === FRAME_COUNT) {
      const resizeCanvas = () => {
        if (canvasRef.current && canvasRef.current.parentElement) {
          const canvas = canvasRef.current;
          const parent = canvas.parentElement;

          // Apply window.devicePixelRatio scaling for crisp rendering on Retina screens
          const pixelRatio = window.devicePixelRatio || 1;
          const width = parent.clientWidth;
          const height = parent.clientHeight;

          canvas.width = width * pixelRatio;
          canvas.height = height * pixelRatio;

          // CSS boundaries remain locked to the parent's layout box
          canvas.style.width = width + "px";
          canvas.style.height = height + "px";

          // Command frame draw
          drawFrame(currentFrameIndexRef.current);
          setIsFirstFrameDrawn(true);
        }
      };

      resizeCanvas();

      window.addEventListener("resize", resizeCanvas);
      return () => window.removeEventListener("resize", resizeCanvas);
    }
  }, [loadedCount]);

  // Framer Motion mappings
  // Use external target (TopBanner) if provided, otherwise fallback to local
  const { scrollYProgress } = useScroll({
    target: externalRef || containerRef,
    offset: ["start start", "end end"]
  });

  // Map progress evenly across discrete bounds
  const frameIndex = useTransform(scrollYProgress, [0, 1], [0, FRAME_COUNT - 1]);

  useMotionValueEvent(frameIndex, "change", (latest) => {
    // Floor and tightly bound the index to prevent undefined images
    const idx = Math.max(0, Math.min(FRAME_COUNT - 1, Math.floor(latest)));

    // Prevent sending redundant commands to context
    if (idx !== currentFrameIndexRef.current) {
      if (loadedCount === FRAME_COUNT) {
        drawFrame(idx);
      }
    }
  });

  const percent = Math.floor((loadedCount / FRAME_COUNT) * 100);
  const isLoading = loadedCount < FRAME_COUNT;

  return (
    <div ref={containerRef} className="relative w-full h-full bg-[#edeaf5]">
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-black">
          <span className="text-2xl font-semibold tracking-widest uppercase">
            Loading Model
          </span>
          <span className="text-xl mt-2">{percent}%</span>
        </div>
      )}

      {/* The canvas target - fill parent h-full established by TopBanner flexbox */}
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 block pointer-events-none z-0 transition-opacity duration-700 w-full h-full object-cover ${isFirstFrameDrawn ? 'opacity-100' : 'opacity-0'
          }`}
      />
    </div>
  );
}
