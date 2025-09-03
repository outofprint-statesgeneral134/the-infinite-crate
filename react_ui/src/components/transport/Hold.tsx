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

import {TransportState, useTransportStore} from '@/data';
import {UpdateIcon, ArrowRightIcon} from '@radix-ui/react-icons';
import {Toggle, TooltipAtom} from '@/components/ui';

const HoldToggle: React.FC = () => {
  const hold = useTransportStore((state: TransportState) => state.hold);
  const toggleHold = useTransportStore(
    (state: TransportState) => state.toggleHold,
  );

  const holdIcon = <UpdateIcon />;
  const releaseIcon = <ArrowRightIcon />;
  const holdLabel = 'HOLD';
  const releaseLabel = 'RELEASE';

  return (
    <TooltipAtom tooltip="Preserve the most recent idea with slight variation. Record audio into the DAW if you want a precise loop.">
      <Toggle
        pressed={hold}
        onPressedChange={toggleHold}
        variant="outline"
        className={transportButton}
      >
        {hold ? releaseLabel : holdLabel}
        {hold ? releaseIcon : holdIcon}
      </Toggle>
    </TooltipAtom>
  );
};

const transportButton = 'w-[150px] h-[60px] items-center text-lg font-thin';

export {HoldToggle};
