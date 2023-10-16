import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {Chart,LinearScale,Tooltip,Legend,TimeScale,BarElement} from "chart.js";
import "chartjs-adapter-moment";
import moment from "moment";
import axios from "axios";
import { find } from "lodash";
import _ from "lodash";
import { baseUrl, priceFormat } from "../helpers";
import Frontlayout from "../Front/Frontlayout";
// import ReactHTMLTableToExcel from "react-html-table-to-excel";
import { Button, Container, Table } from "react-bootstrap";

Chart.register(LinearScale, Tooltip, Legend, TimeScale, BarElement);

const Adminreport = () => {
  const [chartData, setChartData] = useState([]);
  const [targetMonth, setTargetMonth] = useState(moment().format("YYYY-MM"));
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [excelUrl, setExcelUrl] = useState("");

  useEffect(() => {
    getChartData();
  }, [targetMonth]);

  const getChartData = async () => {
    try {
      const response = await axios.get(baseUrl + "api/order-chart-data");
      // console.log(response.data);
      const chartData = _.get(response, 'data.chartData');
      setChartData(chartData);
      const excelUrl = _.get(response, 'data.excelUrl')
      setExcelUrl(excelUrl);
    } catch (error) {
      console.error("error", error);
    }
  };

  const previousMonth = () => {
    const lastMonth = moment(targetMonth)
      .subtract(1, "month")
      .format("YYYY-MM");
    setTargetMonth(lastMonth);
  };

  const nextMonth = () => {
    const nextMonth = moment(targetMonth).add(1, "month").format("YYYY-MM");
    setTargetMonth(nextMonth);
  };

  const monthDates = (year, month) => {
    const daysInMonth = moment(`${year}-${month}`, "YYYY-MM").daysInMonth();
    // console.log(daysInMonth);
    //daysinmonth function to calculate total no of days in month
    const dates = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const date = moment(`${year}-${month}-${day}`, "YYYY-MM-DD");
      dates.push(date);
    }
    return dates;
    // console.log(dates);
  };

  const monthDate = monthDates(
    moment(targetMonth).year(),
    moment(targetMonth).month() + 1
  );

  let chartDataConfig = {
    labels: monthDate.map((date) => date.format("YYYY-MM-DD")),
    datasets: [
      {
        label: "Total Amount",
        data: monthDate.map((date) => {
          const dateData = find(chartData, (item) =>
            moment(item.order_date).isSame(date, "day") //isSame is moment function
          );
          return dateData ? dateData.total_amount : 0;
        }),
        backgroundColor: "rgb(245 32 46)",
        borderColor: "black",
        borderWidth: 1,
        barThickness: 40,
      },
    ],
  };

  const chartOptions = {
    maintainAspectRatio: false,
    responsive: true,
    scales: {
      x: {
        type: "time",
        time: {
          unit: "day",
          displayFormats: {
            day: "DD-MM-YYYY",
          },
        },
        title: {
          display: true,
          text: "Order Dates",
          font: {
            size: 14,
            weight: "bold",
          },
        },
        ticks: {
          font: {
            size: 14,
          },
        },
      },
      y: {
        title: {
          display: true,
          text: "Total Amount",
          font: {
            size: 14,
            weight: "bold",
          },
        },
        ticks: {
          font: {
            size: 14,
          },
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          font: {
            size: 18,
            weight: "bold",
          },
        },
      },
    },
  };

  const filterData = () => {
    if (startDate !== null && endDate !== null) {
      const filteredDates = monthDate.filter((date) =>
        date.isBetween(moment(startDate), moment(endDate), null, "[]")
      );

      const filteredAmounts = filteredDates.map((date) => {
        const dateData = chartData.find((item) =>
          moment(item.order_date).isSame(date, "day")
        );
        return dateData ? dateData.total_amount : 0;
      });

      const newChartDataConfig = {
        ...chartDataConfig,
        labels: filteredDates.map((date) => date.format("YYYY-MM-DD")),
        datasets: [
          {
            ...chartDataConfig.datasets[0],
            data: filteredAmounts,
          },
        ],
      };

      return newChartDataConfig;
    } else {
      return chartDataConfig;
    }
  };

  return (
    <Frontlayout>
      <div style={{ backgroundColor: "#cbcbcb" }}>
        <Container>
          <div className="App">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h3 style={{ textAlign: "center" }}>Order Report</h3>
              <div style={{ display: "flex", alignItems: "right" }}>
                <input
                  onChange={(e) => setStartDate(e.target.value)}
                  type="date"
                  value={startDate}
                />
                <input
                  onChange={(e) => setEndDate(e.target.value)}
                  type="date"
                  value={endDate}
                />
              </div>
            </div>

            <div style={{ height: "400px", width: "100%", margin: "0 auto" }}>
              <Bar data={filterData()} options={chartOptions} />
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Button onClick={previousMonth} variant="dark">
                Previous Month
              </Button>
              {targetMonth !== moment().format("YYYY-MM") && (
                <Button onClick={nextMonth} variant="dark">
                  Next Month
                </Button>
              )}
            </div>
          </div>
          <br />
          <div>
            <h5>Order Details</h5>
            <div>
              {excelUrl && (
                <Button variant="dark">
                  <a
                    href={baseUrl + "excelsheets/order-chart.xlsx"}
                    download="order-chart.xlsx"
                    style={{
                      textDecoration: "none",
                      color: "white",
                    }}
                  >
                    Download as Excel File
                  </a>
                </Button>
              )}
            </div>
            {/* <ReactHTMLTableToExcel
              id="test-table-xls-button"
              className="download-table-xls-button"
              table="table-to-xls"
              filename="tablexls"
              sheet="tablexls"
              buttonText="Download"
              variant="dark"
            /> */}
            <br />
            <Table id="table-to-xls" striped bordered hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Order Date</th>
                  <th>Total Amount</th>
                  <th>Total Orders</th>
                </tr>
              </thead>
              <tbody>
                {chartData.map((data, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{moment(data.order_date).format("DD-MM-YYYY")}</td>
                    <td>
                      {priceFormat()}
                      {data.total_amount}
                    </td>
                    <td>{data.total_orders}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Container>
      </div>
    </Frontlayout>
  );
};

export default Adminreport;
