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
import {Slider, TooltipAtom, Label} from '@/components/ui';
import {Flex} from '@/layout/geometry';

const GuidanceSlider: React.FC = () => {
  const guidance = useLyriaStore((state: LyriaState) => state.guidance);
  const updateParam = useLyriaStore((state: LyriaState) => state.updateParam);

  const handleChange = (newValue: number[]) => {
    updateParam({guidance: newValue[0]});
  };

  return (
    <TooltipAtom tooltip={lyria.guidance.tooltip!}>
      <Flex className={container}>
        <Slider
          value={[guidance]}
          min={lyria.guidance.range[0]}
          max={lyria.guidance.range[1]}
          step={lyria.guidance.step}
          //color={colorName}
          onValueChange={handleChange}
        />
        <Flex direction="row" justify="between">
          <Label className={valueContainer}>context</Label>
          <Label className={labelContainer}>{lyria.guidance.name}</Label>
          <Label className={valueContainer}>prompts</Label>
          {/* <Label className={labelContainer}>{lyria.guidance.name}</Label>
          <div className={valueContainer}>{guidance.toFixed(2)}</div> */}
        </Flex>
      </Flex>
    </TooltipAtom>
  );
};

const valueContainer = `text-xs text-muted-foreground -mt-1 mr-[1px]`;
const container = `mt-4`;
const labelContainer = `ml-[1px]`;

export {GuidanceSlider};
