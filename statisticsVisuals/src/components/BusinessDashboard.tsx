import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import FilterBar from "./FilterBar";

interface BusinessData {
  id?: number;
  name?: string;
  revenue?: number;
  profit?: number;
  employees?: number;
  country?: string;
  total_revenue?: number;
  average_revenue?: number;
  company_count_per_country?: number;
  highest_revenue_per_country?: number;
  total_revenue_by_country: number;
}

interface ChartDataType {
  labels: string[];
  datasets: { label: string; data: number[]; backgroundColor: string }[];
}

const BusinessDashboard: React.FC = () => {
  const [queryData, setQueryData] = useState<BusinessData[] | BusinessData | null>(null);
  const [chartData, setChartData] = useState<ChartDataType | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [sortColumn, setSortColumn] = useState<keyof BusinessData | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");


  const fetchQueryData = async (queryType: string) => {
    setLoading(true);
    try {
      const response = await axios.get<BusinessData[] | BusinessData>(
        `http://127.0.0.1:8000/api/business/queries/${queryType}/`
      );
      setQueryData(response.data);

      if (Array.isArray(response.data) && response.data.length > 0) {
        let labels: string[] = [];
        let dataValues: number[] = [];
        let labelName: string = "";

        // Determine chart data structure based on query type
        switch (queryType) {
          case "all_businesses":
            labels = response.data.map((item) => item.name || "Unknown");
            dataValues = response.data.map((item) => item.revenue || 0);
            labelName = "Revenue of All Businesses";
            break;

          case "large_employers":
            labels = response.data.map((item) => item.name || "Unknown");
            dataValues = response.data.map((item) => item.employees || 0);
            labelName = "Employee Count of Large Employers";
            break;

          case "sorted_by_revenue":
            labels = response.data.map((item) => item.name || "Unknown");
            dataValues = response.data.map((item) => item.revenue || 0);
            labelName = "Businesses Sorted by Revenue";
            break;

          case "sorted_by_profit":
            labels = response.data.map((item) => item.name || "Unknown");
            dataValues = response.data.map((item) => item.profit || 0);
            labelName = "Businesses Sorted by Profit";
            break;

          case "total_revenue":
            labels = response.data.map((item) => item.name || "Unknown");
            dataValues = response.data.map((item) => item.total_revenue || 0);
            labelName = "Total Revenue";
            break;

          case "total_revenue_per_country":
            labels = response.data.map((item) => item.country || "Unknown");
            dataValues = response.data.map((item) => item.total_revenue_by_country || 0);
            labelName = "High Revenue Businesses";
            break;

          case "average_profit":
            labels = response.data.map((item) => item.name || "Unknown");
            dataValues = response.data.map((item) => item.profit || 0);
            labelName = "Average Profit per Business";
            break;

          case "average_revenue_per_country":
            labels = response.data.map((item) => item.country || "Unknown");
            dataValues = response.data.map((item) => item.average_revenue || 0);
            labelName = "Average Revenue per Country";
            break;

          case "company_count_per_country":
            labels = response.data.map((item) => item.country || "Unknown");
            dataValues = response.data.map((item) => item.company_count_per_country || 0);
            labelName = "Company Count per Country";
            break;

          case "highest_revenue_country":
            labels = response.data.map((item) => item.country || "Unknown");
            dataValues = response.data.map((item) => item.highest_revenue_per_country || 0);
            labelName = "Highest Revenue Countries";
            break;

          case "top_5_profitable":
            labels = response.data.map((item) => item.name || "Unknown");
            dataValues = response.data.map((item) => item.profit || 0);
            labelName = "Top 5 Profitable Companies";
            break;

          case "usa_companies":
            labels = response.data.map((item) => item.name || "Unknown");
            dataValues = response.data.map((item) => item.revenue || 0);
            labelName = "USA Companies by Revenue";
            break;

          case "low_profit":
            labels = response.data.map((item) => item.name || "Unknown");
            dataValues = response.data.map((item) => item.profit || 0);
            labelName = "Low Profit Companies";
            break;

          case "high_revenue":
            labels = response.data.map((item) => item.name || "Unknown");
            dataValues = response.data.map((item) => item.revenue || 0);
            labelName = "High Revenue Businesses";
            break;

          default:
            labels = response.data.map((item) => item.name || "Unknown");
            dataValues = response.data.map((item) => item.revenue || 0);
            labelName = queryType.replace(/_/g, " ").toUpperCase();
        }

        // Set chart data
        setChartData({
          labels,
          datasets: [
            {
              label: labelName,
              data: dataValues,
              backgroundColor: "rgba(75, 192, 192, 0.6)",
            },
          ],
        });
      } else {
        setChartData(null);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Failed to fetch data.");
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchQueryData("all_businesses");
  }, []);

  /** SORTING LOGIC **/
  const handleSort = (column: keyof BusinessData) => {
    const order = sortColumn === column && sortOrder === "asc" ? "desc" : "asc";
    setSortColumn(column);
    setSortOrder(order);

    if (Array.isArray(queryData)) {
      const sortedData = [...queryData].sort((a, b) => {
        const valueA = a[column] ?? "";
        const valueB = b[column] ?? "";

        if (typeof valueA === "number" && typeof valueB === "number") {
          return order === "asc" ? valueA - valueB : valueB - valueA;
        }

        return order === "asc"
          ? String(valueA).localeCompare(String(valueB))
          : String(valueB).localeCompare(String(valueA));
      });

      setQueryData(sortedData);
    }
  };

  /** FUNCTION TO DISPLAY SORT ICONS **/
  const getSortIndicator = (column: keyof BusinessData) => {
    if (sortColumn === column) {
      return sortOrder === "asc" ? "↑" : "↓";
    }
    return "↕";
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Business Data Dashboard</h2>

      <FilterBar onFilterSelect={fetchQueryData} />

      {loading && <p className="text-gray-500 mb-2">Loading...</p>}

      {queryData && (
        <div className="bg-white shadow p-4 rounded-md">
          <div className="max-h-screen overflow-y-scroll "> {/* Enables scrolling */}
            <table className="min-w-full border border-gray-200 text-sm">
              <thead>
                <tr className="bg-gray-100">
                  {Object.keys(Array.isArray(queryData) ? queryData[0] : queryData).map((key) => (
                    <th
                      key={key}
                      className="border px-2 py-1 text-left cursor-pointer"
                      onClick={() => handleSort(key as keyof BusinessData)}
                    >
                      {key.toUpperCase()} {getSortIndicator(key as keyof BusinessData)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.isArray(queryData) ? (
                  queryData.map((row, idx) => (
                    <tr key={idx} className="border">
                      {Object.values(row).map((val, i) => (
                        <td key={i} className="border px-2 py-1">
                          {typeof val === "number" ? val.toLocaleString() : (val as string)}
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    {Object.values(queryData).map((val, i) => (
                      <td key={i} className="border px-2 py-1">
                        {typeof val === "number" ? val.toLocaleString() : (val as string)}
                      </td>
                    ))}
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {chartData && (
        <div className="bg-white shadow p-4 rounded-md mt-4">
          <Bar data={chartData} />
        </div>
      )}
    </div>
  );
};

export default BusinessDashboard;