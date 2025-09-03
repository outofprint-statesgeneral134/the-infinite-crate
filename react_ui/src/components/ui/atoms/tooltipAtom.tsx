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

import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui';
import {cn} from '@/lib/utils';

const TooltipAtom: React.FC<{children: React.ReactNode; tooltip: string; className?: string}> = ({
  children,
  tooltip,
  className,
}) => {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={1500}>
        <TooltipTrigger className={triggerContainer}>{children}</TooltipTrigger>
        <TooltipContent className={cn(contentContainer, className)}>{tooltip}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const triggerContainer = 'w-full cursor-default text-left';
const contentContainer = 'mb-2 mt-2 ml-4 break-words max-w-xs';

export {TooltipAtom};
