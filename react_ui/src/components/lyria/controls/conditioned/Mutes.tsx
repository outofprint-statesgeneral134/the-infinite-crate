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
import {ToggleGroup, ToggleGroupItem, TooltipAtom} from '@/components/ui';
import {SpeakerLoudIcon, SpeakerOffIcon} from '@radix-ui/react-icons';
import {Div} from '@/layout/geometry';

const MutesToggleGroup: React.FC = () => {
  const muteStates = [
    {
      state: useLyriaStore((state: LyriaState) => state.muteBass),
      param: lyria.muteBass,
    },
    {
      state: useLyriaStore((state: LyriaState) => state.muteDrums),
      param: lyria.muteDrums,
    },
    {
      state: useLyriaStore((state: LyriaState) => state.muteOther),
      param: lyria.muteOther,
    },
    // {
    //   state: useLyriaStore((state: LyriaState) => state.muteVocals),
    //   param: lyria.muteVocals,
    // },
  ];

  const updateParam = useLyriaStore((state: LyriaState) => state.updateParam);

  const getDefaultValue = () =>
    muteStates.filter(({state}) => state).map(({param}) => param.id);

  const handleToggle = (newValues: string[]) => {
    muteStates.forEach(({param}) => {
      updateParam({[param.id]: newValues.includes(param.id)});
    });
  };

  return (
    <ToggleGroup
      type="multiple"
      defaultValue={getDefaultValue()}
      onValueChange={handleToggle}
    >
      {muteStates.map(({state, param}) => (
        <TooltipAtom key={param.id} tooltip={param.tooltip!}>
          <ToggleGroupItem
            variant="outline"
            value={param.id}
            className={itemContainer}
          >
            <Div className={labelContainer}>
              {param.name.replace('mute ', '')}
            </Div>
            {state ? (
              <SpeakerOffIcon className={iconContainer} />
            ) : (
              <SpeakerLoudIcon className={iconContainer} />
            )}
          </ToggleGroupItem>
        </TooltipAtom>
      ))}
    </ToggleGroup>
  );
};

const itemContainer =
  'w-24 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground py-6 px-4 m-2';
const iconContainer = 'font-weight-bold mr-2';
const labelContainer =
  'flex items-center justify-center font-medium text-sm pl-2 py-2';

export {MutesToggleGroup};
