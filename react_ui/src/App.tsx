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

import {useEffect} from 'react';
import {Resizer, Div} from '@/layout/geometry';
import {useAppStore, AppState} from '@/data';
import {LoginView, PluginView} from '@/layout/views';

function App() {
  const credentials = useAppStore((state: AppState) => state.credentials);
  const setCredentials = useAppStore((state: AppState) => state.setCredentials);

  useEffect(() => {
    if (credentials.api_key !== '') {
      setCredentials({
        api_key: credentials.api_key,
      });
    }
  }, []);

  return (
    <Div className={appContainer}>
      <Resizer>
        {credentials.api_key !== '' ? (
          <PluginView />
        ) : (
          <LoginView />
        )}
      </Resizer>
    </Div>
  );
}

const appContainer = 'h-screen w-screen flex justify-center items-center';

export default App;
