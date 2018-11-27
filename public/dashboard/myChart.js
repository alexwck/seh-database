function float2dollar(value){
    return "U$ "+(value).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}

function renderChart(data, labels){
    let ctx = document.getElementById("myChart").getContext('2d');
        
    // Global Options
    // Chart.defaults.line.spanGaps = true;

    // Chart.defaults.global.elements.point.backgroundColor = 'red';
    // Chart.defaults.global.elements.point.borderWidth = 3;
    // Chart.defaults.global.elements.point.borderColor = 'red';

    // Chart.defaults.global.elements.line.backgroundColor = 'rgba(0, 0, 0, 0)';
    // Chart.defaults.global.elements.line.borderWidth = 1;
    // Chart.defaults.global.elements.line.borderColor = '#000';

    let myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                // pointHoverBackgroundColor: 'blue',
                // pointHoverBorderColor: 'blue',
                // pointHoverBorderWidth: 3,

                label: 'This week',
                data: data,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        callback: function(value, index, values) {
                            return float2dollar(value);
                        }
                    }
                }]                
            },
            legend:{
                position: 'bottom'
            },
            title:{
                display: true,
                fontSize: 18,
                text: "Graph of Yield against Machines"
            },
        }
    });
}

function getChartData() {
    $("#loadingMessage").html('<img src="../image/giphy.gif">');
    let data = [20000, 14000, 12000, 15000, 18000, 19000, 22000];
    let labels =  ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    renderChart(data, labels);
    // $.ajax({
    //     url: "http://localhost:3000/chartdata",
    //     success: function (result) {
    //         $("#loadingMessage").html("");
    //         var data = [];
    //         data.push(result.thisWeek);
    //         data.push(result.lastWeek);
    //         var labels = result.labels;
    //         renderChart(data, labels);
    //     },
    //     error: function (err) {
    //         $("#loadingMessage").html("Error");
    //     }
    // });
}

$("#renderBtn").click(
    function(){
        getChartData();
    }
);