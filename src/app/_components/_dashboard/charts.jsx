import React from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const Charts = ({ pieData, barData }) => {
    // Format pieData untuk Pie chart
    const pieChartData = pieData ? pieData : {
        labels: [],
        datasets: [{
            label: 'Product Volume',
            data: [],
            backgroundColor: ['#36A2EB', '#FF6384', '#FFCE56', '#4BC0C0', '#9966FF'],
        }]
    };

    // Format barData untuk Bar chart
    const barCharts = barData ? barData : [];
    
    return (
        <div className="flex flex-col items-center mt-10">
            <div className="flex justify-around w-full mb-10">
                <div className="text-center">
                    <h3 className="mb-4">Category Volume</h3>
                    <div className="w-72 h-72 mx-auto">
                        <Pie data={pieChartData} />
                    </div>
                </div>
                <div className="text-center">
                    <h3 className="mb-4">Category Sales</h3>
                    <div className="w-72 h-72 mx-auto">
                        <Pie data={pieChartData} />
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
                {barCharts.map((monthData) => (
                    <div className="text-center" key={monthData.month}>
                        <h4 className="mb-4">{monthData.month}</h4>
                        {monthData.categories.map((categoryData) => (
                            <div key={categoryData.category} className="mb-6">
                                <h5 className="mb-2">{categoryData.category}</h5>
                                <div className="w-full h-72 mx-auto">
                                    <Bar data={{
                                        labels: categoryData.labels,
                                        datasets: [
                                            {
                                                label: 'Sales',
                                                data: categoryData.data,
                                                backgroundColor: '#36A2EB',
                                            },
                                        ],
                                    }} />
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Charts;
