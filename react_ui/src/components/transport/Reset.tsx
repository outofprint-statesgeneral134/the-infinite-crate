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
import {CrumpledPaperIcon} from '@radix-ui/react-icons';
import {Button, TooltipAtom} from '@/components/ui';
import {resetGemini, reconnectGemini} from '@/data/state/bridge';
import {useTransportStore, TransportState, useDawStore, DawState} from '@/data';
import {SERVER_ERROR, useToast} from '@/lib/utils';

const ResetButton: React.FC = () => {
  const resetIcon = <CrumpledPaperIcon />;
  const resetLabel = 'RESET';

  const {toast, dismiss} = useToast();

  const buffering = useTransportStore(
    (state: TransportState) => state.buffering,
  );
  const connected = useTransportStore(
    (state: TransportState) => state.connected,
  );
  const stop = useTransportStore((state: TransportState) => state.stop);
  const setConnected = useTransportStore(
    (state: TransportState) => state.setConnected,
  );
  const setPlayhead = useDawStore((state: DawState) => state.setPlayhead);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | undefined = undefined;
    if (buffering) {
      intervalId = setInterval(() => {
        stop();
        setConnected(false);
        // setPlayhead(0);
        toast({
          description: SERVER_ERROR,
          variant: 'destructive',
          duration: 500000000,
        });
      }, 5000);
    }
    return () => {
      // This is the cleanup function
      if (intervalId) {
        clearInterval(intervalId); // Stop the interval here
      }
    };
  }, [buffering]);

  useEffect(() => {
    console.log('connected', connected);
    if (connected) {
      dismiss();
      toast({
        description: 'Connected to server',
        variant: 'default',
        duration: 3000,
      });
    }
  }, [connected]);

  const reset = () => {
    stop();
    setTimeout(() => {
      reconnectGemini();
    }, 100);
  };

  const resetClicked = () => {
    setPlayhead(0);
    if (connected) {
      resetGemini(false);
    } else {
      reset();
    }
  };


  return (
    <TooltipAtom tooltip="Resets the model's context/memory if connected. Resets server connection if disconnected.">
      <Button
        onClick={resetClicked}
        variant="outline"
        size="sm"
        className={transportButton}
      >
        {resetLabel}
        {resetIcon}
      </Button>
    </TooltipAtom>
  );
};

const transportButton = 'w-[150px] h-[60px] items-center text-lg font-thin';

export {ResetButton};
