import { Divider, Group, Paper, Stack, Text } from "@mantine/core";
import { DisplayRange, ValueFormat } from "./histogram";

type MetadataProps = {
  displayRange: DisplayRange;
  valuesFormat: ValueFormat;
  pollInterval: number;
  countDown: number;
  totalFetched: number;
};

function Metadata(props: MetadataProps) {
  return (
    <Paper style={{ zIndex: 4 }}>
      <Stack gap="xs">
        <Text fw={600}>Histogram metadata</Text>
        <Group gap="sm" justify="space-between">
          <Text fw={600} size="sm" c="gray.7">
            Blood pressure range
          </Text>
          <Text size="sm" c="gray">
            [{props.displayRange.min}, {props.displayRange.max}]
          </Text>
        </Group>
        <Divider mx="-lg" color="gray.3" variant="dashed" />
        <Group gap="sm" justify="space-between">
          <Text fw={600} size="sm" c="gray.7">
            Frequency display format
          </Text>
          <Text size="sm" c="gray">
            {props.valuesFormat}
          </Text>
        </Group>
        <Divider mx="-lg" color="gray.3" variant="dashed" />
        <Group gap="sm" justify="space-between">
          <Text fw={600} size="sm" c="gray.7">
            Poll interval
          </Text>
          <Text size="sm" c="gray">
            <span>{props.pollInterval}</span>
            <span>s</span>
          </Text>
        </Group>
        <Divider mx="-lg" color="gray.3" variant="dashed" />
        <Group gap="sm" justify="space-between">
          <Text fw={600} size="sm" c="gray.7">
            Next fetch from API
          </Text>
          <Text size="sm" c="gray">
            <span>{props.countDown}</span>
            <span>s</span>
          </Text>
        </Group>
        <Divider mx="-lg" color="gray.3" variant="dashed" />
        <Group gap="sm" justify="space-between">
          <Text fw={600} size="sm" c="gray.7">
            Total blood pressure values fetched
          </Text>
          <Text size="sm" c="gray">
            {props.totalFetched}
          </Text>
        </Group>
      </Stack>
    </Paper>
  );
}
export default Metadata;
