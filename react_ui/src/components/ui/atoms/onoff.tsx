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

import * as React from 'react';
import * as TogglePrimitive from '@radix-ui/react-toggle';

import {cn} from '@/lib/utils';

const OnOffSwitch = React.forwardRef<
  React.ElementRef<typeof TogglePrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root>
>(({className, pressed, ...props}, ref) => (
  <TogglePrimitive.Root
    ref={ref}
    className={cn(pressed ? onOffContainerOn : onOffContainer, className)}
    defaultPressed={pressed}
    {...props}
  />
));

OnOffSwitch.displayName = TogglePrimitive.Root.displayName;

const onOffContainer = `
  absolute -top-2 -left-2 w-18 h-18 rounded-full border-[6px] 
  border-primary opacity-25 rotate-[45deg]`;

const onOffContainerOn = `
  absolute -top-2 -left-2 w-18 h-18 rounded-full border-[6px] 
  border-primary rotate-[45deg]`;

export {OnOffSwitch};
