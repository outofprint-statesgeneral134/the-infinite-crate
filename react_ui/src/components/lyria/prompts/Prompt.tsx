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

import {usePromptStore} from '@/data';
import {Label, SliderBig, Toggle, Button} from '@/components/ui';
import {Flex} from '@/layout/geometry';
import {Prompt as PromptType} from '@/data/types';
import {
  CrossCircledIcon,
  SpeakerLoudIcon,
  SpeakerOffIcon,
} from '@radix-ui/react-icons';

export interface PromptProps {
  promptID: PromptType['id'];
  index: number;
}

const Prompt: React.FC<PromptProps> = ({promptID, index}) => {
  const prompt = usePromptStore(state => state.getPromptWithID(promptID));
  const updatePrompt = usePromptStore(state => state.updatePromptWithID);
  const removePrompt = usePromptStore(state => state.removePromptWithID);

  const handleWeightChange = (value: number[]) => {
    updatePrompt(promptID, {...prompt!, weight: value[0]});
  };

  const handleMuteChange = (value: boolean) => {
    updatePrompt(promptID, {...prompt!, muted: value});
  };

  const handleRemove = () => {
    removePrompt(promptID);
  };

  return (
    <Flex direction="row" justify="center" gap="sm" className={promptContainer}>
      <Label className={labelContainer}>
        {`#${index + 1} |  ${prompt?.text}`}
      </Label>
      <Flex direction="row" gap="sm">
        <SliderBig
          value={[prompt?.muted ? 0 : (prompt?.weight ?? 0)]}
          min={0}
          max={2}
          step={0.1}
          onValueChange={handleWeightChange}
          color={colorName(index)}
          className={sliderContainer}
        />
        <Toggle
          size="sm"
          variant="outline"
          pressed={prompt?.muted}
          onPressedChange={handleMuteChange}
          className={buttonContainer}
        >
          {prompt?.muted ? <SpeakerOffIcon /> : <SpeakerLoudIcon />}
        </Toggle>
        <Button
          className={buttonContainer}
          size="sm"
          variant="outline"
          onClick={handleRemove}
        >
          <CrossCircledIcon />
        </Button>
      </Flex>
    </Flex>
  );
};

const colorName = (index: number) => `vinyl-${index % 10}`;
const buttonContainer = 'px-5 py-5';
const labelContainer =
  'w-[330px] word-wrap mb-1 text-xl font-medium select-text';
const promptContainer = 'pl-6 pr-0 py-4';
const sliderContainer = 'w-48 mb-0 mr-3';

export {Prompt};
