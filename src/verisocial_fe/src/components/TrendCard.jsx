import React from "react";
import { Box, Text, Flex } from "@chakra-ui/react";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

// Temp Data
const TrendCard = () => {
    const labels = Array.from({ length: 30 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (29 - i));
        return date.toLocaleDateString("en-US", { day: "numeric", month: "short" });
    });

    const botData = Array.from({ length: 30 }, () => Math.floor(Math.random() * 10) + 1);

    const totalBots = botData.reduce((acc, count) => acc + count, 0);
    const todayBots = botData[botData.length - 1];

    // Temp Data
    const data = {
        labels,
        datasets: [
            {
                label: "Bots Detected",
                data: botData,
                borderColor: "#9f7aea",
                backgroundColor: "rgba(107, 70, 193, 0.2)",
                borderWidth: 2,
                tension: 0.4,
                pointBackgroundColor: "#d6bcfa",
            },
        ],
    };

    const options = {
        plugins: {
            legend: {
                position: "bottom",
            },
            tooltip: {
                enabled: false,
            },
        },
        scales: {
            x: {
                grid: {
                    display: false,
                },
            },
            y: {
                beginAtZero: true,
            },
        },
    };

    return (
        <Box
            bg="white"
            borderWidth="1px"
            borderRadius="md"
            p="2%"
            boxShadow="md"
            w="100%"
            textAlign="center"
            h="25vh"
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
        >
            <Text textStyle="h3" mb={2}>
                Bots Detected over time
            </Text>


            <Box flex="1" minH="10vh">
                <Line data={data} options={options} />
            </Box>

            <Flex justifyContent="space-between" mt={2} fontSize={{ base: "xs", md: "sm" }}>
                <Text fontWeight="bold">Total Detected: {totalBots}</Text>
                <Text textStyle="label">
                    Detected Today: {todayBots}
                </Text>
            </Flex>
        </Box>
    );
};

export default TrendCard;
