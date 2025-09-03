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
import {TooltipAtom} from '@/components/ui';
import {Flex, Div} from '@/layout/geometry';

const ChaosVisualizer: React.FC = () => {
  const temperature = useLyriaStore((state: LyriaState) => state.temperature);
  const topk = useLyriaStore((state: LyriaState) => state.topk);

  const numDots = 50; // Number of dots to display
  const minTargetRadius = 15;
  const maxTargetRadius = 50; // Maximum diameter of the target

  const containerSize = 100;

  return (
    <TooltipAtom
      tooltip={`Increasing topk gives a wider radius of possible directions for the model to 
        generate sounds, increasing variety. Increasing temperature makes it more likely for 
        the model to pick sounds that are more divergent from the current sound, staying within 
        the radius of topk.`}
    >
      <Flex className={container(containerSize)} justify="center">
        {/* Target Background */}
        <Div
          className={target}
          style={{
            clipPath: `circle(${
              minTargetRadius +
              (topk / lyria.topk.range[1]) * (maxTargetRadius - minTargetRadius)
            }px at center)`,
          }}
        />

        {/* Dots */}
        {[...Array(numDots)].map((_, index) => {
          // Generate random positions, affected by temperature

          const angle = Math.random() * 2 * Math.PI;
          const maxRadius =
            minTargetRadius +
            (topk / lyria.topk.range[1]) * (maxTargetRadius - minTargetRadius); // Radius based on topk
          const tempEffect = temperature / lyria.temperature.range[1]; // Inverse temperature effect
          const radius = Math.random() * maxRadius * tempEffect; // Closer to center with higher temperature
          const x = radius * Math.cos(angle); // Center the dot
          const y = radius * Math.sin(angle); // Center the dot

          return (
            <Div
              key={index}
              className={dot}
              style={{
                left: `calc(50% + ${x}px)`,
                top: `calc(50% + ${y}px)`,
                transform: 'translate(-50%, -50%)',
              }}
            />
          );
        })}
      </Flex>
    </TooltipAtom>
  );
};

const container = (containerSize: number) =>
  `relative w-full h-[${containerSize}px] mb-8 mt-0`;
const target = 'absolute w-full h-[100px] rounded-full bg-primary';
const dot = 'absolute w-[5px] h-[5px] bg-muted rounded-full';

export {ChaosVisualizer};
