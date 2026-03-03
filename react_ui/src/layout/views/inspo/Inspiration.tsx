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

import React, {useEffect} from 'react';
import {Card} from '@/components/ui';
import {TabProps} from '@/layout/views';
import {useFXStore, FXState} from '@/data';

const InspirationView: React.FC & TabProps = () => {
  const leftBuffer = useFXStore((state: FXState) => state.leftBuffer);
  const rightBuffer = useFXStore((state: FXState) => state.rightBuffer);
  const length = useFXStore((state: FXState) => state.length);

  // TODO: maybe visualize the prompts themselves?
  // const prompts = usePromptStore((state: PromptState) => state.prompts);

  useEffect(() => {
    console.log(leftBuffer, rightBuffer, length);
  }, [leftBuffer, rightBuffer, length]);

  return <Card className={cardContainer}></Card>;
};

InspirationView.id = 'inspo';
InspirationView.label = 'Inspiration';

const cardContainer = 'h-paddedcontent w-[1000px] overflow-y-auto px-8 py-6';

export {InspirationView};
