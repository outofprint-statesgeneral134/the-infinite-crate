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

import {cn} from '@/lib/utils';
import {GeometryProps} from '@/data/types';
import {cva, VariantProps} from 'class-variance-authority';
import {Div} from './index';

const flexVariants = cva('flex gap-2', {
  variants: {
    direction: {
      col: 'flex-col',
      row: 'flex-row items-center',
      'row-start': 'flex-row items-start',
    },
    justify: {
      start: 'justify-start',
      center: 'justify-center',
      between: 'justify-between',
      end: 'justify-end',
    },
    gap: {
      xs: 'gap-1',
      sm: 'gap-2',
      md: 'gap-5',
      lg: 'gap-10',
      xl: 'gap-40',
    },
    width: {
      default: undefined,
      full: 'w-full',
    },
  },
  defaultVariants: {
    direction: 'col',
    gap: 'sm',
    justify: 'start',
    width: 'default',
  },
});

type FlexVariants = VariantProps<typeof flexVariants>;

const Flex: React.FC<GeometryProps & FlexVariants> = ({
  children,
  direction,
  gap,
  justify,
  width,
  className,
}) => {
  return (
    <Div
      className={cn(flexVariants({direction, gap, justify, width}), className)}
    >
      {children}
    </Div>
  );
};

export {Flex};
