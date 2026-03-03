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

import {Label, Button} from '@/components/ui';
import {Flex} from '@/layout/geometry';
import {usePromptStore} from '@/data/state/state';
import {ComponentProps} from '@/data/types';
import {useToast} from '@/lib/utils';
interface SuggestedListProps extends ComponentProps {
  category: string;
  prompts: string[];
}

const SuggestedList: React.FC<SuggestedListProps> = ({
  className,
  category,
  prompts,
}) => {
  const addTextPrompt = usePromptStore(state => state.addTextPrompt);
  const {toast} = useToast();
  const handleAddPrompt = (prompt: string) => {
    addTextPrompt(prompt);
    toast({
      description: `${prompt} added`,
    });
  };

  return (
    <Flex direction="col" gap="sm" justify="between" className={className}>
      <Label size="xs" weight="bold">
        {category}
      </Label>
      {prompts.map((prompt, index) => (
        <Flex direction="row" gap="sm" justify="start" key={index}>
          <Button
            variant="outline"
            size="default"
            onClick={() => handleAddPrompt(prompt)}
            className={buttonContainer}
          >
            <Label size="md" weight="bold" className={labelContainer}>
              +
            </Label>
            {/* <PlusIcon size={4} /> */}
          </Button>
          <Label size="xs" className={labelContainer}>
            {prompt}
          </Label>
        </Flex>
      ))}
    </Flex>
  );
};

const buttonContainer = 'w-[24px] h-[24px] rounded-[12px] py-0 px-0 mt-0';
const labelContainer = 'mb-0 px-0 mx-0 my-0';

export {SuggestedList, type SuggestedListProps};
