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
import {SuggestedList} from '@/components/lyria/prompts';
import {Flex} from '@/layout/geometry';
import {SUGGESTED_PROMPTS} from '@/lib/utils';
import {TabProps} from '@/layout/views';
import {Card} from '@/components/ui';

const SuggestionsView: React.FC & TabProps = () => {
  return (
    <Card className={cardContainer}>
      <Flex direction="row" gap="lg" className={listContainer}>
        {Object.entries(SUGGESTED_PROMPTS).map(([category, prompts]) => (
          <SuggestedList
            key={category}
            category={category as keyof typeof SUGGESTED_PROMPTS}
            prompts={prompts}
          />
        ))}
      </Flex>
    </Card>
  );
};
SuggestionsView.id = 'suggestions';
SuggestionsView.label = 'Suggestions';

const listContainer = 'items-start';
const cardContainer = 'h-paddedcontent w-full overflow-y-auto px-8 py-6';

export {SuggestionsView};
