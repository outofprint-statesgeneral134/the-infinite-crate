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

import {useLyriaStore, LyriaState} from '@/data';
import {lyria} from '@/data/params';
import {
  Label,
  ToggleGroup,
  ToggleGroupItem,
  TooltipAtom,
  OnOffSwitch,
} from '@/components/ui';
import {Flex, Div} from '@/layout/geometry';
import {
  getNoteName,
  getNoteNumber,
  MAJOR_FIFTHS,
  MINOR_FIFTHS,
  cn,
} from '@/lib/utils';

const ScaleToggleGroup: React.FC = () => {
  const rootNote = useLyriaStore((state: LyriaState) => state.rootNote || 0);
  const scaleMode = useLyriaStore((state: LyriaState) => state.scaleMode);
  const majorScale = useLyriaStore((state: LyriaState) => state.majorScale);

  const updateParam = useLyriaStore((state: LyriaState) => state.updateParam);

  const isOff = scaleMode === lyria.scaleMode.choices[0];
  const isControls = scaleMode === lyria.scaleMode.choices[1];

  const handleOnOffToggle = (newValue: boolean) => {
    updateParam({
      scaleMode: newValue ? lyria.scaleMode.choices[1] : lyria.scaleMode.choices[0],
    });
  };

  const handleRootNoteChange = (newValue: string) => {
    console.log(newValue);
    // Update both rootNote and mode based on the number it returns. Need a mapping
    updateParam({rootNote: getNoteNumber(newValue)});
    console.log(getNoteNumber(newValue));
  };

  return (
    <TooltipAtom tooltip={lyria.scaleMode.tooltip!}>
      <Flex>
        <Div className={container}>
          <OnOffSwitch
            className={onOffContainer}
            pressed={!isOff}
            onPressedChange={handleOnOffToggle}
          />
          <Label
            className={cn(keyLabel, isOff && keyLabelDisabled)}
          >{`KEY`}</Label>
          <ToggleGroup
            type="single"
            defaultValue={getNoteName(rootNote, majorScale || true)}
            onValueChange={handleRootNoteChange}
            disabled={!isControls}
            className={notesContainer}
          >
            {MAJOR_FIFTHS.map((note, key) => {
              const {finalLeft, finalTop} = majorNotePosition(key);
              return (
                <ToggleGroupItem
                  className={cn(noteContainer, majorNoteContainer)}
                  style={{
                    top: `${finalTop.toFixed(0)}px`,
                    left: `${finalLeft.toFixed(0)}px`,
                  }}
                  key={key}
                  value={note}
                >
                  {note}
                </ToggleGroupItem>
              );
            })}
            {MINOR_FIFTHS.map((note, key) => {
              const {finalLeft, finalTop} = minorNotePosition(key);
              return (
                <ToggleGroupItem
                  className={cn(noteContainer, minorNoteContainer)}
                  style={{
                    top: `${finalTop.toFixed(0)}px`,
                    left: `${finalLeft.toFixed(0)}px`,
                  }}
                  key={key}
                  value={note}
                >
                  {note}
                </ToggleGroupItem>
              );
            })}
          </ToggleGroup>
        </Div>
        {/* <Flex direction="row" width="full" justify="between">
          <Label>{`${lyria.scaleMode.name}: ${isControls ? getScaleName(rootNote, mode) : scaleMode}`}</Label>
          <ToggleGroup
            type="single"
            value={scaleMode}
            onValueChange={handleScaleToggle}
          >
            {lyria.scaleMode.choices.map((choice, key) => (
              <ToggleGroupItem key={key} value={choice}>
                {choice}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </Flex>
        <ToggleGroup
          type="single"
          defaultValue={getNoteName(rootNote)}
          onValueChange={handleRootNoteChange}
          disabled={!isControls}
          className={notesContainer}
        >
          <Grid cols={6} gap="sm">
            {NOTE_NAMES.map((note, key) => (
              <ToggleGroupItem key={key} value={note}>
                {note}
              </ToggleGroupItem>
            ))}
          </Grid>
        </ToggleGroup> */}
        {/* <ToggleGroup
          type="single"
          defaultValue={getModeName(mode)}
          onValueChange={handleModeChange}
          disabled={!isControls}
          className={modeContainer}
        >
          {MODE_NAMES.map((modeName, key) => (
            <ToggleGroupItem key={key} value={modeName}>
              {modeName}
            </ToggleGroupItem>
          ))}
        </ToggleGroup> */}
      </Flex>
    </TooltipAtom>
  );
};

const container = `
  flex flex-col items-center h-[150px] w-[150px] mb-4
  ml-[0px] rounded-full`;

const onOffContainer = `absolute left-[210px] top-[235px] border-[4px]`;

const keyLabel = `absolute text-[12px] font-black text-primary left-[273px] top-[303px]`;
const keyLabelDisabled = `opacity-20`;

const notesContainer = 'absolute left-[200px] top-[232px]';

const majorNoteContainer = 'z-10';
const minorNoteContainer = '';
const noteContainer = `absolute text-[12px] min-w-[20px] w-[20px] min-h-[20px] h-[20px] 
  data-[state=on]:bg-progress data-[state=on]:text-card data-[state=on]:border-[2px] 
  data-[state=on]:border-progress data-[state=on]:padding-[10px] data-[disabled]:opacity-20`;

const majorNotePosition = (
  index: number,
  radius: number = 75,
  totalItems: number = 12,
) => {
  const angle = (index / totalItems) * 2 * Math.PI - Math.PI / 2;
  const x = radius * Math.cos(angle);
  const y = radius * Math.sin(angle);
  const finalLeft = radius + x;
  const finalTop = radius + y;
  return {
    finalLeft,
    finalTop,
  };
};

const minorNotePosition = (
  index: number,
  radius: number = 50,
  totalItems: number = 12,
  leftOffset: number = 25,
  topOffset: number = 24,
) => {
  const angle = (index / totalItems) * 2 * Math.PI - Math.PI / 2;
  const x = radius * Math.cos(angle);
  const y = radius * Math.sin(angle);
  const finalLeft = radius + x + leftOffset;
  const finalTop = radius + y + topOffset;
  return {
    finalLeft,
    finalTop,
  };
};

export {ScaleToggleGroup};
