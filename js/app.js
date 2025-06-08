class EMFApp {
    constructor() {
        this.dataManager = new EMFDataManager();
        this.uiManager = new EMFUIManager();
        this.chartManager = new EMFChartManager();
        this.fileManager = new EMFFileManager(this.dataManager, this.uiManager);
        
        console.log('EMF Viewer App inicializada');
    }
}

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.emfApp = new EMFApp();
});