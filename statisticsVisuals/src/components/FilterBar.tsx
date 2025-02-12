/** 
 * 1. FILTER DEFINITIONS
 *    You can add/remove filter objects depending on your backend queries.
 */

const filters = [
    { key: "all_businesses", label: "All Businesses" },
    { key: "highest_revenue_company", label: "Highest Revenue Company" },
    { key: "highest_revenue_country", label: "Highest Revenue Country" },
    { key: "sorted_by_revenue", label: "Sorted by Revenue" },
    { key: "total_revenue", label: "Total Revenue" },
    { key: "total_revenue_per_country", label: "Total Revenue Per Country" },
    { key: "average_revenue_per_country", label: "Average Revenue Per Country" },
    { key: "company_count_per_country", label: "Company Count Per Country" },
    { key: "top_5_profitable", label: "Top 5 Profitable" },
    { key: "sorted_by_profit", label: "Sorted by Profit" },
    { key: "average_profit", label: "Average Profit" },
    { key: "lowest_profit_company", label: "Lowest Profit Company" },
    { key: "low_profit", label: "Low Profit" },
    { key: "large_employers", label: "Large Employers" },
    { key: "usa_companies", label: "USA Companies" },
    { key: "high_revenue", label: "High Revenue" }
];


/**
 * 2. FILTER BAR COMPONENT
 *    Renders clickable "chip" buttons for each filter.
 */


interface FilterBarProps {
    onFilterSelect: (filterKey: string) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ onFilterSelect }) => {
    return (
        <div className="flex flex-wrap gap-2 mb-6">
            {filters.map(({ key, label }) => (
                <button
                    key={key}
                    onClick={() => onFilterSelect(key)}
                    className="px-4 py-1 bg-gray-200 hover:bg-gray-300 rounded-full text-sm"
                >
                    {label}
                </button>
            ))}
        </div>
    );
};

export default FilterBar