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

import {useState, useRef} from 'react';
import {Textarea, Button} from '@/components/ui';
import {Flex} from '@/layout/geometry';
import {usePromptStore} from '@/data';
import {getRandomPromptText} from '@/lib/utils';
import {PlusCircledIcon, LoopIcon} from '@radix-ui/react-icons';

const PromptInput: React.FC = () => {
  const [chatInput, setChatInput] = useState('');
  const addTextPrompt = usePromptStore(state => state.addTextPrompt);

  const handleSurpriseMe = () => {
    addTextPrompt(getRandomPromptText());
  };

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setChatInput(e.target.value);
    e.target.style.height = '2.5rem'; // Reset the height
    e.target.style.height = `${Math.min(e.target.scrollHeight, 80)}px`; // Set it to the scroll height
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if (chatInput.trim() === '') return;
    addTextPrompt(chatInput);
    setChatInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = '2.5rem';
    }
  };

  return (
    <Flex
      direction="row"
      gap="md"
      justify="center"
      className={chatInputContainer}
    >
      <Textarea
        value={chatInput}
        placeholder="Describe your VIBE!"
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        className={textareaContainer}
        ref={textareaRef}
      />
      <Button variant="outline" className={addContainer} onClick={handleSubmit}>
        add
        <PlusCircledIcon />
      </Button>
      <Button
        variant="outline"
        className={buttonContainer}
        onClick={handleSurpriseMe}
      >
        random
        <LoopIcon />
      </Button>
    </Flex>
  );
};

const chatInputContainer = 'w-full px-1';
const textareaContainer = 'resize-none overflow-hidden h-12 min-h-12';
const buttonContainer = 'w-[120px] h-12 items-center font-md';
const addContainer = 'w-[100px] h-12 items-center font-md';

export {PromptInput};
