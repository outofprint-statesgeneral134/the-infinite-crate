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

import React, {useState} from 'react';
import {Div, Flex} from '@/layout/geometry';
import {Label, Input, Button} from '@/components/ui';
import {useAppStore, AppState} from '@/data';
import {launchAIStudio} from '@/data/state/bridge';
import {cn} from '@/lib/utils';

const LoginView: React.FC = () => {
  const [message] = useState('Enter your Gemini API key');
  const [licenseKey, setLicenseKey] = useState('');
  const setCredentials = useAppStore((state: AppState) => state.setCredentials);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLicenseKey(event.target.value);
  };

  const tokenSubmitted = () => {
    setCredentials({
      api_key: licenseKey,
    });
  };

  const apiClicked = () => {
    launchAIStudio();
  };

  return (
    <Div className={loginContainer}>
      <Flex direction="row" justify="center" gap="lg">
        <Flex>
          <Div className={titleContainer}>
            <Flex direction="row" gap="sm">
              <span className={cn(wordInfinite, fontBorder)}>
                The Infinite Crate
              </span>{' '}
            </Flex>
          </Div>
          <Label className={welcomeContainer}>
            Thanks for joining our experiment in bringing generative <br />{' '}
            music into the DAW. We hope you enjoy :)
          </Label>
          <Label className={footnoteContainer}>
            The Infinite Crate is an experimental alpha prototype built on the
            new Lyria RealTime generative music model in the Gemini API.
          </Label>
        </Flex>
        <Div className={margin}></Div>
        <Flex>
          <Flex className={licenseContainer}>
            <Label>
              <b>Setup 1:</b> Create an API key on AI Studio
            </Label>
            <Button
              onClick={apiClicked}
              className={buttonContainer}
              variant={'outline'}
            >
              Launch AI Studio
            </Button>
          </Flex>
          <Label className={labelContainer}>
            <b>Step 2:</b> {message}
          </Label>
          <Input value={licenseKey} onChange={handleInputChange} />
          <Button onClick={tokenSubmitted} className={buttonContainer}>
            Submit
          </Button>
        </Flex>
        <Div className={margin}></Div>
      </Flex>
    </Div>
  );
};

const titleContainer = 'text-[32px]';
const wordInfinite = 'font-black cursor-default mb-5';
const fontBorder = '';

const welcomeContainer = 'mb-10';
const loginContainer =
  'w-plugin h-content flex justify-center items-center scale-[1.4]';
const labelContainer = 'mb-4';
const licenseContainer = 'mb-16';
const buttonContainer = 'mt-6';
const footnoteContainer = 'text-xs w-[400px]';

const margin = 'mr-6';

export {LoginView};
