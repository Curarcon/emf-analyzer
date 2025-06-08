class EMFDataManager {
    constructor() {
        this.processedData = {
            datetime: [],
            emf: [],
            ef: [],
            rf: [],
            rfV: []  // Nuevo array para RF en V/m
        };
        this.rawData = [];
        this.statistics = {};
    }

    processCSVData(data) {
        console.log('🔍 DEBUG DataManager: Iniciando procesamiento de', data.length, 'filas');
        
        // Limitar el número de filas para archivos muy grandes
        const maxRows = 10000; // Procesar máximo 10,000 filas
        const dataToProcess = data.length > maxRows ? data.slice(0, maxRows) : data;
        
        if (data.length > maxRows) {
            console.warn(`⚠️ Archivo muy grande (${data.length} filas). Procesando solo las primeras ${maxRows} filas.`);
        }
        
        this.processedData = {
            datetime: [],
            emf: [],
            ef: [],
            rf: [],
            rfV: []
        };

        let validRows = 0;
        let invalidRows = 0;
        
        // Procesar en lotes para evitar bloquear el navegador
        const batchSize = 1000;
        const processBatch = (startIndex) => {
            const endIndex = Math.min(startIndex + batchSize, dataToProcess.length);
            
            // En el bucle for (línea 41 aproximadamente)
            for (let i = startIndex; i < endIndex; i++) {
                const row = dataToProcess[i];
                try {
                    // Obtener valores de las columnas exactas
                    const dateTime = row['Date and Time'];
                    const emfValue = row['EMF'];
                    const efValue = row['EF'];
                    const rfValue = row['RF Power Density'];
            
                    if (i < 5) {  // Cambiar 'index' por 'i'
                        console.log(`🔍 DEBUG DataManager fila ${i}:`);
                        console.log(`  Date and Time: "${dateTime}"`);
                        console.log(`  EMF: "${emfValue}"`);
                        console.log(`  EF: "${efValue}"`);
                        console.log(`  RF Power Density: "${rfValue}"`);
                    }
            
                    if (dateTime && emfValue !== undefined && efValue !== undefined && rfValue !== undefined) {
                        // Verificar que sea una fecha válida
                        if ((dateTime.includes('/') || dateTime.includes('-')) && dateTime.includes(':')) {
                            // Convertir valores a números
                            const emf = parseFloat(emfValue);
                            const ef = parseFloat(efValue);
                            const rf = parseFloat(rfValue);
                            
                            // Calcular RF (V/m) usando la fórmula: V/m = sqrt(RF_mW/m² * 377)
                            const rfV = Math.sqrt(parseFloat(rfValue) * 377);
            
                            if (i < 5) {  // Cambiar 'index' por 'i'
                                console.log(`🔍 DEBUG DataManager fila ${i} - valores numéricos:`);
                                console.log(`  EMF: ${emf} (isNaN: ${isNaN(emf)})`);
                                console.log(`  EF: ${ef} (isNaN: ${isNaN(ef)})`);
                                console.log(`  RF: ${rf} (isNaN: ${isNaN(rf)})`);
                                console.log(`  RF (V/m): ${rfV} (isNaN: ${isNaN(rfV)})`);
                            }
            
                            // Verificar que los valores sean números válidos
                            if (!isNaN(emf) && !isNaN(ef) && !isNaN(rf) && !isNaN(rfV)) {
                                // Parsear la fecha
                                const parsedDate = new Date(dateTime);
                                
                                if (i < 5) {  // Cambiar 'index' por 'i'
                                    console.log(`🔍 DEBUG DataManager fila ${i} - fecha parseada:`, parsedDate, 'válida:', !isNaN(parsedDate.getTime()));
                                }
                                
                                if (!isNaN(parsedDate.getTime())) {
                                    this.processedData.datetime.push(parsedDate);
                                    this.processedData.emf.push(emf);
                                    this.processedData.ef.push(ef);
                                    this.processedData.rf.push(rf);
                                    this.processedData.rfV.push(rfV);
                                    validRows++;
                                } else {
                                    invalidRows++;
                                    if (i < 5) console.log(`❌ DEBUG DataManager fila ${i}: Fecha inválida`);  // Cambiar 'index' por 'i'
                                }
                            } else {
                                invalidRows++;
                                if (i < 5) console.log(`❌ DEBUG DataManager fila ${i}: Valores numéricos inválidos`);  // Cambiar 'index' por 'i'
                            }
                        } else {
                            invalidRows++;
                            if (i < 5) console.log(`❌ DEBUG DataManager fila ${i}: Formato de fecha incorrecto`);  // Cambiar 'index' por 'i'
                        }
                    } else {
                        invalidRows++;
                        if (i < 5) console.log(`❌ DEBUG DataManager fila ${i}: Campos faltantes`);  // Cambiar 'index' por 'i'
                    }
                } catch (error) {
                    invalidRows++;
                    if (i < 5) console.log(`❌ DEBUG DataManager fila ${i}: Error:`, error.message);  // Cambiar 'index' por 'i'
                }
            };
        
            if (endIndex < dataToProcess.length) {
                // Procesar el siguiente lote después de un pequeño retraso
                setTimeout(() => processBatch(endIndex), 10);
            } else {
                // Procesamiento completado
                console.log(`✅ Procesamiento completado: ${validRows} filas válidas, ${invalidRows} inválidas`);
                this.calculateStatistics();
            }
        };
        
        // Iniciar el procesamiento por lotes
        processBatch(0);
    }

    calculateStatistics() {
        this.statistics = {
            emf: this.calculateStats(this.processedData.emf),
            ef: this.calculateStats(this.processedData.ef),
            rf: this.calculateStats(this.processedData.rf),
            rfV: this.calculateStats(this.processedData.rfV)
        };
        return this.statistics;
    }

    calculateStats(data) {
        if (data.length === 0) return { max: 0, min: 0, avg: 0 };
        
        const max = Math.max(...data);
        const min = Math.min(...data);
        const avg = data.reduce((a, b) => a + b, 0) / data.length;
        return { max, min, avg };
    }

    getProcessedData() {
        return this.processedData;
    }

    getStatistics() {
        return this.statistics;
    }

    getRawData() {
        return this.rawData;
    }

    getDataSummary() {
        return {
            totalPoints: this.processedData.datetime.length,
            dateRange: {
                start: this.processedData.datetime.length > 0 ? this.processedData.datetime[0] : null,
                end: this.processedData.datetime.length > 0 ? this.processedData.datetime[this.processedData.datetime.length - 1] : null
            },
            statistics: this.statistics
        };
    }
}