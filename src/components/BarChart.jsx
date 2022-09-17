import React from "react";

import { Bar } from "react-chartjs-2";
// disable lint, ChartJS need to be imported to render Chart
// eslint-disable-next-line
import { Chart as ChartJS } from "chart.js/auto";

const BarChart = ({ ongoingCount, completedCount, overdueCount }) => {
  return (
    <>
      <h6 className="text-center fw-bold">Total tasks chart</h6>

      <Bar
        data={{
          labels: ["Tasks"],
          datasets: [
            {
              label: "On Going",
              backgroundColor: ["#5DB7DE"],
              data: [ongoingCount]
            },
            {
              label: "Completed (On Time)",
              backgroundColor: "#198754",
              data: [completedCount - overdueCount]
            },
            {
              label: "Completed (Overdue)",
              backgroundColor: "#DC3545",
              data: [overdueCount]
            }
          ]
        }}
        options={{
          indexAxis: "y",
          maintainAspectRatio: true,
          responsive: true,
          plugins: {
            legend: {
              labels: {
                usePointStyle: true,
                font: {
                  size: 11
                },
                padding: 12
              },
              position: "bottom"
            }
          },
          scale: {
            x: {
              beginAtZero: true
            },
            ticks: {
              precision: 0
            }
          }
        }}
      />
    </>
  );
};

export default BarChart;
