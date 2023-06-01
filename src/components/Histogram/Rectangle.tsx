import { useMantineTheme } from "@mantine/core";
import { useSpring, animated } from "@react-spring/web";

type RectangleProps = {
  width: number;
  height: number;
  x: number;
  y: number;
};

const Rectangle = (props: RectangleProps) => {
  const theme = useMantineTheme();
  const { x, y, width, height } = props;

  const springProps = useSpring({
    to: { x, y, width, height },
    config: {
      friction: 30,
    },
    delay: x,
  });

  if (y === undefined) {
    return null;
  }

  return (
    <animated.rect
      x={springProps.x}
      y={springProps.y}
      width={springProps.width}
      height={springProps.height}
      // opacity={0.7}
      stroke={theme.colors.primary[4]}
      fill={theme.colors.primary[7]}
      fillOpacity={0.5}
      strokeWidth={1}
      rx={3}
    />
  );
};

export default Rectangle;
