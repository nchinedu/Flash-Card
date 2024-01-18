const urlParams = new URLSearchParams(window.location.search);
// Check if the chart is already rendered
const resultsChart = document.getElementById('results-chart');
if (!resultsChart.classList.contains('chart-rendered')) {
    // Create chart data
    const correctPercentage = parseFloat(urlParams.get('correctPercentage'));
    const incorrectPercentage = parseFloat(urlParams.get('incorrectPercentage'));

    // Create chart data
    const chartData = {
        labels: ['Correct', 'Incorrect'],
        datasets: [{
            data: [correctPercentage, incorrectPercentage],
            backgroundColor: ['#4caf50', '#e53935'],
        }]
    };

    // Create chart options
    const chartOptions = {
        responsive: false,
        maintainAspectRatio: false,
        width: 400,
        height: 400
    };

    // Create the chart
    const ctx = resultsChart.getContext('2d');
    new Chart(ctx, {
        type: 'doughnut',
        data: chartData,
        options: chartOptions,
    });

    // Add a class to indicate that the chart is rendered
    resultsChart.classList.add('chart-rendered');
}