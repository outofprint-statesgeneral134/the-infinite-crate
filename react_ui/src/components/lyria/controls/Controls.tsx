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
import {
  Card,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Button,
} from '@/components/ui';
import {CorePanel, InfoPanel} from '@/components/lyria/controls/panels';
import {Flex} from '@/layout/geometry';
import {
  VERSION,
  UPDATE_URL,
  CHECK_UPDATE_URL,
  isUpdateAvailable,
} from '@/lib/utils';
import {useAppStore} from '@/data';
import {launchUpdateURL} from '@/data/state/bridge';
import {DownloadIcon} from '@radix-ui/react-icons';
import {useToast} from '@/lib/utils';

export const panels = [CorePanel, InfoPanel]; //AdvancedPanel];

const Controls: React.FC = () => {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const setUpdateURL = useAppStore(state => state.setUpdateURL);

  const {toast} = useToast();
  useEffect(() => {
    const fetchUpdateInfo = async () => {
      let versionInfo = {
        latest_version: '0.0.0',
        download_url: UPDATE_URL,
      };
      try {
        const response = await fetch(CHECK_UPDATE_URL);
        let data = await response.text();
        let d = data
          .replace(/'/g, '"')
          .trim()
          .replace(/,\s*([}\]])\s*$/, '$1');
        versionInfo = JSON.parse(d);
        let url = versionInfo.download_url;
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
          url = `https://${url}`;
        }
        versionInfo.download_url = url;
      } catch (error) {
        console.log('reading error');
      }
      if (isUpdateAvailable(VERSION, versionInfo.latest_version)) {
        setUpdateAvailable(true);
        console.log(versionInfo.download_url);
        setUpdateURL(versionInfo.download_url);
        toast({
          description: `Update Available! Please download using the button on the bottom right`,
        });
      }
    };

    fetchUpdateInfo();
  }, []);

  const launchUpdate = () => {
    launchUpdateURL();
  };

  return (
    <Tabs defaultValue={panels[0].id}>
      <Card className={cardContainer}>
        {panels.map((Panel, key) => (
          <TabsContent key={key} value={Panel.id} className={panelContainer}>
            <Panel />
          </TabsContent>
        ))}
      </Card>
      {/* uncomment below for advanced controls */}
      <Flex className={infoContainer} direction="row" justify="center">
        {!updateAvailable && (
          <TabsList className={tabsContainer}>
            {panels.map((panel, key) => (
              <TabsTrigger key={key} value={panel.id}>
                {panel.label}
              </TabsTrigger>
            ))}
          </TabsList>
        )}
        {updateAvailable && (
          <Button className={updateButton} onClick={launchUpdate}>
            Update Available
            <DownloadIcon />
          </Button>
        )}
      </Flex>
    </Tabs>
  );
};

const cardContainer = 'pt-6 pb-12 px-8 flex';
const panelContainer = 'items-start w-[300px] h-[455px]';
const tabsContainer = ' mt-4';
const updateButton = 'mt-4';
const infoContainer = 'mt-[12px]';

export {Controls};
