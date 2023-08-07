import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, LinearScale, Tooltip, Legend, TimeScale, BarElement } from 'chart.js';
import 'chartjs-adapter-moment';
import moment from 'moment';
import axios from 'axios';
import { baseUrl } from '../helpers';
import Frontlayout from '../Front/Frontlayout';

Chart.register(LinearScale, Tooltip, Legend, TimeScale, BarElement);

const Adminreport = () => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    getChartData();
  }, []);

  const getChartData = async () => {
    try {
      const response = await axios.get(baseUrl + 'api/order-chart-data');
      console.log(response.data);
      setChartData(response.data.chartData);
    } catch (error) {
      console.error('error', error);
    }
  };

  const formattedLabels = chartData.map(item => {
    const date = moment(item.order_date);
    return date.format('YYYY-MM-DD');
  });

  const chartOptions = {
    maintainAspectRatio: false,
    responsive: true,
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'day',
          displayFormats: {
            day: 'YYYY-MM-DD',
          },
        },
        title: {
          display: true,
          text: 'Order Dates',
          font: {
            size: 14,
            weight: 'bold'
          }
        },
        ticks: {
          font: {
            size: 14, // Font size for x-axis labels
          },
        },
      },
      y: {
        title: {
          display: true, 
          text: 'Total Amount',
          font: {
            size: 14,
            weight: 'bold'
          }
        },
        ticks: {
          font: {
            size: 14, // Font size for y-axis labels
          },
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          font: {
            size: 18, // ye top pr hai
            weight: 'bold'
          },
        },
      },
    },
  };

  const chartDataConfig = {
    labels: formattedLabels, // For x-axis
    datasets: [ //for y axis
      {
        label: 'Total Amount',
        data: chartData.map(item => item.total_amount),
        backgroundColor: '#FF6347',
        borderColor: 'black',
        borderWidth: 1,
        barThickness: 40,
      },
    ],
  }; // To add more bars, copy the 'datasets' section and modify accordingly

  return (
    <Frontlayout>
      <div className="App">
        <h3>Order Amount by Date</h3>
        <div style={{ height: '400px', width: '80%', margin: '0 auto' }}>
          <Bar data={chartDataConfig} options={chartOptions} />
        </div>
      </div>
    </Frontlayout>
  );
};

export default Adminreport;
