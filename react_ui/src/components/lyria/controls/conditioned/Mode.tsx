/**
 * Copyright 2026 Google LLC
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

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  TooltipAtom,
  Label,
} from '@/components/ui';
import {Div, Flex} from '@/layout/geometry';
import * as lyria from '@/data/params/lyria';
import {LyriaState, useLyriaStore} from '@/data';

const GenerationModeSelect: React.FC = () => {
  const mode = useLyriaStore((state: LyriaState) => state.generationMode);
  const updateMode = useLyriaStore((state: LyriaState) => state.updateParam);

  const handleSelectChange = (newOption: string) => {
    updateMode({generationMode: newOption});
  };

  return (
    <Div className={container}>
      <TooltipAtom tooltip={lyria.generationMode.tooltip!}>
        <Flex justify="center" gap="xs" className={flexContainer}>
          <Flex direction="row" justify="center" gap="xs">
            <Label size="sm" className={labelContainer}>
              generation mode
            </Label>
            <Select onValueChange={handleSelectChange} defaultValue={mode}>
              <SelectTrigger className={selectContainer}>
                <SelectValue placeholder="Generation Mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {lyria.generationMode.choices.map(choice => (
                    <SelectItem key={choice} value={choice}>
                      {choice}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </Flex>
        </Flex>
      </TooltipAtom>
    </Div>
  );
};

const container = 'mt-[235px]';
const flexContainer = 'mb-0 ml-1 w-[320px]';
const selectContainer = 'ml-3 w-[160px] z-10';
const labelContainer = 'mt-[2px] z-10';

export {GenerationModeSelect};