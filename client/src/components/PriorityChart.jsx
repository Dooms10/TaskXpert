import React from 'react'

const PriorityChart = ({ data }) => {
  const total = data.reduce((sum, item) => sum + item.count, 0)
  
  // Calculate percentages and angles for pie chart
  const chartData = data.map(item => ({
    ...item,
    percentage: total > 0 ? (item.count / total * 100) : 0,
    angle: total > 0 ? (item.count / total * 360) : 0
  }))

  // Create SVG pie chart
  const createPieChart = () => {
    const radius = 80
    const centerX = 100
    const centerY = 100
    let currentAngle = 0

    return chartData.map((item, index) => {
      if (item.count === 0) return null

      const startAngle = (currentAngle * Math.PI) / 180
      const endAngle = ((currentAngle + item.angle) * Math.PI) / 180

      const x1 = centerX + radius * Math.cos(startAngle)
      const y1 = centerY + radius * Math.sin(startAngle)
      const x2 = centerX + radius * Math.cos(endAngle)
      const y2 = centerY + radius * Math.sin(endAngle)

      const largeArcFlag = item.angle > 180 ? 1 : 0

      const pathData = [
        `M ${centerX} ${centerY}`,
        `L ${x1} ${y1}`,
        `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
        'Z'
      ].join(' ')

      currentAngle += item.angle

      return (
        <path
          key={index}
          d={pathData}
          fill={item.color}
          stroke="white"
          strokeWidth="2"
          className="hover:opacity-80 transition-opacity duration-200"
        />
      )
    })
  }

  if (total === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <p className="mt-2 text-sm text-gray-500">No tasks to display</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center">
      {/* Vertical Bar Chart */}
      <div className="mb-6 w-full">
        <div className="flex items-end justify-center space-x-4 h-48">
          {chartData.map((item, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="relative">
                <div
                  className="w-16 rounded-t-lg transition-all duration-500 ease-out hover:opacity-80"
                  style={{ 
                    height: `${Math.max(item.percentage * 2, 20)}px`,
                    backgroundColor: item.color,
                    minHeight: '20px'
                  }}
                ></div>
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-700 bg-white px-2 py-1 rounded shadow-sm">
                  {item.count}
                </div>
              </div>
              <div className="mt-2 text-xs font-medium text-gray-600 text-center">
                {item.priority}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Legend with percentages */}
      <div className="space-y-3 w-full">
        {chartData.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center">
              <div 
                className="w-4 h-4 rounded-lg mr-3"
                style={{ backgroundColor: item.color }}
              ></div>
              <span className="text-sm font-medium text-gray-700">{item.priority}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">{item.count}</span>
              <span className="text-xs text-gray-500">
                ({Math.round(item.percentage)}%)
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PriorityChart

