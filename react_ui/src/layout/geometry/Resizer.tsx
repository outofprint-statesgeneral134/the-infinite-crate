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

import React, {useState, useEffect} from 'react';
import {addJuceListener, DEFAULT_WIDTH} from '@/lib/utils';
import {GeometryProps} from '@/data/types';
import {Div} from './index';

const Resizer: React.FC<GeometryProps> = ({children}) => {
  // Placeholder for future state or effect logic

  const [scale, setScale] = useState(window.innerWidth / DEFAULT_WIDTH); // Initialize scale state

  useEffect(() => {
    const handleResizeEvent = (newScale: number) => {
      setScale(newScale);
    };

    const removeListener = addJuceListener('resizeEvent', handleResizeEvent);
    return () => removeListener();
  }, []);

  return (
    <Div className={resizerContainer} style={{transform: `scale(${scale})`}}>
      {children}
    </Div>
  );
};

const resizerContainer = `
  transform-gpu origin-center 
  will-change-transform 
  font-synthesis-none 
  text-rendering-optimizeLegibility 
  antialiased select-none
`;

export {Resizer};
