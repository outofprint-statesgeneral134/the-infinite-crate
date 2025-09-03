/**
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {useState, useEffect, useCallback, useRef, PointerEvent} from 'react';

import {cn} from '@/lib/utils';
import {OnOffSwitch} from './onoff';

interface KnobProps {
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  decimals?: number;
  disabled?: boolean;
  hasSwitch?: boolean;
  handleSwitch?: (value: boolean) => void;
  onChange: (value: number) => void;
}

const KNOB_ANGLE_RANGE = 270;
const KNOB_ANGLE_OFFSET = KNOB_ANGLE_RANGE / 2;
const DRAG_SENSITIVITY = 100;

function valueToAngle(value: number, min: number, max: number): number {
  const ratio = (value - min) / (max - min);
  return ratio * KNOB_ANGLE_RANGE - KNOB_ANGLE_OFFSET;
}

const Knob: React.FC<KnobProps> = ({
  label,
  min,
  max,
  step,
  value,
  decimals = 2,
  disabled = false,
  hasSwitch = false,
  handleSwitch,
  onChange,
}) => {
  const initialAngle = valueToAngle(value, min, max);
  const currentY = useRef<number | undefined>(undefined);
  const deltaY = useRef<number>(0);
  const [angle, setAngle] = useState<number>(initialAngle);

  // Start dragging
  function handlePointerDown(e: PointerEvent<HTMLDivElement>) {
    if (disabled) return;

    currentY.current = e.clientY;

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  }

  const handlePointerMove = useCallback(
    (e: globalThis.PointerEvent) => {
      if (currentY.current === undefined) return;
      const newY = e.clientY;
      deltaY.current = deltaY.current + newY - currentY.current;

      const valueRange = max - min;
      const deltaRatio = -deltaY.current / DRAG_SENSITIVITY;
      const valueChange = deltaRatio * valueRange;
      const rawNewValue = value + valueChange;
      const steppedValue = Math.round((rawNewValue - min) / step) * step + min;
      const finalValue = Math.min(max, Math.max(min, steppedValue));

      if (finalValue !== value) {
        onChange(finalValue);
      }
      currentY.current = newY;
    },
    [currentY, min, max, step, value, onChange], // Dependencies for useCallback
  );

  // Stop dragging (using useCallback for stable reference in listeners)
  const handlePointerUp = useCallback(
    () => {
      currentY.current = undefined;
      deltaY.current = 0;

      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    },
    [handlePointerMove], // handlePointerMove is a dependency
  );

  // Effect to synchronize angle state when value prop changes externally
  useEffect(() => {
    setAngle(valueToAngle(value, min, max));
  }, [value, min, max]);

  return (
    <div className={container}>
      <div className={outerWrapper}>
        {hasSwitch && (
          <OnOffSwitch pressed={!disabled} onPressedChange={handleSwitch} />
        )}

        <div onPointerDown={handlePointerDown} className={backgroundArc} />
        <div
          className={progressArc}
          onPointerDown={handlePointerDown}
          style={
            {
              '--a': `${disabled ? 0 : angle + KNOB_ANGLE_OFFSET}deg`,
              // '--color': 'var(--background)',
              opacity: value > min ? 1 : 0,
            } as React.CSSProperties
          }
        />

        <div onPointerDown={handlePointerDown} className={ring} />

        {/* Knob */}
        <div
          className={knob}
          onPointerDown={handlePointerDown}
          style={
            {
              '--knob-angle': `${disabled ? -KNOB_ANGLE_OFFSET : angle}deg`,
            } as React.CSSProperties
          }
        >
          <div className={dot} />
        </div>
      </div>

      <div className={textContainer}>
        <div className={cn(labelContainer, disabled && labelDisabled)}>
          {label}
        </div>
        <div className={cn(valueContainer, disabled && valueDisabled)}>
          {disabled ? 'off' : value.toFixed(decimals)}
        </div>
      </div>
    </div>
  );
};

const container = `flex flex-col items-center`;
const outerWrapper = `relative w-20 h-20`;

const backgroundArc = `
  arc absolute inset-0 bg-secondary`;

const progressArc = `
  arc-progress absolute inset-0 bg-progress`;

const ring = `
  absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
  w-14 h-14 rounded-full border-[3px] shadow-sm flex items-center 
  justify-center knob transform`;
const knob = `
  absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
  w-10 h-10 bg-muted rounded-full border-[1px] shadow-lg 
  shadow-offset-x-10 shadow-offset-y-10 flex items-center 
  justify-center knob transform rotate-[var(--knob-angle)]`;
const dot = `
  absolute w-[2px] h-1/5 bg-primary rounded-full origin-bottom 
  left-1/2 -translate-x-1/2 bottom-[60%]`;

const textContainer = `text-center space-y-1`;
const labelContainer = `font-medium text-sm`;
const valueContainer = `text-xs text-muted-foreground`;
const labelDisabled = `opacity-25`;
const valueDisabled = `opacity-50`;

// const knobHandle = `
//   relative flex items-center justify-center
//   w-14 h-14 rounded-full border-[1px] border-muted-foreground
//   bg-secondary active:cursor-grabbing cursor-pointer`;

// const knobPointer = `
//   absolute bg-muted-foreground
//   w-[3px] h-1/3 rounded-full
//   origin-bottom left-1/2 -translate-x-1/2 bottom-[50%]`;

export {Knob};
