'use client';
import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceArea } from 'recharts';

const DataGraph = ({ 
  data = [], 
  xKey, 
  yKey, 
  title,
  xAxisLabel = "X Axis",
  yAxisLabel = "Y Axis"
}) => {
  const [refAreaLeft, setRefAreaLeft] = useState('');
  const [refAreaRight, setRefAreaRight] = useState('');
  const [zoomData, setZoomData] = useState(null);

  const validData = data.filter(point => 
    point && 
    typeof point[xKey] !== 'undefined' && 
    typeof point[yKey] !== 'undefined'
  );

  if (!validData?.length) {
    return (
      <div className="w-full rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
        <div className="p-4">
          <div className="h-64 w-full flex items-center justify-center text-gray-500">
            No data available
          </div>
        </div>
      </div>
    );
  }

  const getAxisYDomain = (from, to) => {
    try {
      const refData = validData.slice(from, to);
      if (!refData.length) return ['auto', 'auto'];

      let [bottom, top] = [refData[0][yKey], refData[0][yKey]];
      
      refData.forEach(d => {
        if (d && typeof d[yKey] !== 'undefined') {
          if (d[yKey] > top) top = d[yKey];
          if (d[yKey] < bottom) bottom = d[yKey];
        }
      });

      const padding = Math.abs(top - bottom) * 0.1;
      return [Math.floor(bottom - padding), Math.ceil(top + padding)];
    } catch (error) {
      console.error('Error calculating Y domain:', error);
      return ['auto', 'auto'];
    }
  };

  const zoom = () => {
    try {
      if (!refAreaLeft || !refAreaRight) return;

      let startIndex = validData.findIndex(item => item[xKey] === refAreaLeft);
      let endIndex = validData.findIndex(item => item[xKey] === refAreaRight);

      if (startIndex === -1 || endIndex === -1) return;

      if (startIndex > endIndex) [startIndex, endIndex] = [endIndex, startIndex];

      const [bottom, top] = getAxisYDomain(startIndex, endIndex);
      
      setZoomData({
        data: validData.slice(startIndex, endIndex + 1),
        left: validData[startIndex][xKey],
        right: validData[endIndex][xKey],
        bottom,
        top
      });
    } catch (error) {
      console.error('Error during zoom:', error);
    } finally {
      setRefAreaLeft('');
      setRefAreaRight('');
    }
  };

  // Function to generate ticks at regular intervals
  const generateTicks = (data) => {
    const dataLength = data.length;
    const numberOfTicks = 10;
    const interval = Math.floor(dataLength / numberOfTicks);
    
    return data.map(point => point[xKey])
              .filter((_, index) => index % interval === 0);
  };

  const currentData = zoomData?.data || validData;
  const ticks = generateTicks(currentData);

  return (
    <div className="w-full rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-lg font-semibold">{title}</h3>
        {zoomData && (
          <button
            onClick={() => setZoomData(null)}
            className="px-3 py-1 text-sm text-blue-600 hover:text-blue-700 border border-blue-600 rounded-md"
          >
            Reset Zoom
          </button>
        )}
      </div>
      <div className="p-4">
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={currentData}
              margin={{ top: 5, right: 30, left: 35, bottom: 20 }}
              onMouseDown={e => e && setRefAreaLeft(e.activeLabel)}
              onMouseMove={e => e && refAreaLeft && setRefAreaRight(e.activeLabel)}
              onMouseUp={() => {
                if (refAreaLeft && refAreaRight) zoom();
              }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
              <XAxis
                dataKey={xKey}
                className="text-xs"
                domain={['dataMin', 'dataMax']}
                ticks={ticks}
                scale="linear"
                type="number"
                label={{ value: xAxisLabel, position: 'bottom', offset: -10, fontSize: 12 }}
              />
              <YAxis
                className="text-xs"
                domain={[zoomData?.bottom || 'auto', zoomData?.top || 'auto']}
                label={{ value: yAxisLabel, angle: -90, position: 'insideLeft', fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  padding: '8px'
                }}
              />
              <Line
                type="monotone"
                dataKey={yKey}
                stroke="#2563eb"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6 }}
              />
              {refAreaLeft && refAreaRight ? (
                <ReferenceArea
                  x1={refAreaLeft}
                  x2={refAreaRight}
                  strokeOpacity={0.3}
                  fill="#2563eb"
                  fillOpacity={0.3}
                />
              ) : null}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DataGraph;