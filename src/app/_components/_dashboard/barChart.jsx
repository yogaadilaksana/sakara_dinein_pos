// components/BarChart.js
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const BarChart = ({ data }) => {
  return (
    <div className="p-2 bg-white rounded shadow" style={{ maxWidth: '300px', margin: '0 auto' }}>
      <h3 className="text-sm font-semibold mb-2 text-center">{data.category}</h3>
      <Bar
        data={{
          labels: data.labels,
          datasets: [
            {
              label: 'Sales',
              data: data.data,
              backgroundColor: 'rgba(54, 162, 235, 0.2)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1,
            },
          ],
        }}
        // options={{
        //   maintainAspectRatio: false,
        //   plugins: {
        //     legend: {
        //       display: false,
        //     },
        //     tooltip: {
        //       enabled: true,
        //     },
        //   },
        // }}
      />
    </div>
  );
};

export default BarChart;
