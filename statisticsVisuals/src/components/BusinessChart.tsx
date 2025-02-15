import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";

interface BusinessData {
    id?: number;
    name?: string;
    revenue?: string | number;
    profit?: string | number;
    employees?: string | number;
    country?: string;
    total_revenue?: number;
    average_revenue?: number;
    total_employees?: number;
    company_count_per_country?: number;
    highest_revenue_per_country?: number;
    total_revenue_by_country?: number;
}

interface ChartDataType {
    labels: string[];
    datasets: { label: string; data: number[]; backgroundColor: string; }[];

}

interface BusinessChartProps {
    queryData: BusinessData[] | null;
    queryType: string | null;
}

const BusinessChart: React.FC<BusinessChartProps> = ({ queryData, queryType }) => {
    const [chartData, setChartData] = useState<ChartDataType | null>(null);

    //  Chart Options
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false, // Allows custom width/height
    };



    useEffect(() => {
        if (!queryData || !Array.isArray(queryData) || queryData.length === 0) {
            setChartData(null);
            return;
        }

        let labels: string[] = [];
        let dataValues: number[] = [];
        let labelName: string = "";

        // Determine chart data structure based on query type
        switch (queryType) {
            case "all_businesses":
                labels = queryData.map((item) => item.name || "Unknown");
                dataValues = queryData.map((item) => Number(item.revenue) || 0);
                labelName = "Revenue of All Businesses";
                break;

            case "large_employers":
                labels = queryData.map((item) => item.name || "Unknown");
                dataValues = queryData.map((item) => Number(item.total_employees) || 0);
                console.log(dataValues)
                labelName = "Employee Count of Large Employers";

                break;

            case "sorted_by_revenue":
                labels = queryData.map((item) => item.name || "Unknown");
                dataValues = queryData.map((item) => Number(item.revenue) || 0);
                labelName = "Businesses Sorted by Revenue";
                break;

            case "sorted_by_profit":
                labels = queryData.map((item) => item.name || "Unknown");
                dataValues = queryData.map((item) => Number(item.profit) || 0);
                labelName = "Businesses Sorted by Profit";
                break;

            case "total_revenue":
                labels = queryData.map((item) => item.name || "Unknown");
                dataValues = queryData.map((item) => item.total_revenue || 0);
                labelName = "Total Revenue";
                break;

            case "total_revenue_per_country":
                labels = queryData.map((item) => item.country || "Unknown");
                dataValues = queryData.map((item) => item.total_revenue_by_country || 0);
                labelName = "High Revenue Businesses";
                break;

            case "average_profit":
                labels = queryData.map((item) => item.name || "Unknown");
                dataValues = queryData.map((item) => Number(item.profit) || 0);
                labelName = "Average Profit per Business";
                break;

            case "average_revenue_per_country":
                labels = queryData.map((item) => item.country || "Unknown");
                dataValues = queryData.map((item) => item.average_revenue || 0);
                labelName = "Average Revenue per Country";
                break;

            case "company_count_per_country":
                labels = queryData.map((item) => item.country || "Unknown");
                dataValues = queryData.map((item) => item.company_count_per_country || 0);
                labelName = "Company Count per Country";
                break;

            case "highest_revenue_country":
                labels = queryData.map((item) => item.country || "Unknown");
                dataValues = queryData.map((item) => item.highest_revenue_per_country || 0);
                labelName = "Highest Revenue Countries";
                break;

            case "top_5_profitable":
                labels = queryData.map((item) => item.name || "Unknown");
                dataValues = queryData.map((item) => Number(item.profit) || 0);
                labelName = "Top 5 Profitable Companies";
                break;

            case "usa_companies":
                labels = queryData.map((item) => item.name || "Unknown");
                dataValues = queryData.map((item) => Number(item.revenue) || 0);
                labelName = "USA Companies by Revenue";
                break;

            case "low_profit":
                labels = queryData.map((item) => item.name || "Unknown");
                dataValues = queryData.map((item) => Number(item.profit) || 0);
                labelName = "Low Profit Companies";
                break;

            case "high_revenue":
                labels = queryData.map((item) => item.name || "Unknown");
                dataValues = queryData.map((item) => Number(item.revenue) || 0);
                labelName = "High Revenue Businesses";
                break;

            default:
                labels = queryData.map((item) => item.name || "Unknown");
                dataValues = queryData.map((item) => Number(item.revenue) || 0);
                labelName = "revenue of all businesses";
        }

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
    }, [queryData, queryType]);

    return (
        <>
            {chartData ? (
                <div className="bg-white shadow p-4 min-h-screen min-w-fit rounded-md mt-4">
                    {/* {queryType === "large_employers" ? (
                        <Pie data={chartData} options={chartOptions} />
                    ) : ( */}
                    <Bar data={chartData} options={chartOptions} />
                    {/* )} */}
                </div>
            ) : (
                <p className="text-gray-500 text-center"> </p>
            )}
        </>
    );
};

export default BusinessChart;