/**
 * @file
 * @copyright 2020 Aleksej Komarov
 * @license MIT
 */

import { toFixed } from 'common/math';
import { useDispatch, useSelector } from 'common/redux';
import { Box, Button, ColorBox, Divider, Dropdown, Flex, Input, LabeledList, NumberInput, Section, Tabs, TextArea } from 'tgui/components';
import { ChatPageSettings } from '../chat';
import { rebuildChat, saveChatToDisk } from '../chat/actions';
import { THEMES } from '../themes';
import { changeSettingsTab, updateSettings } from './actions';
import { SETTINGS_TABS } from './constants';
import { selectActiveTab, selectSettings } from './selectors';

export const SettingsPanel = (props, context) => {
  const activeTab = useSelector(context, selectActiveTab);
  const dispatch = useDispatch(context);
  return (
    <Flex>
      <Flex.Item mr={1}>
        <Section fitted fill minHeight="8em">
          <Tabs vertical>
            {SETTINGS_TABS.map(tab => (
              <Tabs.Tab
                key={tab.id}
                selected={tab.id === activeTab}
                onClick={() => dispatch(changeSettingsTab({
                  tabId: tab.id,
                }))}>
                {tab.name}
              </Tabs.Tab>
            ))}
          </Tabs>
        </Section>
      </Flex.Item>
      <Flex.Item grow={1} basis={0}>
        {activeTab === 'general' && (
          <SettingsGeneral />
        )}
        {activeTab === 'chatPage' && (
          <ChatPageSettings />
        )}
      </Flex.Item>
    </Flex>
  );
};

export const SettingsGeneral = (props, context) => {
  const {
    theme,
    fontSize,
    lineHeight,
    highlightText,
    highlightColor,
    matchWord,
    matchCase,
  } = useSelector(context, selectSettings);
  const dispatch = useDispatch(context);
  return (
    <Section fill>
      <LabeledList>
        <LabeledList.Item label="Theme">
          <Dropdown
            selected={theme}
            options={THEMES}
            onSelected={value => dispatch(updateSettings({
              theme: value,
            }))} />
        </LabeledList.Item>
        <LabeledList.Item label="Font size">
          <NumberInput
            width="4em"
            step={1}
            stepPixelSize={10}
            minValue={8}
            maxValue={32}
            value={fontSize}
            unit="px"
            format={value => toFixed(value)}
            onChange={(e, value) => dispatch(updateSettings({
              fontSize: value,
            }))} />
        </LabeledList.Item>
        <LabeledList.Item label="Line height">
          <NumberInput
            width="4em"
            step={0.01}
            stepPixelSize={2}
            minValue={0.8}
            maxValue={5}
            value={lineHeight}
            format={value => toFixed(value, 2)}
            onDrag={(e, value) => dispatch(updateSettings({
              lineHeight: value,
            }))} />
        </LabeledList.Item>
      </LabeledList>
      <Divider />
      <Box>
        <Flex mb={1} color="label" align="baseline">
          <Flex.Item grow={1}>
            Highlight words (comma separated):
          </Flex.Item>
          <Flex.Item shrink={0}>
            <ColorBox mr={1} color={highlightColor} />
            <Input
              width="5em"
              monospace
              placeholder="#ffffff"
              value={highlightColor}
              onInput={(e, value) => dispatch(updateSettings({
                highlightColor: value,
              }))} />
          </Flex.Item>
        </Flex>
        <TextArea
          height="3em"
          value={highlightText}
          onChange={(e, value) => dispatch(updateSettings({
            highlightText: value,
          }))} />
        <Button.Checkbox
          checked={matchWord}
          tooltipPosition="bottom-start"
          tooltip="Not compatible with punctuation."
          onClick={() => dispatch(updateSettings({
            matchWord: !matchWord,
          }))}>
          Match word
        </Button.Checkbox>
        <Button.Checkbox
          checked={matchCase}
          onClick={() => dispatch(updateSettings({
            matchCase: !matchCase,
          }))}>
          Match case
        </Button.Checkbox>
      </Box>
      <Divider />
      <Box>
        <Button
          icon="check"
          onClick={() => dispatch(rebuildChat())}>
          Apply now
        </Button>
        <Box inline fontSize="0.9em" ml={1} color="label">
          Can freeze the chat for a while.
        </Box>
      </Box>
      <Divider />
      <Button
        icon="save"
        onClick={() => dispatch(saveChatToDisk())}>
        Save chat log
      </Button>
    </Section>
  );
};
