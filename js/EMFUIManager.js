class EMFUIManager {
    constructor() {
        this.elements = {
            fileInfo: document.getElementById('fileInfo'),
            loading: document.getElementById('loading'),
            error: document.getElementById('error'),
            statsSection: document.getElementById('statsSection'),
            chartsSection: document.getElementById('chartsSection'),
            toolbar: document.getElementById('toolbar'),
            visualizeBtn: document.getElementById('visualizeBtn')
        };
        
        // Configurar el botón de visualización
        if (this.elements.visualizeBtn) {
            this.elements.visualizeBtn.addEventListener('click', () => {
                this.showResults();
                // Llamar a createCharts en el chartManager
                if (window.emfApp && window.emfApp.chartManager) {
                    console.log('Creando gráficas...');
                    setTimeout(() => {
                        window.emfApp.chartManager.createCharts(window.emfApp.dataManager.getProcessedData());
                        console.log('Gráficas creadas');
                    }, 100); // Pequeño retraso para asegurar que los contenedores estén visibles
                }
            });
        }
    }

    showLoading(message = '⏳ Procesando archivo...') {
        this.elements.loading.innerHTML = `<span class="status-icon spinning">⟳</span><span>${message}</span>`;
        this.elements.loading.style.display = 'flex';
        this.elements.error.style.display = 'none';
    }

    // Modificar el método hideLoading para mostrar el botón de visualización
    hideLoading() {
        this.elements.loading.style.display = 'none';
        // Mostrar el botón de visualización si hay datos procesados
        if (window.emfApp && window.emfApp.dataManager && 
            window.emfApp.dataManager.getProcessedData().datetime.length > 0) {
            this.elements.visualizeBtn.style.display = 'block';
        }
    }

    // Modificar el método showError para ocultar el botón de visualización
    showError(message) {
        this.elements.error.innerHTML = `<span class="status-icon">⚠</span><span>${message}</span>`;
        this.elements.error.style.display = 'flex';
        this.elements.loading.style.display = 'none';
        this.elements.visualizeBtn.style.display = 'none';
        this.hideResults();
    }

    // Modificar el método clearAll para ocultar el botón de visualización
    clearAll() {
        this.elements.fileInfo.textContent = '';
        this.hideLoading();
        this.elements.error.style.display = 'none';
        this.elements.visualizeBtn.style.display = 'none';
        this.hideResults();
    }

    showSuccess(message) {
        // Crear elemento de éxito si no existe
        let successElement = document.getElementById('success');
        if (!successElement) {
            successElement = document.createElement('div');
            successElement.id = 'success';
            successElement.className = 'success';
            this.elements.error.parentNode.appendChild(successElement);
        }
        
        successElement.innerHTML = `<span class="status-icon">✓</span><span>${message}</span>`;
        successElement.style.display = 'flex';
        this.elements.error.style.display = 'none';
        
        // Ocultar después de 3 segundos
        setTimeout(() => {
            successElement.style.display = 'none';
        }, 3000);
    }

    updateFileInfo(fileName) {
        this.elements.fileInfo.textContent = `Archivo seleccionado: ${fileName}`;
    }

    showResults() {
        console.log('Mostrando resultados...');
        
        // Asegurarse de que los elementos existan antes de intentar mostrarlos
        if (this.elements.statsSection) {
            this.elements.statsSection.style.display = 'grid';
            console.log('Sección de estadísticas visible');
        }
        
        if (this.elements.chartsSection) {
            this.elements.chartsSection.style.display = 'grid';
            console.log('Sección de gráficas visible');
        }
        
        if (this.elements.toolbar) {
            this.elements.toolbar.style.display = 'flex';
        }
        
        if (this.elements.error) {
            this.elements.error.style.display = 'none';
        }
        
        // Forzar un reflow para asegurar que los contenedores de gráficas sean visibles
        if (this.elements.chartsSection) {
            const height = this.elements.chartsSection.offsetHeight;
            console.log('Altura de la sección de gráficas:', height);
        }
        
        // Asegurarse de que los contenedores de gráficas tengan altura
        const chartContainers = document.querySelectorAll('.chart');
        chartContainers.forEach(container => {
            container.style.height = '400px';
            container.style.width = '100%';
            console.log('Contenedor de gráfica configurado:', container.id);
        });
    }

    hideResults() {
        this.elements.statsSection.style.display = 'none';
        this.elements.chartsSection.style.display = 'none';
        this.elements.toolbar.style.display = 'none';
    }

    updateStatistics(statistics) {
        // Actualizar EMF
        document.getElementById('emfMax').textContent = `${statistics.emf.max.toFixed(2)} mG`;
        document.getElementById('emfMin').textContent = `${statistics.emf.min.toFixed(2)} mG`;
        document.getElementById('emfAvg').textContent = `${statistics.emf.avg.toFixed(2)} mG`;

        // Actualizar EF
        document.getElementById('efMax').textContent = `${statistics.ef.max.toFixed(2)} V/m`;
        document.getElementById('efMin').textContent = `${statistics.ef.min.toFixed(2)} V/m`;
        document.getElementById('efAvg').textContent = `${statistics.ef.avg.toFixed(2)} V/m`;

        // Actualizar RF
        document.getElementById('rfMax').textContent = `${statistics.rf.max.toFixed(2)} mW/m²`;
        document.getElementById('rfMin').textContent = `${statistics.rf.min.toFixed(2)} mW/m²`;
        document.getElementById('rfAvg').textContent = `${statistics.rf.avg.toFixed(2)} mW/m²`;
    }
}