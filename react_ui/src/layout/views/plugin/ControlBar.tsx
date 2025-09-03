import {Flex} from '@/layout/geometry';
import {LyriaView, SuggestionsView} from '@/layout/views';
import {Transport} from '@/components/transport';
import {Div} from '@/layout/geometry';
import {cn} from '@/lib/utils';

export interface TabProps {
  id: string;
  label: string;
  icon?: string;
}

export const tabs = [
  LyriaView,
  SuggestionsView,
  /* Ideas for more tabs and controls: */
  // InspirationView,
  // ChatView,
  // FXView,
];

const ControlBar: React.FC = () => {
  return (
    <Flex direction="row-start" justify="start" className={controlBarContainer}>
      <Div className={titleContainer}>
        <Flex direction="row" gap="sm">
          <span className={cn(wordInfinite, fontBorder)}>
            The Infinite Crate
          </span>{' '}
          <span className={cn(wordBeta)}>OSS・48khz </span>
        </Flex>
      </Div>
      {/* In future we could have audio prompts */}
      {/* <Flex direction="row" gap="sm" justify="center">
        <InputGainSlider />
        <InputRecButton />
      </Flex> */}
      {/* Multiple tabs could room for additional controls */}
      {/* <TabsList>
        {tabs.map((tab, key) => (
          <TabsTrigger key={key} value={tab.id}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList> */}

      <Transport />
      {/* Example of output volume control */}
      {/* <Flex direction="row" gap="sm" justify="center">
        <OutputGainSlider />
        <OutputMuteToggle />
      </Flex> */}
    </Flex>
  );
};

const titleContainer = 'text-[50px]';
const controlBarContainer =
  'flex justify-center w-plugin mt-[100px] mb-[0px] gap-[200px]';
const wordInfinite = 'font-bold mt-[3px] cursor-default';
const wordBeta = 'text-sm font-medium mb-[30px] cursor-default';
const fontBorder = '';

export {ControlBar};
