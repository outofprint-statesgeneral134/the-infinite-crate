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
import {Knob, TooltipAtom} from '@/components/ui';
import {Flex} from '@/layout/geometry';

const BrightnessSlider: React.FC = () => {
  const brightness = useLyriaStore((state: LyriaState) => state.brightness);
  const useBrightness = useLyriaStore((state: LyriaState) => state.useBrightness);
  const updateParam = useLyriaStore((state: LyriaState) => state.updateParam);

  const handleChange = (newValue: number) => {
    updateParam({brightness: newValue});
  };

  const handleToggle = (newValue: boolean) => {
    console.log('newValue');
    console.log(newValue);
    updateParam({useBrightness: newValue});
  };

  return (
    <TooltipAtom tooltip={lyria.brightness.tooltip!}>
      <Flex direction="row" justify="center">
        <Knob
          value={useBrightness ? brightness || 0 : 0}
          label={`${lyria.brightness.name}`}
          min={lyria.brightness.range[0]}
          max={lyria.brightness.range[1]}
          step={lyria.brightness.step}
          disabled={!useBrightness}
          onChange={handleChange}
          hasSwitch={true}
          handleSwitch={handleToggle}
        />
        {/* <Switch
          checked={useBrightness}
          orientation={'vertical'}
          onCheckedChange={handleToggle}
        /> */}
      </Flex>
    </TooltipAtom>
  );
};

export {BrightnessSlider};
