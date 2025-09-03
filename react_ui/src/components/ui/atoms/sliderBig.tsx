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
import * as SliderPrimitive from '@radix-ui/react-slider';

import {cn} from '@/lib/utils';
import {SliderProps} from '@/components/ui/shadcn/slider';

const SliderBig = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> & SliderProps
>(({className, color, ...props}, ref) => (
  <SliderPrimitive.Root ref={ref} className={cn(root, className)} {...props}>
    <SliderPrimitive.Track className={track}>
      <SliderPrimitive.Range style={colorStyle(color)} className={range} />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb style={colorStyle(color)} className={thumb} />
  </SliderPrimitive.Root>
));
SliderBig.displayName = SliderPrimitive.Root.displayName;

const colorStyle = (color?: string) => {
  if (!color) return {};
  return {background: `hsl(var(--${color}))`};
};

const root = 'relative flex w-full touch-none select-none items-center';
const track =
  'relative h-8 w-full grow overflow-hidden rounded-full bg-secondary';
const range = 'absolute h-full rounded-full';
const thumb =
  'block h-10 w-10 rounded-full border border-border bg-primary shadow shadow-border transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50';

export {SliderBig};
