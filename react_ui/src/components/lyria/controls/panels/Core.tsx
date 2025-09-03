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
import {Flex, Grid, Div} from '@/layout/geometry';
import {TabProps} from '@/layout/views';

import {
  TopKSlider,
  GuidanceSlider,
  TemperatureSlider,
  DensitySlider,
  BrightnessSlider,
  MutesToggleGroup,
} from '@/components/lyria/controls';
// import {ChaosVisualizer} from '@/components/lyria/visualizers';

const CorePanel: React.FC & TabProps = () => {
  return (
    <Flex justify="between" width="full" className={panelContainer}>
      {/* <ChaosVisualizer /> */}
      <Grid cols={2} gap="lg" width="full">
        <TopKSlider />
        <TemperatureSlider />

        {/* <Div /> */}
        <DensitySlider />
        <BrightnessSlider />
      </Grid>
      <Div className={mutesContainer}>
        <MutesToggleGroup />
      </Div>
      <GuidanceSlider />
    </Flex>
  );
};
CorePanel.id = 'core';
CorePanel.label = 'Controls';

const panelContainer = 'mt-3';
const mutesContainer = 'mt-6 mb-4';

export {CorePanel};
