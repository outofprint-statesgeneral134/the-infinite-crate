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

import {Button, TooltipAtom} from '@/components/ui';
import {PlayIcon, UpdateIcon, PauseIcon} from '@radix-ui/react-icons';
import {useTransportStore, TransportState} from '@/data';

const PlayButton: React.FC = () => {
  const playing = useTransportStore((state: TransportState) => state.playing);
  const buffering = useTransportStore(
    (state: TransportState) => state.buffering,
  );
  const togglePlaying = useTransportStore(
    (state: TransportState) => state.togglePlaying,
  );

  const playIcon = <PlayIcon />;
//  const stopIcon = <StopIcon />;
  const pauseIcon = <PauseIcon />;
  const bufferingIcon = <UpdateIcon />;
  const playLabel = 'PLAY';
//  const stopLabel = 'STOP';
  const pauseLabel = 'PAUSE';
  const bufferingLabel = 'BUFFERING';

  return (
    <TooltipAtom tooltip="Start/stop generating audio. The Lyria model updates prompts and params every ~2-4 seconds">
      <Button
        onClick={togglePlaying}
        disabled={buffering && playing}
        variant="outline"
        size="sm"
        className={transportButton}
      >
        {buffering && playing
          ? bufferingLabel
          : playing
            ? pauseLabel
            : playLabel}
        {buffering && playing ? bufferingIcon : playing ? pauseIcon : playIcon}
      </Button>
    </TooltipAtom>
  );
};

const transportButton = 'w-[150px] h-[60px] items-center text-lg font-thin';

export {PlayButton};
