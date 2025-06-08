class EMFFileManager {
    constructor(dataManager, uiManager) {
        this.dataManager = dataManager;
        this.uiManager = uiManager;
        this.setupFileInput();
        this.setupHistorySelector();
    }

    setupFileInput() {
        const fileInput = document.getElementById('fileInput');
        const loadFileBtn = document.getElementById('loadFile');
        
        if (fileInput && loadFileBtn) {
            loadFileBtn.addEventListener('click', () => {
                fileInput.click();
            });
            
            fileInput.addEventListener('change', (event) => {
                const file = event.target.files[0];
                if (file) {
                    this.loadFile(file);
                }
            });
        }
    }

    async loadHistoryFiles() {
        try {
            const response = await fetch('./history/');
            const text = await response.text();
            
            // Parsear el HTML para extraer los nombres de archivos
            const parser = new DOMParser();
            const doc = parser.parseFromString(text, 'text/html');
            const links = doc.querySelectorAll('a[href$=".csv"]');
            
            const files = Array.from(links).map(link => {
                const href = link.getAttribute('href');
                return href.replace('./', '');
            });
            
            return files.sort().reverse(); // Ordenar por fecha (más reciente primero)
        } catch (error) {
            console.error('Error al cargar archivos del historial:', error);
            return [];
        }
    }

    async setupHistorySelector() {
        const historySelector = document.getElementById('historyFileSelector');
        const loadHistoryBtn = document.getElementById('loadHistoryFile');
        
        if (historySelector && loadHistoryBtn) {
            // Cargar lista de archivos
            const files = await this.loadHistoryFiles();
            
            // Limpiar selector
            historySelector.innerHTML = '<option value="">Seleccionar archivo...</option>';
            
            // Agregar archivos al selector
            files.forEach(file => {
                const option = document.createElement('option');
                option.value = file;
                option.textContent = this.formatFileName(file);
                historySelector.appendChild(option);
            });
            
            // Configurar botón de carga
            loadHistoryBtn.addEventListener('click', () => {
                const selectedFile = historySelector.value;
                if (selectedFile) {
                    this.loadHistoryFile(selectedFile);
                } else {
                    this.uiManager.showError('Por favor selecciona un archivo del historial');
                }
            });
        }
    }

    formatFileName(fileName) {
        // Convertir nombre de archivo a formato legible
        // emfhistory_06082025_174645.csv -> 06/08/2025 17:46:45
        const match = fileName.match(/emfhistory_(\d{2})(\d{2})(\d{4})_(\d{2})(\d{2})(\d{2})\.csv/);
        if (match) {
            const [, day, month, year, hour, minute, second] = match;
            return `${day}/${month}/${year} ${hour}:${minute}:${second}`;
        }
        return fileName;
    }

    async loadHistoryFile(fileName) {
        try {
            this.uiManager.showLoading('Cargando archivo del historial...');
            
            const response = await fetch(`./history/${fileName}`);
            if (!response.ok) {
                throw new Error(`Error al cargar el archivo: ${response.status}`);
            }
            
            const csvText = await response.text();
            
            // Usar PapaParse para procesar el CSV
            Papa.parse(csvText, {
                header: true,
                skipEmptyLines: true,
                complete: (results) => {
                    if (results.errors.length > 0) {
                        console.warn('Errores en el parsing:', results.errors);
                    }
                    
                    this.processLoadedData(results.data, fileName);
                },
                error: (error) => {
                    this.uiManager.showError(`Error al procesar el archivo: ${error.message}`);
                }
            });
            
        } catch (error) {
            console.error('Error al cargar archivo del historial:', error);
            this.uiManager.showError(`Error al cargar el archivo: ${error.message}`);
        }
    }

    loadFile(file) {
        this.uiManager.showLoading('Procesando archivo...');
        
        const reader = new FileReader();
        reader.onload = (e) => {
            const csvText = e.target.result;
            
            // Usar PapaParse para procesar el CSV
            Papa.parse(csvText, {
                header: true,
                skipEmptyLines: true,
                complete: (results) => {
                    if (results.errors.length > 0) {
                        console.warn('Errores en el parsing:', results.errors);
                    }
                    
                    this.processLoadedData(results.data, file.name);
                },
                error: (error) => {
                    this.uiManager.showError(`Error al procesar el archivo: ${error.message}`);
                }
            });
        };
        
        reader.onerror = () => {
            this.uiManager.showError('Error al leer el archivo');
        };
        
        reader.readAsText(file);
    }

    processLoadedData(csvData, fileName) {
        try {
            console.log('Datos CSV cargados:', csvData.length, 'filas');
            
            if (csvData.length === 0) {
                this.uiManager.showError('El archivo está vacío o no contiene datos válidos');
                return;
            }
            
            // Procesar datos con el DataManager
            const processedData = this.dataManager.processCSVData(csvData);
            
            if (processedData.datetime.length === 0) {
                this.uiManager.showError('No se pudieron procesar los datos del archivo');
                return;
            }
            
            // Calcular estadísticas
            const statistics = this.dataManager.calculateStatistics();
            
            // Actualizar UI
            this.uiManager.hideLoading();
            this.uiManager.updateFileInfo(fileName);
            this.uiManager.updateStatistics(statistics);
            this.uiManager.showSuccess(`Archivo cargado exitosamente: ${processedData.datetime.length} registros procesados`);
            
            console.log('Archivo procesado exitosamente:', {
                fileName,
                records: processedData.datetime.length,
                statistics
            });
            
        } catch (error) {
            console.error('Error al procesar datos:', error);
            this.uiManager.showError(`Error al procesar los datos: ${error.message}`);
        }
    }
}