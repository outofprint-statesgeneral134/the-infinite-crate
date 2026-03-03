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

import React, {useState, useEffect} from 'react';
import {Card} from '@/components/ui';
import {Flex} from '@/layout/geometry';
import {BPMSlider, GenerationModeSelect, ScaleToggleGroup} from '@/components/lyria/controls';
import {Visualizer} from '@/components/inspo';
import {Div} from '@/layout/geometry';
import {useDawStore} from '@/data';
import {GEMINI_SAMPLE_RATE} from '@/lib/utils';

const MusicalPanel: React.FC = () => {
  const sampleRate = useDawStore(state => state.sampleRate);
  const [is48khz, setIs48khz] = useState(true);

  useEffect(() => {
    console.log('sampleRate', sampleRate);
    if (sampleRate % GEMINI_SAMPLE_RATE >= 1) {
      setIs48khz(false);
    } else {
      setIs48khz(true);
    }
  }, [sampleRate]);

  return (
    <Flex>
      <Card className={cardContainer}>
        <Flex direction="col" justify="between">
          <Flex className={controlsContainer} direction="row" justify="between">
            <BPMSlider />
            <ScaleToggleGroup />
          </Flex>
          <Visualizer />
          <GenerationModeSelect />
        </Flex> 
      </Card>
      {!is48khz && (
        <Div className={warningContainer}>
          Please set DAW sample rate to 48kHz
        </Div>
      )}
    </Flex>
  );
};


const controlsContainer = 'mt-[15px] z-10';
const cardContainer = 'pt-6 pb-12 px-5 flex h-[540px] w-full';
const warningContainer = 'mt-[15px] ml-[10px] mr-[10px] text-center text-sm bg-progress opacity-90 font-medium text-card rounded py-[10px]';

export {MusicalPanel};
