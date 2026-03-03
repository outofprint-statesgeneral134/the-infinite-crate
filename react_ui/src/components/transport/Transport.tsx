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

import {Flex} from '@/layout/geometry';
import {PlayButton, ResetButton} from '@/components/transport';
import {Label} from '@radix-ui/react-label';
import {useTransportStore, TransportState} from '@/data';
import {cn} from '@/lib/utils';

const Transport: React.FC = () => {
  const connected = useTransportStore(
    (state: TransportState) => state.connected,
  );
  return (
    <Flex className={container} direction="row" gap="xs">
      <PlayButton />
      <ResetButton />
      <Label className={cn(connectedLabel, !connected && disconnectedLabel)}>
        {connected ? 'Lyria online' : 'Lyria offline'}
      </Label>
      {/* <ReconnectButton /> */}
      {/* <HoldToggle /> */}
    </Flex>
  );
};

const container = 'ml-[60px]';
const connectedLabel = 'w-[150px] text-vinyl-4 text-center font-medium mt-1';
const disconnectedLabel = 'text-vinyl-7';

export {Transport};
