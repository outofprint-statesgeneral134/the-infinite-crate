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

import React, {useState} from 'react';
import {TabProps} from '@/layout/views';
import {Flex} from '@/layout/geometry';
import {Button, Card, Textarea} from '@/components/ui';

const ChatView: React.FC & TabProps = () => {
  const [chatInput, setChatInput] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setChatInput(e.target.value);
    e.target.style.height = '2.5rem'; // Reset the height
    e.target.style.height = `${Math.min(e.target.scrollHeight, 80)}px`; // Set it to the scroll height
  };

  const handleSubmit = () => {
    setChatInput('');
  };

  return (
    <Flex direction="col" gap="md" justify="between">
      <Card className={chatContainer}></Card>
      <Flex
        direction="row"
        gap="md"
        justify="center"
        className={chatInputContainer}
      >
        <Textarea
          value={chatInput}
          placeholder="Ask Gemini"
          onChange={handleInputChange}
          className={textareaContainer}
        />
        <Button onClick={handleSubmit}>send</Button>
      </Flex>
    </Flex>
  );
};
ChatView.id = 'chat';
ChatView.label = 'Chat';

const chatContainer = 'h-subcontent w-[550px] overflow-y-auto';
const chatInputContainer = 'w-full px-1';
const textareaContainer = 'resize-none overflow-hidden h-10 min-h-10';

export {ChatView};
