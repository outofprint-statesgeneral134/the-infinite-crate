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

import {FXState, useFXStore} from '@/data';
import {fx} from '@/data/params';
import {Slider, Label, TooltipAtom} from '@/components/ui';
import {Flex} from '@/layout/geometry';

const InputGainSlider: React.FC = () => {
  const inputGain = useFXStore((state: FXState) => state.inputGain);
  const updateInputGain = useFXStore((state: FXState) => state.updateInputGain);

  const inputMute = useFXStore((state: FXState) => state.inputMute);

  const handleChange = (newValue: number[]) => {
    updateInputGain(newValue[0]);
  };

  return (
    <TooltipAtom tooltip={fx.inputGain.tooltip!}>
      <Flex direction="row" gap="xs">
        <Label size="xs" direction="row">{`${fx.inputGain.name}`}</Label>
        <Slider
          className={sliderContainer}
          value={inputMute ? [0] : [inputGain]}
          min={fx.inputGain.range[0]}
          max={fx.inputGain.range[1]}
          step={fx.inputGain.step}
          onValueChange={handleChange}
          disabled={inputMute}
        />
      </Flex>
    </TooltipAtom>
  );
};

const sliderContainer = 'w-20 mb-0';

export {InputGainSlider};
