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

const OutputGainSlider: React.FC = () => {
  const outputGain = useFXStore((state: FXState) => state.outputGain);
  const updateOutputGain = useFXStore(
    (state: FXState) => state.updateOutputGain,
  );

  const outputMute = useFXStore((state: FXState) => state.outputMute);

  const handleChange = (newValue: number[]) => {
    updateOutputGain(newValue[0]);
  };

  return (
    <TooltipAtom tooltip={fx.outputGain.tooltip!}>
      <Flex direction="row" gap="xs">
        <Label size="xs" direction="row">{`volume`}</Label>
        <Slider
          className={sliderContainer}
          value={outputMute ? [0] : [outputGain]}
          min={fx.outputGain.range[0]}
          max={fx.outputGain.range[1]}
          step={fx.outputGain.step}
          onValueChange={handleChange}
          disabled={outputMute}
        />
      </Flex>
    </TooltipAtom>
  );
};

const sliderContainer = 'w-20 mb-0';

export {OutputGainSlider};
