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

const TopKSlider: React.FC = () => {
  const topK = useLyriaStore((state: LyriaState) => state.topk);
  const updateParam = useLyriaStore((state: LyriaState) => state.updateParam);

  const handleChange = (newValue: number) => {
    updateParam({topk: newValue});
  };

  return (
    <TooltipAtom tooltip={lyria.topk.tooltip!}>
      <Flex>
        <Knob
          value={topK}
          label={`${lyria.topk.name}`}
          min={lyria.topk.range[0]}
          max={lyria.topk.range[1]}
          step={lyria.topk.step}
          decimals={0}
          onChange={handleChange}
        />
      </Flex>
    </TooltipAtom>
  );
};

export {TopKSlider};
