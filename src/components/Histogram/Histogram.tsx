import * as d3 from "d3";
import { useEffect, useMemo, useRef } from "react";
import Rectangle from "./Rectangle.tsx";
import { Box, Stack, useMantineTheme } from "@mantine/core";
import classes from "./Histogram.module.css";

const MARGIN = { top: 10, right: 10, bottom: 50, left: 50 };
const BUCKET_NUMBER = 20;
const BUCKET_PADDING = 0;

type HistogramProps = {
  width: number;
  height: number;
  min: number;
  max: number;
  data: number[];
  logValues: boolean;
};

const Histogram = ({
  width,
  height,
  data,
  min,
  max,
  logValues,
}: HistogramProps) => {
  const theme = useMantineTheme();
  const axesRef = useRef(null);
  const boundsWidth = width - MARGIN.right - MARGIN.left;
  const boundsHeight = height - MARGIN.top - MARGIN.bottom;

  // read the data
  const xScale = useMemo(() => {
    return d3.scaleLinear().domain([min, max]).range([10, boundsWidth]);
  }, [data, min, max, boundsWidth]);

  // build the scales
  const buckets = useMemo(() => {
    const bucketGenerator = d3
      .bin()
      .value((d) => d)
      .domain(xScale.domain() as any)
      .thresholds(xScale.ticks(BUCKET_NUMBER));
    return bucketGenerator(data);
  }, [xScale]);

  const yScale = useMemo(() => {
    const max = Math.max(...buckets.map((bucket) => bucket?.length));
    return (logValues ? d3.scaleLog() : d3.scaleLinear())
      .range([boundsHeight, 0])
      .domain([logValues ? 1 : 0, Math.ceil(max / 10) * 10])
      .nice();
  }, [data, boundsHeight, xScale, logValues]);

  // Render the X axis using d3.js, not react
  useEffect(() => {
    const svgElement = d3.select(axesRef.current);
    svgElement.selectAll("*").remove();

    const xAxisGenerator = d3.axisBottom(xScale);
    svgElement
      .append("g")
      .attr("transform", `translate(0,${boundsHeight})`)
      .call(xAxisGenerator);

    const yAxisGenerator = d3.axisLeft(yScale);
    svgElement.append("g").call(yAxisGenerator);

    const tooltip = d3.select("#tooltip");

    d3.selectAll("rect")
      .data(() => buckets)
      .on("mouseenter", function (event, d: any) {
        d3.select(event.currentTarget)
          .style("fill-opacity", 1)
          .style("fill", theme.colors.primary[4]);
        tooltip.html(`mmHg: ${d?.x0} to ${d.x1}<br>Frequency: ${d.length}`);
        const { clientWidth: tooltipWidth, clientHeight: tooltipHeight } =
          tooltip.node() as any;
        const { width: barWidth } = event.target.getBoundingClientRect();
        const positionX =
          MARGIN.left + xScale(d.x0) + barWidth / 2 - tooltipWidth / 2;
        const positionY = MARGIN.top + yScale(d.length) - tooltipHeight - 10;
        tooltip
          .style("top", `${positionY}px`)
          .style("left", `${positionX}px`)
          .style("opacity", "1")
          .style("transform", `scale(1)`);
      })

      // make tooltip disappear
      .on("mouseleave", function (event) {
        d3.select(event.currentTarget)
          .style("fill-opacity", 0.5)
          .style("fill", theme.colors.primary[7]);
        tooltip.style("opacity", "0").style("transform", "scale(0.9)");
      });
  }, [xScale, yScale, boundsHeight]);

  // build the rectangles
  const allRects = useMemo(() => {
    return buckets.map((bucket: any, i) => {
      const { x0, x1 } = bucket;
      if (x0 == undefined || x1 == undefined) {
        return null;
      }

      const scaleY = yScale(
        bucket.length > 0 ? bucket.length : logValues ? 1 : 0,
      );
      const width = xScale(x1) - xScale(x0) - BUCKET_PADDING;
      const height = boundsHeight - scaleY;
      return (
        <Rectangle
          key={i}
          x={xScale(bucket.x0) + BUCKET_PADDING / 2}
          width={width < 0 ? 0 : width}
          y={scaleY}
          height={height < 0 ? 0 : height}
        />
      );
    });
  }, [buckets, boundsHeight, xScale, yScale]);

  return (
    <Stack pos="relative" style={{ flexGrow: 1 }}>
      <div id="tooltip" className={classes.tooltip} />

      <svg width={width} height={height}>
        <g
          width={boundsWidth}
          height={boundsHeight}
          transform={`translate(${MARGIN.left}, ${MARGIN.top})`}
          className={classes.axis}
        >
          {allRects}
        </g>
        <g
          width={boundsWidth}
          height={boundsHeight}
          ref={axesRef}
          transform={`translate(${MARGIN.left}, ${MARGIN.top})`}
          className={classes.axis}
        />
        <text
          textAnchor="middle"
          x={width / 2}
          y={height - 10}
          className={classes.axis}
        >
          Systolic blood pressure (mmHg)
        </text>
        <text
          textAnchor="middle"
          x={-width / 2}
          y={12}
          transform={`rotate(-90)`}
          className={classes.axis}
        >
          Frequency
        </text>
      </svg>
    </Stack>
  );
};

export default Histogram;
