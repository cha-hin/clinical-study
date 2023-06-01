import { Paper, RangeSlider, Group, Text, Button, Stack, SegmentedControl, NumberInput, NumberInputHandlers, Divider, Title, Tooltip } from "@mantine/core";
import { Histogram } from "./Histogram/Histogram";
import { useEffect, useRef, useState } from "react";
import { useService } from "src/service";

enum ValueFormat {
  RAW = "RAW",
  LOGARITHMIC = "LOGARITHMIC"
}

type DisplayRange = {
  min: number;
  max: number;
}

type DisplayOptions = {
  displayRange: DisplayRange;
  valuesFormat: ValueFormat;
  pollInterval: number;
}

const POLL_INTERVAL = 5;

// interval refs (used for poll interval)
let interval;
let countDownInterval;

function Home() {
  const service = useService();

  // state related to blood pressure data
  const [data, setData] = useState<number[]>();

  const numberInputHandlers = useRef<NumberInputHandlers>();

  // minimum and maximum displayed values on the histogram 
  const [displayRange, setDisplayRange] = useState<DisplayRange>({ min: 70, max: 200 });

  const [valuesFormat, setValuesFormat] = useState<ValueFormat>(ValueFormat.RAW);

  // refresh frequency for how often data is pulled from the API
  const [pollInterval, setPollInterval] = useState<number>(POLL_INTERVAL);

  // set this state on "apply" button click. This prevents the histogram from
  // updating on every option change.
  const [displayOptions, setDisplayOptions] = useState<DisplayOptions>({ displayRange: JSON.parse(JSON.stringify(displayRange)), valuesFormat, pollInterval });

  const [count, setCount] = useState(POLL_INTERVAL);

  // get blood pressure data as soon as users logs in
  useEffect(() => getData(), []);

  useEffect(() => {
    interval && clearInterval(interval);
    countDownInterval && clearInterval(countDownInterval);
    setCount(displayOptions.pollInterval);

    interval = setInterval(getData, displayOptions.pollInterval * 1000);
    countDownInterval = setInterval(() => setCount(c => c === 1 ? displayOptions.pollInterval : c - 1), 1000)
  }, [displayOptions.pollInterval]);


  function getData() {
    service.getData({
      success: res => setData(res.bloodPressures),
      error: err => console.log(err)
    })
  }


  function update() {
    setDisplayOptions({ displayRange, valuesFormat, pollInterval })
  }

  return (
    <Group align="start" pos="relative">
      <Stack>
        {/* Control panel: control the data displayed on the histogram */}
        <Paper w={400} sx={{ zIndex: 3 }}>
          <Stack spacing="xs">
            <Title order={5}>Options</Title>

            {/* Range control: change minimum and maximum displayed values on the histogram  */}
            <Stack spacing="xs">
              <Group spacing={3} align="center">
                <Text color="gray.7" fw={600} fz="sm">Range</Text>
                <Text color="gray.7" fw={600} fz="sm">(mmHg)</Text>
              </Group>
              <RangeSlider
                min={70} max={200} step={5}
                value={[displayRange.min, displayRange.max]}
                onChange={([min, max]) => setDisplayRange({ min, max })}
                color="primary.4"
                pb={"calc((0.625rem / 2 + 0.875rem))"}
                labelTransition="pop" labelTransitionDuration={150} labelTransitionTimingFunction="ease"
                marks={[
                  { value: 70, label: 70 },
                  { value: 135, label: 135 },
                  { value: 200, label: 200 },
                ]} />
            </Stack>

            <Divider mx="-lg" color="gray.3" variant="dashed" />

            {/* Value format control: switch between logarithmic and raw values */}
            <Stack spacing="xs">
              <Text color="gray.7" fw={600} fz="sm">Values format</Text>
              <SegmentedControl
                size="sm"
                radius="md"
                color="primary.4"
                value={valuesFormat}
                onChange={(value: ValueFormat) => setValuesFormat(value)}
                data={[
                  { label: "Raw", value: ValueFormat.RAW },
                  { label: "Logarithmic", value: ValueFormat.LOGARITHMIC }
                ]}
              />
            </Stack>

            <Divider mx="-lg" color="gray.3" variant="dashed" />

            {/* Poll interval control: choose the refresh frequency (in seconds) for how often data is pulled from the API */}
            <Stack>
              <Stack spacing={0}>
                <Group spacing={3} align="center">
                  <Text color="gray.7" fw={600} fz="sm">Poll interval</Text>
                  <Text color="gray.7" fw={600} fz="sm">(s)</Text>
                </Group>
                <Text color="gray.6" fz="sm">Refresh frequency for how often data is pulled from the API</Text>
              </Stack>
              <Group spacing={5}>
                <Button w={36} p={0} fz="lg" onClick={() => numberInputHandlers?.current?.decrement()}>
                  –
                </Button>

                <NumberInput
                  handlersRef={numberInputHandlers}
                  hideControls
                  value={pollInterval}
                  onChange={val => setPollInterval(val as number)}
                  max={60}
                  min={1}
                  step={1}
                  styles={{
                    root: { width: 36 },
                    input: { padding: 0, textAlign: "center", }
                  }}
                />

                <Button w={36} p={0} fz="lg" onClick={() => numberInputHandlers?.current?.increment()}>
                  +
                </Button>
              </Group>
            </Stack>
            <Tooltip label="Update the histogram" openDelay={200} transitionProps={{ transition: "pop", duration: 150 }}>
              <Button ml="auto" onClick={update}>Apply</Button>
            </Tooltip>
          </Stack>
        </Paper>

        <Paper sx={{ zIndex: 4 }}>
          <Stack spacing="xs">
            <Text fw={600}>Histogram metadata</Text>
            <Group spacing="sm" position="apart">
              <Text fw={600} size="sm" color="gray.7">Blood pressure range</Text>
              <Text size="sm" color="gray">[{displayOptions.displayRange.min}, {displayOptions.displayRange.max}]</Text>
            </Group>
            <Divider mx="-lg" color="gray.3" variant="dashed" />
            <Group spacing="sm" position="apart">
              <Text fw={600} size="sm" color="gray.7">Frequency display format</Text>
              <Text size="sm" color="gray">{displayOptions.valuesFormat}</Text>
            </Group>
            <Divider mx="-lg" color="gray.3" variant="dashed" />
            <Group spacing="sm" position="apart">
              <Text fw={600} size="sm" color="gray.7">Poll interval</Text>
              <Text size="sm" color="gray">{displayOptions.pollInterval}s</Text>
            </Group>
            <Divider mx="-lg" color="gray.3" variant="dashed" />
            <Group spacing="sm" position="apart">
              <Text fw={600} size="sm" color="gray.7">Next fetch from API</Text>
              <Text size="sm" color="gray">{count}s</Text>
            </Group>
            <Divider mx="-lg" color="gray.3" variant="dashed" />
            <Group spacing="sm" position="apart">
              <Text fw={600} size="sm" color="gray.7">Total blood pressure values fetched</Text>
              <Text size="sm" color="gray">{data?.length}</Text>
            </Group>
          </Stack>
        </Paper>
      </Stack>

      <Paper sx={{ zIndex: 2 }} h="100%">
        {data && <Histogram
          width={500}
          height={650}
          data={data}
          min={displayOptions.displayRange.min}
          max={displayOptions.displayRange.max}
          logValues={displayOptions.valuesFormat === ValueFormat.LOGARITHMIC}
        />}
      </Paper>

    </Group>
  )
}

export default Home;