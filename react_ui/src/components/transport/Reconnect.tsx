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

import {LightningBoltIcon} from '@radix-ui/react-icons';
import {Button, TooltipAtom} from '@/components/ui';
import {reconnectGemini} from '@/data/state/bridge';

const ReconnectButton: React.FC = () => {
  const resetIcon = <LightningBoltIcon />;
  const resetLabel = 'HALP';

  return (
    <TooltipAtom tooltip="Reconnect to the model">
      <Button
        onClick={() => reconnectGemini()}
        variant="outline"
        size="sm"
        className={transportButton}
      >
        {resetLabel}
        {resetIcon}
      </Button>
    </TooltipAtom>
  );
};

const transportButton = 'w-[150px] h-[60px] items-center text-lg font-thin';

export {ReconnectButton};
