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

import {Card, TooltipAtom} from '@/components/ui';
import {Flex} from '@/layout/geometry';
import {PromptInput, Prompt} from '@/components/lyria/prompts';
import {usePromptStore} from '@/data/state/state';
import {ComponentProps} from '@/data/types';

const Prompts: React.FC<ComponentProps> = ({className}) => {
  const prompts = usePromptStore(state => state.prompts);

  return (
    <Flex direction="col" gap="md" justify="between" className={className}>
      <TooltipAtom
        tooltip={
          'Prompts influence the model to generate audio. The weight slider controls the influence of each prompt relative to others. X removes the prompt.'
        }
      >
        <Card className={listContainer}>
          {prompts &&
            prompts.map((prompt, index) => (
              <Prompt key={prompt.id} promptID={prompt.id} index={index} />
            ))}
        </Card>
      </TooltipAtom>
      <PromptInput />
      {/* <Flex direction="row" gap="md" justify="center">
        <Button
          variant="outline"
          size="sm"
          className={buttonContainer}
          onClick={handleSurpriseMe}
        >
          surprise me!
        </Button>
      </Flex> */}
    </Flex>
  );
};

const listContainer = 'h-subcontent w-full p-4 overflow-y-auto';

export {Prompts};
