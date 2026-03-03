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
import {Flex} from '@/layout/geometry';
import {TabProps} from '@/layout/views';

import {
  GuidanceSlider,
} from '@/components/lyria/controls';

const AdvancedPanel: React.FC & TabProps = () => {
  return (
    <Flex justify="between" width="full" gap="lg" className={panelContainer}>
      <GuidanceSlider />
    </Flex>
  );
};
AdvancedPanel.id = 'advanced';
AdvancedPanel.label = 'Advanced';

const panelContainer = 'items-start';

export {AdvancedPanel};
