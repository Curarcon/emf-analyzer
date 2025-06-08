# 📊 EMF Analyzer - GQ EMF-390 Log Viewer

Aplicación web para análisis y visualización de datos de campos electromagnéticos (EMF) del dispositivo GQ EMF-390.

## 🚀 Características

- **Visualización interactiva** de datos EMF, EF y RF
- **Carga de archivos CSV** desde el directorio history o subida manual
- **Gráficas dinámicas** con Plotly.js
- **Estadísticas detalladas** de los campos electromagnéticos
- **Exportación de gráficas** en formato PNG
- **Generación de reportes** completos
- **Interfaz moderna** con diseño responsive

## 📁 Estructura del Proyecto

```
emf-analyzer/
├── index.html              # Página principal
├── styles/
│   └── main.css            # Estilos CSS
├── js/
│   ├── app.js              # Aplicación principal
│   ├── EMFDataManager.js   # Gestión de datos
│   ├── EMFUIManager.js     # Gestión de interfaz
│   ├── EMFChartManager.js  # Gestión de gráficas
│   ├── EMFFileManager.js   # Gestión de archivos
│   └── EMFExporter.js      # Exportación de datos
├── libs/
│   ├── plotly-2.26.0.min.js    # Biblioteca de gráficas
│   └── papaparse-5.4.1.min.js  # Parser de CSV
└── history/                # Directorio para archivos CSV
```

## 🛠️ Instalación

1. Clona el repositorio:
```bash
git clone https://github.com/Curarcon/emf-analyzer.git
cd emf-analyzer
```

2. Inicia un servidor web local (ejemplo con Python):
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

3. Abre tu navegador en `http://localhost:8000`

## 📊 Uso

### Carga de Datos

1. **Desde directorio History**: Selecciona un archivo del dropdown y haz clic en "Cargar Archivo Seleccionado"
2. **Subida manual**: Usa el botón "Cargar archivo CSV" para subir un archivo desde tu dispositivo

### Visualización

1. Después de cargar los datos, haz clic en "Visualizar Gráficas"
2. Se mostrarán 4 gráficas:
   - **EMF**: Campo magnético (mG)
   - **EF**: Campo eléctrico (V/m)
   - **RF Power**: Densidad de potencia RF (mW/m²)
   - **RF Voltage**: Voltaje RF (V/m)

### Exportación

- **Gráficas individuales**: Usa los botones de exportar específicos
- **Todas las gráficas**: Botón "Exportar Todo"
- **Reporte completo**: Botón "Generar Reporte"

## 📋 Formato de Datos

La aplicación espera archivos CSV con las siguientes columnas:
- `Date and Time`: Fecha y hora del registro
- `EMF`: Campo magnético en miliGauss (mG)
- `EF`: Campo eléctrico en Voltios por metro (V/m)
- `RF Power Density`: Densidad de potencia RF en mW/m²

## 🎨 Características Técnicas

- **Framework**: Vanilla JavaScript (ES6+)
- **Gráficas**: Plotly.js 2.26.0
- **Parser CSV**: PapaParse 5.4.1
- **Diseño**: CSS3 con gradientes y efectos modernos
- **Responsive**: Compatible con dispositivos móviles

## 🔧 Configuración

### Límites de Procesamiento
- Máximo 10,000 filas por archivo para optimizar rendimiento
- Procesamiento en lotes de 1,000 filas

### Personalización
- Modifica `main.css` para cambiar el tema visual
- Ajusta `EMFChartManager.js` para personalizar las gráficas
- Configura `EMFDataManager.js` para cambiar límites de procesamiento

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 📞 Contacto

Proyecto Link: [https://github.com/Curarcon/emf-analyzer](https://github.com/Curarcon/emf-analyzer)

## 🙏 Agradecimientos

- [Plotly.js](https://plotly.com/javascript/) - Biblioteca de gráficas interactivas
- [PapaParse](https://www.papaparse.com/) - Parser de CSV para JavaScript
- [GQ Electronics](https://www.gqelectronicsllc.com/) - Fabricante del EMF-390