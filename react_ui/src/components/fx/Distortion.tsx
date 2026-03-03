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

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui';
import * as fx from '@/data/params/fx';
import {FXState} from '@/data';
import {useFXStore} from '@/data';

const DistortionSelect: React.FC = () => {
  const distortionType = useFXStore((state: FXState) => state.distortionType);
  const updateDistortionType = useFXStore(
    (state: FXState) => state.updateDistortionType,
  );

  const handleSelectChange = (newOption: string) => {
    updateDistortionType(newOption);
  };

  return (
    <>
      <Select onValueChange={handleSelectChange} defaultValue={distortionType}>
        <SelectTrigger>
          <SelectValue placeholder="Distortion Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {fx.distortionType.choices.map(choice => (
              <SelectItem key={choice} value={choice}>
                {choice}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </>
  );
};

export {DistortionSelect};
