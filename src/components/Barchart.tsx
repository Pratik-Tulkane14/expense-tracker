import React, { useEffect, useState } from 'react'
import { BarChart } from '@mantine/charts';
const Barchart = () => {
    const [chartData, setChartData] = useState<[]>([]);
    useEffect(() => {
        const expensesList = localStorage.getItem("expensesList");
        if (expensesList) {
            const parsedData = JSON.parse(expensesList)
            const result = parsedData.map(element => ({
                name: element.title.charAt(0).toUpperCase()+ element.title.slice(1),
                Price: parseInt(element.price),
                category: element.category.charAt(0).toUpperCase() + element.category.slice(1),
                date: element.date,


            }));
            setChartData(result)
        }
    }, []);
  return (
    <>
          <BarChart
              h={200}
              data={chartData}
              dataKey="category"
              orientation="vertical"
              yAxisProps={{ width: 80 }}
              barProps={{ radius: 10 }}
              series={[{ name: 'Price', color: 'violet' }]}
          />
    </>
  )
}

export default Barchart