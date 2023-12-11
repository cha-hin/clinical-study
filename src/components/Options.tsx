import {
  Group,
  Paper,
  Stack,
  Title,
  Text,
  RangeSlider,
  Divider,
  SegmentedControl,
  Button,
  NumberInput,
  Tooltip,
  NumberInputHandlers,
} from "@mantine/core";
import { useRef } from "react";
import { DisplayRange, ValueFormat } from "./histogram";

type OptionsProps = {
  displayRange: DisplayRange;
  onDisplayRangeChange: (displayRange: DisplayRange) => void;
  valuesFormat: ValueFormat;
  onValuesFormatChange: (valuesFormat: ValueFormat) => void;
  pollInterval: number;
  onPollIntervalChange: (pollInterval: number) => void;
  onApply: () => void;
};

function Options(props: OptionsProps) {
  const numberInputHandlers = useRef<NumberInputHandlers>();

  return (
    <Paper w={400} style={{ zIndex: 3 }}>
      <Stack gap="xs">
        <Title order={5}>Options</Title>

        {/* Range control: change minimum and maximum displayed values on the histogram  */}
        <Stack gap="xs">
          <Group gap={3} align="center">
            <Text c="gray.7" fw={600} fz="sm">
              Range
            </Text>
            <Text c="gray.7" fw={600} fz="sm">
              (mmHg)
            </Text>
          </Group>
          <RangeSlider
            min={70}
            max={200}
            step={5}
            value={[props.displayRange.min, props.displayRange.max]}
            onChange={([min, max]) => props.onDisplayRangeChange({ min, max })}
            color="primary.4"
            pb={"calc((1.125rem + 0.875rem))"}
            labelTransitionProps={{
              transition: "pop",
              duration: 150,
              timingFunction: "ease",
            }}
            marks={[
              { value: 70, label: 70 },
              { value: 135, label: 135 },
              { value: 200, label: 200 },
            ]}
          />
        </Stack>

        <Divider mx="-lg" color="gray.3" variant="dashed" />

        {/* Value format control: switch between logarithmic and raw values */}
        <Stack gap="xs">
          <Text c="gray.7" fw={600} fz="sm">
            Values format
          </Text>
          <SegmentedControl
            size="sm"
            radius="md"
            color="primary.4"
            value={props.valuesFormat}
            onChange={(value: string) =>
              props.onValuesFormatChange(value as ValueFormat)
            }
            data={[
              { label: "Raw", value: ValueFormat.RAW },
              { label: "Logarithmic", value: ValueFormat.LOGARITHMIC },
            ]}
          />
        </Stack>

        <Divider mx="-lg" color="gray.3" variant="dashed" />

        {/* Poll interval control: choose the refresh frequency (in seconds) for how often data is pulled from the API */}
        <Stack>
          <Stack gap={0}>
            <Group gap={3} align="center">
              <Text c="gray.7" fw={600} fz="sm">
                Poll interval
              </Text>
              <Text c="gray.7" fw={600} fz="sm">
                (s)
              </Text>
            </Group>
            <Text c="gray.6" fz="sm">
              Refresh frequency for how often data is pulled from the API
            </Text>
          </Stack>
          <Group gap={5}>
            <Button
              w={36}
              p={0}
              fz="lg"
              onClick={() => numberInputHandlers?.current?.decrement()}
            >
              –
            </Button>

            <NumberInput
              handlersRef={numberInputHandlers}
              hideControls
              value={props.pollInterval}
              onChange={(val) => props.onPollIntervalChange(val as number)}
              max={60}
              min={1}
              step={1}
              styles={{
                root: { width: 36 },
                input: { padding: 0, textAlign: "center" },
              }}
            />

            <Button
              w={36}
              p={0}
              fz="lg"
              onClick={() => numberInputHandlers?.current?.increment()}
            >
              +
            </Button>
          </Group>
        </Stack>
        <Tooltip
          label="Update the histogram"
          openDelay={200}
          transitionProps={{ transition: "pop", duration: 150 }}
        >
          <Button ml="auto" onClick={props.onApply}>
            Apply
          </Button>
        </Tooltip>
      </Stack>
    </Paper>
  );
}
export default Options;
