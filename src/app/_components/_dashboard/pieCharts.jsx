// components/PieChart.js
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ data }) => {
  return (
    // Inside PieChart.js
<div className="p-2 bg-white rounded shadow" style={{ maxWidth: '300px', margin: '0 auto' }}>
  <h2 className="text-sm font-semibold mb-2 text-center">Category Volume</h2>
  <Pie
    data={data}
    options={{
     
    }}
  />
</div>

  );
};

export default PieChart;
