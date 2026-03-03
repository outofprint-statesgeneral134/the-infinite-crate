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

import React from 'react';
import {Controls, Prompts} from '@/components/lyria';
import {Flex, Grid} from '@/layout/geometry';
import {TabProps} from '@/layout/views';
import {MusicalPanel} from '@/components/lyria/controls/panels';

const LyriaView: React.FC & TabProps = () => {
  return (
    <Flex gap="lg" className={container}>
      <Grid cols="1-2-1" gap="ml" className={container}>
        <MusicalPanel />
        <Prompts />
        <Controls />
      </Grid>
    </Flex>
  );
};
LyriaView.id = 'lyria';
LyriaView.label = 'Prompts';

const container = 'mt-0';

export {LyriaView};
