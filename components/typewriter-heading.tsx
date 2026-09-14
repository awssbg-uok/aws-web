"use client";

import React, { useState, useEffect } from "react";

const FULL_TEXT = "if learning: build_with_aws()";

export default function TypewriterHeading() {
  const [charCount, setCharCount] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const [showCursor, setShowCursor] = useState(true);

  // Type out character-by-character on page load (once, non-looping)
  useEffect(() => {
    const typeInterval = setInterval(() => {
      setCharCount((prev) => {
        if (prev < FULL_TEXT.length) {
          return prev + 1;
        } else {
          clearInterval(typeInterval);
          setIsDone(true);
          return prev;
        }
      });
    }, 55);

    return () => clearInterval(typeInterval);
  }, []);

  // Blinking cursor after typing finishes
  useEffect(() => {
    if (!isDone) return;

    const blinkInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 530);

    return () => clearInterval(blinkInterval);
  }, [isDone]);

  const displayedText = FULL_TEXT.slice(0, charCount);
  const ifPart = displayedText.slice(0, 2);
  const restPart = displayedText.slice(2);

  return (
    <div
      role="text"
      aria-label={FULL_TEXT}
      className="relative inline-flex items-center px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.08] font-ember-mono text-xs sm:text-sm font-medium w-fit select-none"
    >
      {/* Reserved Layout Ghost: Prevents width/height layout shift while typing */}
      <span className="invisible pointer-events-none flex items-center" aria-hidden="true">
        <span>{FULL_TEXT}</span>
        <span className="inline-block w-[2px] h-[1.15em] ml-1 bg-transparent" />
      </span>

      {/* Rendered Animated Typing Layer */}
      <div className="absolute inset-0 px-3 py-1.5 flex items-center" aria-hidden="true">
        <span className="text-[#AD5CFF] font-semibold">{ifPart}</span>
        <span className="text-[#e2e8f0]">{restPart}</span>
        <span
          className={`inline-block w-[2px] h-[1.15em] ml-1 bg-[#AD5CFF] transition-opacity duration-100 ${
            !isDone || showCursor ? "opacity-100" : "opacity-0"
          }`}
        />
      </div>
    </div>
  );
}
