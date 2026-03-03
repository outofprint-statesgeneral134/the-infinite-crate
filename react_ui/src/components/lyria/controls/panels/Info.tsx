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
import {Flex, Div} from '@/layout/geometry';
import {TabProps} from '@/layout/views';
import {VERSION} from '@/lib/utils';
import {Button} from '@/components/ui';
import {launchAboutPage, launchFeedbackPage} from '@/data/state/bridge';
import {Link1Icon, Share1Icon} from '@radix-ui/react-icons';

const InfoPanel: React.FC & TabProps = () => {
  return (
    <Flex justify="between" width="full" gap="xs" className={panelContainer}>
      <Div className={titleContainer}>The Infinite Crate</Div>
      <Div className={versionContainer}>Version {VERSION}</Div>
      <Div className={infoContainer}>
        The Infinite Crate is an experimental open source DAW plugin built on the
        Lyria RealTime live music model. <br /> <br />
        Record and sample audio into a second audio track, and use warp and 
        quantize settings to align to grid.
        <br /> <br /> Turn on BPM, key, density, and brightness conditioning
        using the small dots on the top left of each control.
      </Div>
      <Flex className={buttonContainer} direction="row">
        <Button variant="outline" onClick={() => launchAboutPage()}>
          Learn More
          <Link1Icon />
        </Button>
        <Button variant="outline" onClick={() => launchFeedbackPage()}>
          Feedback
          <Share1Icon />
        </Button>
      </Flex>
    </Flex>
  );
};
InfoPanel.id = 'info';
InfoPanel.label = 'About';

const panelContainer = 'items-start';
const titleContainer = 'mt-2 font-bold mb-0';
const versionContainer = 'text-xs mt-0';
const infoContainer = 'mt-4 mb-4';
const buttonContainer = 'mt-2';

export {InfoPanel};
