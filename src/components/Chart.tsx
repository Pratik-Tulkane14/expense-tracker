import { PieChart, Pie, Tooltip, ResponsiveContainer } from 'recharts';
import { useEffect, useState } from 'react';
const Chart = () => {
    const [chartData, setChartData] = useState<[]>([]);
    useEffect(() => {
        const expensesList = localStorage.getItem("expensesList");
        if (expensesList) {
            const parsedData = JSON.parse(expensesList)
            const result = parsedData.map(element => ({
                name: element.title.charAt(0).toUpperCase()+ element.title.slice(1),
                price: parseInt(element.price),
                category: element.category,
                date: element.date,


            }));
            setChartData(result)
        }
    }, []);
    return (
        <>

            {/* <ResponsiveContainer width="100%" height="100%"> */}
            <PieChart
                width={300} height={300}
            >
                <Pie
                    dataKey="price"
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#FF9304"
                    label
                />
                <Tooltip />
            </PieChart>

            {/* </ResponsiveContainer> */}
        </>
    )
}

export default Chart