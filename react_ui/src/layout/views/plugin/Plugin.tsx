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

import {Tabs, TabsContent, Toaster} from '@/components/ui';
import {Div} from '@/layout/geometry';
import {ControlBar, tabs} from '@/layout/views';

const PluginView: React.FC = () => {
  return (
    <Tabs defaultValue={tabs[0].id} className={pluginContainer}>
      <ControlBar />
      <Div className={contentContainer}>
        {tabs.map((Tab, key) => (
          <TabsContent key={key} value={Tab.id}>
            <Tab />
          </TabsContent>
        ))}
      </Div>
      <Toaster />
    </Tabs>
  );
};

const pluginContainer = 'w-plugin h-plugin flex-col';
const contentContainer = 'w-plugin h-content flex justify-center items-center';

export {PluginView};
