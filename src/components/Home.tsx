import { Paper, Group, Stack, Title } from "@mantine/core";
import Histogram from "./histogram/Histogram";
import { useEffect, useState } from "react";
import { useService } from "../service";
import Options from "./Options";
import {
  DEFAULT_POLL_INTERVAL,
  DisplayOptions,
  DisplayRange,
  ValueFormat,
} from "./histogram";
import Metadata from "./Metadata";

// interval refs (used for poll interval)
let getDataInterval: NodeJS.Timeout;
let countDownInterval: NodeJS.Timeout;

function Home() {
  const service = useService();

  const [bloodData, setBloodData] = useState<number[]>();

  // minimum and maximum displayed values on the histogram
  const [displayRange, setDisplayRange] = useState<DisplayRange>({
    min: 70,
    max: 200,
  });

  const [valuesFormat, setValuesFormat] = useState<ValueFormat>(
    ValueFormat.RAW,
  );

  // refresh frequency for how often data is pulled from the API
  const [pollInterval, setPollInterval] = useState<number>(
    DEFAULT_POLL_INTERVAL,
  );

  // set this state on "apply" button click. This prevents the histogram from
  // updating on every option change.
  const [displayOptions, setDisplayOptions] = useState<DisplayOptions>({
    displayRange: JSON.parse(JSON.stringify(displayRange)),
    valuesFormat,
    pollInterval,
  });

  const [count, setCount] = useState(DEFAULT_POLL_INTERVAL);

  function getData() {
    service.getData({
      success: (res) => setBloodData(res.bloodPressures),
      error: (err) => console.error(err),
    });
  }

  function applyOptions() {
    setDisplayOptions({ displayRange, valuesFormat, pollInterval });
  }

  useEffect(() => getData(), []);

  useEffect(() => {
    getDataInterval && clearInterval(getDataInterval);
    countDownInterval && clearInterval(countDownInterval);
    setCount(displayOptions.pollInterval);

    getDataInterval = setInterval(getData, displayOptions.pollInterval * 1000);
    countDownInterval = setInterval(
      () => setCount((c) => (c === 1 ? displayOptions.pollInterval : c - 1)),
      1000,
    );
  }, [displayOptions.pollInterval]);

  return (
    <Group align="start" pos="relative">
      <Stack>
        {/* Control panel: control the data displayed on the histogram */}
        <Options
          displayRange={displayRange}
          onDisplayRangeChange={setDisplayRange}
          valuesFormat={valuesFormat}
          onValuesFormatChange={setValuesFormat}
          pollInterval={pollInterval}
          onPollIntervalChange={setPollInterval}
          onApply={applyOptions}
        />

        {/* Display */}
        <Metadata
          displayRange={displayOptions.displayRange}
          valuesFormat={displayOptions.valuesFormat}
          pollInterval={displayOptions.pollInterval}
          countDown={count}
          totalFetched={bloodData?.length ?? 0}
        />
      </Stack>

      <Paper style={{ zIndex: 2 }} h="100%" component={Stack} gap="lg">
        <Title order={5}>Histogram</Title>
        {bloodData && (
          <Histogram
            width={500}
            height={600}
            data={bloodData}
            min={displayOptions.displayRange.min}
            max={displayOptions.displayRange.max}
            logValues={displayOptions.valuesFormat === ValueFormat.LOGARITHMIC}
          />
        )}
      </Paper>
    </Group>
  );
}

export default Home;
