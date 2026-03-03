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

import {useLyriaStore, LyriaState} from '@/data';
import {lyria} from '@/data/params';
import {Knob, TooltipAtom} from '@/components/ui';
import {Flex} from '@/layout/geometry';

const DensitySlider: React.FC = () => {
  const density = useLyriaStore((state: LyriaState) => state.density);
  const useDensity = useLyriaStore((state: LyriaState) => state.useDensity);
  const updateParam = useLyriaStore((state: LyriaState) => state.updateParam);

  const handleChange = (newValue: number) => {
    updateParam({density: newValue});
  };

  const handleToggle = (newValue: boolean) => {
    updateParam({useDensity: newValue});
  };

  return (
    <TooltipAtom tooltip={lyria.density.tooltip!}>
      <Flex direction="row" justify="center">
        <Knob
          value={useDensity ? density || 0 : 0}
          label={`${lyria.density.name}`}
          min={lyria.density.range[0]}
          max={lyria.density.range[1]}
          step={lyria.density.step}
          disabled={!useDensity}
          onChange={handleChange}
          hasSwitch={true}
          handleSwitch={handleToggle}
        />
        {/* <Switch
          checked={useDensity}
          orientation="vertical"
          onCheckedChange={handleToggle}
        /> */}
      </Flex>
    </TooltipAtom>
  );
};

export {DensitySlider};
