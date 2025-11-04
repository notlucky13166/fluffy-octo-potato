import React from 'react';
import { VictoryPolarAxis, VictoryLabel, VictoryChart, VictoryTheme, VictoryArea } from 'victory-native';
import { useTheme } from '../theme/ThemeProvider';
import { ProgressSnapshot } from '../store/useProgressStore';

interface ProgressChartProps {
  data: ProgressSnapshot[];
}

const ProgressChart: React.FC<ProgressChartProps> = ({ data }) => {
  const { colors } = useTheme();

  return (
    <VictoryChart
      polar
      animate={{ duration: 750 }}
      theme={VictoryTheme.material}
      domain={{ y: [0, 100] }}
    >
      <VictoryPolarAxis
        dependentAxis
        style={{
          axis: { stroke: 'none' },
          grid: { stroke: colors.muted, opacity: 0.2 }
        }}
      />
      <VictoryPolarAxis
        style={{
          axis: { stroke: colors.muted, opacity: 0.3 },
          tickLabels: { fill: colors.muted, fontSize: 12 }
        }}
        tickLabelComponent={<VictoryLabel labelPlacement="perpendicular" />}
      />
      <VictoryArea
        data={data.map((snapshot) => ({ x: snapshot.area, y: snapshot.score }))}
        style={{
          data: { fill: `${colors.primary}40`, stroke: colors.primary, strokeWidth: 2 }
        }}
      />
    </VictoryChart>
  );
};

export default ProgressChart;
