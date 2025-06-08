class EMFChartManager {
    constructor() {
        this.charts = {};
        this.config = {
            responsive: true,
            displayModeBar: true,
            modeBarButtonsToRemove: ['pan2d', 'select2d', 'lasso2d', 'autoScale2d'],
            displaylogo: false
        };
    }

    createCharts(data) {
        console.log('Creando gráficas con datos:', data);
        
        if (!data || !data.datetime || data.datetime.length === 0) {
            console.error('No hay datos para crear gráficas');
            return;
        }

        // Crear gráfica EMF
        this.createEMFChart(data);
        
        // Crear gráfica EF
        this.createEFChart(data);
        
        // Crear gráfica RF Power
        this.createRFChart(data);
        
        // Crear gráfica RF Voltage
        this.createRFVoltageChart(data);
    }

    createEMFChart(data) {
        const trace = {
            x: data.datetime,
            y: data.emf,
            type: 'scatter',
            mode: 'lines',
            name: 'EMF',
            line: {
                color: '#00d4ff',
                width: 2
            },
            hovertemplate: '<b>%{fullData.name}</b><br>' +
                          'Tiempo: %{x}<br>' +
                          'Valor: %{y:.2f} mG<br>' +
                          '<extra></extra>'
        };

        const layout = {
            title: {
                text: '📊 Campo Electromagnético (EMF)',
                font: { color: '#4ade80', size: 16 }
            },
            xaxis: {
                title: 'Tiempo',
                color: '#e0e0e0',
                gridcolor: 'rgba(255,255,255,0.1)'
            },
            yaxis: {
                title: 'EMF (mG)',
                color: '#e0e0e0',
                gridcolor: 'rgba(255,255,255,0.1)'
            },
            plot_bgcolor: 'rgba(0,0,0,0)',
            paper_bgcolor: 'rgba(0,0,0,0)',
            font: { color: '#e0e0e0' },
            margin: { t: 50, r: 30, b: 50, l: 60 }
        };

        Plotly.newPlot('emfChart', [trace], layout, this.config);
        this.charts.emf = { data: [trace], layout: layout };
    }

    createEFChart(data) {
        const trace = {
            x: data.datetime,
            y: data.ef,
            type: 'scatter',
            mode: 'lines',
            name: 'EF',
            line: {
                color: '#ff6b6b',
                width: 2
            },
            hovertemplate: '<b>%{fullData.name}</b><br>' +
                          'Tiempo: %{x}<br>' +
                          'Valor: %{y:.2f} V/m<br>' +
                          '<extra></extra>'
        };

        const layout = {
            title: {
                text: '⚡ Campo Eléctrico (EF)',
                font: { color: '#4ade80', size: 16 }
            },
            xaxis: {
                title: 'Tiempo',
                color: '#e0e0e0',
                gridcolor: 'rgba(255,255,255,0.1)'
            },
            yaxis: {
                title: 'EF (V/m)',
                color: '#e0e0e0',
                gridcolor: 'rgba(255,255,255,0.1)'
            },
            plot_bgcolor: 'rgba(0,0,0,0)',
            paper_bgcolor: 'rgba(0,0,0,0)',
            font: { color: '#e0e0e0' },
            margin: { t: 50, r: 30, b: 50, l: 60 }
        };

        Plotly.newPlot('efChart', [trace], layout, this.config);
        this.charts.ef = { data: [trace], layout: layout };
    }

    createRFChart(data) {
        const trace = {
            x: data.datetime,
            y: data.rf,
            type: 'scatter',
            mode: 'lines',
            name: 'RF Power',
            line: {
                color: '#4ecdc4',
                width: 2
            },
            hovertemplate: '<b>%{fullData.name}</b><br>' +
                          'Tiempo: %{x}<br>' +
                          'Valor: %{y:.4f} mW/m²<br>' +
                          '<extra></extra>'
        };

        const layout = {
            title: {
                text: '📡 Radiofrecuencia - Potencia (RF)',
                font: { color: '#4ade80', size: 16 }
            },
            xaxis: {
                title: 'Tiempo',
                color: '#e0e0e0',
                gridcolor: 'rgba(255,255,255,0.1)'
            },
            yaxis: {
                title: 'RF Power (mW/m²)',
                color: '#e0e0e0',
                gridcolor: 'rgba(255,255,255,0.1)'
            },
            plot_bgcolor: 'rgba(0,0,0,0)',
            paper_bgcolor: 'rgba(0,0,0,0)',
            font: { color: '#e0e0e0' },
            margin: { t: 50, r: 30, b: 50, l: 60 }
        };

        Plotly.newPlot('rfChart', [trace], layout, this.config);
        this.charts.rf = { data: [trace], layout: layout };
    }

    createRFVoltageChart(data) {
        const trace = {
            x: data.datetime,
            y: data.rfVoltage,
            type: 'scatter',
            mode: 'lines',
            name: 'RF Voltage',
            line: {
                color: '#ffd93d',
                width: 2
            },
            hovertemplate: '<b>%{fullData.name}</b><br>' +
                          'Tiempo: %{x}<br>' +
                          'Valor: %{y:.4f} V/m<br>' +
                          '<extra></extra>'
        };

        const layout = {
            title: {
                text: '📶 Radiofrecuencia - Voltaje (RF)',
                font: { color: '#4ade80', size: 16 }
            },
            xaxis: {
                title: 'Tiempo',
                color: '#e0e0e0',
                gridcolor: 'rgba(255,255,255,0.1)'
            },
            yaxis: {
                title: 'RF Voltage (V/m)',
                color: '#e0e0e0',
                gridcolor: 'rgba(255,255,255,0.1)'
            },
            plot_bgcolor: 'rgba(0,0,0,0)',
            paper_bgcolor: 'rgba(0,0,0,0)',
            font: { color: '#e0e0e0' },
            margin: { t: 50, r: 30, b: 50, l: 60 }
        };

        Plotly.newPlot('rfVoltageChart', [trace], layout, this.config);
        this.charts.rfVoltage = { data: [trace], layout: layout };
    }

    getChart(chartType) {
        return this.charts[chartType];
    }

    getAllCharts() {
        return this.charts;
    }

    clearCharts() {
        Object.keys(this.charts).forEach(chartType => {
            const chartElement = document.getElementById(chartType + 'Chart');
            if (chartElement) {
                Plotly.purge(chartElement);
            }
        });
        this.charts = {};
    }
}