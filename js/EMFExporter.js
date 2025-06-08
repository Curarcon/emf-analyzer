class EMFExporter {
    static exportChart(chartId, filename) {
        const chartElement = document.getElementById(chartId);
        if (!chartElement) {
            console.error(`No se encontró el elemento del gráfico: ${chartId}`);
            return;
        }

        // Usar Plotly para exportar como imagen PNG
        Plotly.toImage(chartElement, {
            format: 'png',
            width: 1200,
            height: 600,
            scale: 2
        }).then(function(dataURL) {
            // Crear enlace de descarga
            const link = document.createElement('a');
            link.download = filename || `${chartId}_export.png`;
            link.href = dataURL;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }).catch(function(error) {
            console.error('Error al exportar gráfico:', error);
            alert('Error al exportar el gráfico');
        });
    }

    static async exportAllCharts() {
        const charts = [
            { id: 'emfChart', name: 'EMF_Chart' },
            { id: 'efChart', name: 'EF_Chart' },
            { id: 'rfChart', name: 'RF_Power_Chart' },
            { id: 'rfVoltageChart', name: 'RF_Voltage_Chart' }
        ];

        const timestamp = new Date().toISOString().slice(0, 19).replace(/[:-]/g, '');
        
        for (let i = 0; i < charts.length; i++) {
            const chart = charts[i];
            const filename = `${chart.name}_${timestamp}.png`;
            
            try {
                await this.exportChart(chart.id, filename);
                // Pequeña pausa entre exportaciones
                await new Promise(resolve => setTimeout(resolve, 500));
            } catch (error) {
                console.error(`Error al exportar ${chart.name}:`, error);
            }
        }
    }

    static generateReport() {
        if (!window.emfApp || !window.emfApp.dataManager) {
            alert('No hay datos cargados para generar el reporte');
            return;
        }

        const dataManager = window.emfApp.dataManager;
        const statistics = dataManager.getStatistics();
        const dataSummary = dataManager.getDataSummary();
        
        const reportHTML = `
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Reporte de Análisis EMF</title>
            <style>
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    margin: 0;
                    padding: 20px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: #333;
                }
                .container {
                    max-width: 800px;
                    margin: 0 auto;
                    background: white;
                    border-radius: 15px;
                    padding: 30px;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
                }
                .header {
                    text-align: center;
                    margin-bottom: 30px;
                    padding-bottom: 20px;
                    border-bottom: 2px solid #667eea;
                }
                .header h1 {
                    color: #667eea;
                    margin: 0;
                    font-size: 2.5em;
                }
                .header p {
                    color: #666;
                    margin: 10px 0 0 0;
                    font-size: 1.1em;
                }
                .section {
                    margin: 25px 0;
                    padding: 20px;
                    background: #f8f9fa;
                    border-radius: 10px;
                    border-left: 4px solid #667eea;
                }
                .section h2 {
                    color: #667eea;
                    margin-top: 0;
                    font-size: 1.5em;
                }
                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 15px;
                    margin: 15px 0;
                }
                .stat-card {
                    background: white;
                    padding: 15px;
                    border-radius: 8px;
                    text-align: center;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                }
                .stat-card h3 {
                    margin: 0 0 10px 0;
                    color: #667eea;
                    font-size: 1.1em;
                }
                .stat-value {
                    font-size: 1.8em;
                    font-weight: bold;
                    color: #333;
                    margin: 5px 0;
                }
                .stat-unit {
                    color: #666;
                    font-size: 0.9em;
                }
                .info-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 15px;
                }
                .info-item {
                    background: white;
                    padding: 15px;
                    border-radius: 8px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                }
                .info-item strong {
                    color: #667eea;
                }
                @media print {
                    body { background: white; }
                    .container { box-shadow: none; }
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>📊 Reporte de Análisis EMF</h1>
                    <p>Generado el ${new Date().toLocaleString('es-ES')}</p>
                </div>
                
                <div class="section">
                    <h2>📋 Resumen de Datos</h2>
                    <div class="info-grid">
                        <div class="info-item">
                            <strong>Registros Procesados:</strong><br>
                            ${dataSummary.totalRecords.toLocaleString()}
                        </div>
                        <div class="info-item">
                            <strong>Período de Medición:</strong><br>
                            ${dataSummary.dateRange.start} - ${dataSummary.dateRange.end}
                        </div>
                    </div>
                </div>
                
                <div class="section">
                    <h2>📊 Estadísticas de Campo EMF</h2>
                    <div class="stats-grid">
                        <div class="stat-card">
                            <h3>Máximo</h3>
                            <div class="stat-value">${statistics.emf.max.toFixed(2)}</div>
                            <div class="stat-unit">mG</div>
                        </div>
                        <div class="stat-card">
                            <h3>Promedio</h3>
                            <div class="stat-value">${statistics.emf.avg.toFixed(2)}</div>
                            <div class="stat-unit">mG</div>
                        </div>
                        <div class="stat-card">
                            <h3>Mínimo</h3>
                            <div class="stat-value">${statistics.emf.min.toFixed(2)}</div>
                            <div class="stat-unit">mG</div>
                        </div>
                    </div>
                </div>
                
                <div class="section">
                    <h2>⚡ Estadísticas de Campo EF</h2>
                    <div class="stats-grid">
                        <div class="stat-card">
                            <h3>Máximo</h3>
                            <div class="stat-value">${statistics.ef.max.toFixed(2)}</div>
                            <div class="stat-unit">V/m</div>
                        </div>
                        <div class="stat-card">
                            <h3>Promedio</h3>
                            <div class="stat-value">${statistics.ef.avg.toFixed(2)}</div>
                            <div class="stat-unit">V/m</div>
                        </div>
                        <div class="stat-card">
                            <h3>Mínimo</h3>
                            <div class="stat-value">${statistics.ef.min.toFixed(2)}</div>
                            <div class="stat-unit">V/m</div>
                        </div>
                    </div>
                </div>
                
                <div class="section">
                    <h2>📡 Estadísticas de RF (Potencia)</h2>
                    <div class="stats-grid">
                        <div class="stat-card">
                            <h3>Máximo</h3>
                            <div class="stat-value">${statistics.rf.max.toFixed(4)}</div>
                            <div class="stat-unit">mW/m²</div>
                        </div>
                        <div class="stat-card">
                            <h3>Promedio</h3>
                            <div class="stat-value">${statistics.rf.avg.toFixed(4)}</div>
                            <div class="stat-unit">mW/m²</div>
                        </div>
                        <div class="stat-card">
                            <h3>Mínimo</h3>
                            <div class="stat-value">${statistics.rf.min.toFixed(4)}</div>
                            <div class="stat-unit">mW/m²</div>
                        </div>
                    </div>
                </div>
                
                <div class="section">
                    <h2>📶 Estadísticas de RF (Voltaje)</h2>
                    <div class="stats-grid">
                        <div class="stat-card">
                            <h3>Máximo</h3>
                            <div class="stat-value">${statistics.rfVoltage.max.toFixed(4)}</div>
                            <div class="stat-unit">V/m</div>
                        </div>
                        <div class="stat-card">
                            <h3>Promedio</h3>
                            <div class="stat-value">${statistics.rfVoltage.avg.toFixed(4)}</div>
                            <div class="stat-unit">V/m</div>
                        </div>
                        <div class="stat-card">
                            <h3>Mínimo</h3>
                            <div class="stat-value">${statistics.rfVoltage.min.toFixed(4)}</div>
                            <div class="stat-unit">V/m</div>
                        </div>
                    </div>
                </div>
            </div>
        </body>
        </html>
        `;
        
        // Abrir en nueva ventana para imprimir
        const printWindow = window.open('', '_blank');
        printWindow.document.write(reportHTML);
        printWindow.document.close();
        
        // Esperar a que se cargue y luego mostrar diálogo de impresión
        printWindow.onload = function() {
            setTimeout(() => {
                printWindow.print();
            }, 500);
        };
    }
}