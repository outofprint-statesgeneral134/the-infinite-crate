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

import React from 'react';
import {Div} from '@/layout/geometry';
import MagentaUrl from '%/magenta.png';

import {cn, GEMINI_SAMPLE_RATE} from '@/lib/utils';
import {useTransportStore, TransportState, useDawStore, DawState} from '@/data';

const loadWidth = 151;

const Visualizer: React.FC = () => {
  const playing = useTransportStore((state: TransportState) => state.playing);
  const buffering = useTransportStore((state: TransportState) => state.buffering);

  const playhead = useDawStore((state: DawState) => state.playhead);

  return (
    <Div className={imageContainer}>
      <Div className={cn(spinContainer, playing && !buffering ? spinningContainer : '')}>
        <Div className={disc1}>
          <Div className={disc2}>
            <Div className={disc3}>
              <img src={MagentaUrl} className={magentaContainer} draggable="false" />
            </Div>
          </Div>
        </Div>
      </Div>
      {/* The Lyria model updates prompts and params every ~2-4 seconds */}
        <Div className={loadContainer}>
          <Div className={loadBarContainer} style={
              {
                '--width': `${(playhead%(GEMINI_SAMPLE_RATE*2))/(GEMINI_SAMPLE_RATE*2)*(loadWidth * 0.95)}px`,
              } as React.CSSProperties
            }></Div>
        </Div>
    </Div>
  );
};

const imageContainer = 'relative mt-[50px] ml-[12px] w-full h-full';
const disc1 = 'rounded-full bg-secondary border-[20px] border-primary/2';
const disc2 = 'rounded-full bg-secondary border-[10px] border-card';
const disc3 = 'rounded-full border-[10px] border-progress/2';
const magentaContainer = 'grayscale-[1.0] scale-[0.75]';
const spinContainer = 'absolute w-[300px] -ml-[5px] -mt-[41px] rounded-full border-[50px] border-card bg-background';
const spinningContainer = 'animate-spin [animation-duration:_5s]';

const loadContainer = `absolute w-[${loadWidth}px] ml-[958px] -mt-[368px] border-[1px] border-background rounded-[3px] h-[5px]`;
const loadBarContainer = 'h-full w-[var(--width)] bg-progress/75 rounded-[4px]';

export {Visualizer};
