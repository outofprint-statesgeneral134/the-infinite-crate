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

import {useState, useRef, useCallback, PointerEvent} from 'react';
import {useLyriaStore, LyriaState} from '@/data';
import {lyria} from '@/data/params';
import {Label, TooltipAtom, OnOffSwitch, Toggle} from '@/components/ui';
import {Flex, Div} from '@/layout/geometry';
import {cn} from '@/lib/utils';

const DRAG_SENSITIVITY = 2000;

const BPMSlider: React.FC = () => {
  const bpm = useLyriaStore((state: LyriaState) => state.bpm);
  const bpmMode = useLyriaStore((state: LyriaState) => state.bpmMode);
  const updateParam = useLyriaStore((state: LyriaState) => state.updateParam);

  const [isOff, setIsOff] = useState(bpmMode === lyria.bpmMode.choices[0]);
  const [isControls, setIsControls] = useState(
    bpmMode === lyria.bpmMode.choices[1],
  );
  const [isDAW, setIsDAW] = useState(bpmMode === lyria.bpmMode.choices[2]);

  const currentY = useRef<number | undefined>(undefined);
  const deltaY = useRef<number>(0);
  const min = lyria.bpm.range[0];
  const max = lyria.bpm.range[1];
  const step = lyria.bpm.step;

  // Start dragging
  function handlePointerDown(e: PointerEvent<HTMLDivElement>) {
    if (!isControls) return;

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
      const rawNewValue = bpm + valueChange;
      const steppedValue = Math.round((rawNewValue - min) / step) * step + min;
      const finalValue = Math.min(max, Math.max(min, steppedValue));

      if (finalValue !== bpm) {
        updateParam({bpm: finalValue});
      }
      currentY.current = newY;
    },
    [currentY, min, max, step, bpm, updateParam], // Dependencies for useCallback
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

  const handleDAWToggle = (newValue: boolean) => {
    updateParam({
      bpmMode: newValue ? lyria.bpmMode.choices[2] : lyria.bpmMode.choices[1],
    });
    setIsOff(false);
    setIsControls(!newValue);
    setIsDAW(newValue);
  };

  const handleOnOffToggle = (newValue: boolean) => {
    updateParam({
      bpmMode: newValue ? lyria.bpmMode.choices[1] : lyria.bpmMode.choices[0],
    });
    setIsOff(!newValue);
    setIsControls(newValue);
    setIsDAW(false);
  };

  return (
    <TooltipAtom tooltip={lyria.bpmMode.tooltip!}>
      <Flex width="full">
        <Div className={container}>
          <Div className={outerWrapper}>
            <OnOffSwitch
              className={onOffContainer}
              pressed={!isOff}
              onPressedChange={handleOnOffToggle}
            />
            <Flex direction="col" justify="center">
              <Label
                className={cn(bpmLabel, isOff && bpmLabelDisabled)}
              >{`BPM`}</Label>
              <div onPointerDown={handlePointerDown}>
                <Label
                  className={cn(bpmValue, isOff && bpmLabelDisabled)}
                >{`${isOff ? 'off' : isControls ? bpm?.toFixed(1) : 'daw'}`}</Label>
              </div>
              <Toggle
                className={toggleContainer}
                variant="outline"
                size="sm"
                pressed={isDAW}
                onPressedChange={handleDAWToggle}
              >
                {isDAW ? 'SYNC' : 'DRAG'}
              </Toggle>
            </Flex>
          </Div>
        </Div>
      </Flex>
    </TooltipAtom>
  );
};

const container = `ml-[10px]
  flex flex-col items-center h-[170px] w-[100px] bg-progress opacity-90
  rounded-[8px]`;
const outerWrapper = `mt-[58px] relative w-[80px] h-20 flex flex-col items-center justify-center`;

const onOffContainer = `absolute -top-[48px] left-[0px] border-card border-[4px]`;

const toggleContainer = `w-[80px] mt-[12px]`;

const bpmLabel = `text-[12px] font-black text-card mt-2 mr-2`;
const bpmValue = `text-[24px] font-thin text-card mt-0`;
const bpmLabelDisabled = `opacity-25`;

export {BPMSlider};
