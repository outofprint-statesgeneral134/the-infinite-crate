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

import {cn} from '@/lib/utils';
import {GeometryProps} from '@/data/types';
import {Div} from './index';
import {cva, VariantProps} from 'class-variance-authority';

const gridVariants = cva('grid gap-5', {
  variants: {
    cols: {
      2: 'grid-cols-2',
      3: 'grid-cols-3',
      6: 'grid-cols-6',
      '2-1': 'grid-cols-[2fr_1fr]',
      '2-1-1': 'grid-cols-[2fr_1fr_1fr]',
      '1-2-1': 'grid-cols-[1fr_2fr_1fr]',
    },
    gap: {
      sm: 'gap-2',
      md: 'gap-5',
      ml: 'gap-7',
      lg: 'gap-10',
    },
    width: {
      full: 'w-full',
      default: undefined,
    },
  },
  defaultVariants: {
    cols: 2,
    gap: 'sm',
    width: 'default',
  },
});

type GridVariants = VariantProps<typeof gridVariants>;

const Grid: React.FC<GeometryProps & GridVariants> = ({
  children,
  className,
  cols,
  gap,
  width,
}) => {
  return (
    <Div className={cn(gridVariants({cols, gap, width}), className)}>
      {children}
    </Div>
  );
};

export {Grid};
