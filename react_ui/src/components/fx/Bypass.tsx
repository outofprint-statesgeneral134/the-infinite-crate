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

import {FXState, useFXStore} from '@/data';
import {fx} from '@/data/params';
import {Toggle} from '@/components/ui';

const BypassToggle: React.FC = () => {
  const bypass = useFXStore((state: FXState) => state.bypass);
  const updateBypass = useFXStore((state: FXState) => state.updateBypass);

  const handleToggleChange = (value: boolean) => {
    updateBypass(value);
  };

  return (
    <Toggle
      pressed={bypass}
      onPressedChange={handleToggleChange}
      variant="outline"
      size="sm"
    >
      {fx.bypass.name}
    </Toggle>
  );
};

export {BypassToggle};
