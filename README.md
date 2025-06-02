# Computer Vision AI Platform

## English

### Overview
Advanced Computer Vision AI Platform with comprehensive image analysis, object detection, and classification capabilities. Features a modern web interface built with HTML5, CSS3, and JavaScript for real-time computer vision processing.

### Author
**Gabriel Demetrios Lafis**
- Email: gabrieldemetrios@gmail.com
- LinkedIn: [Gabriel Demetrios Lafis](https://www.linkedin.com/in/gabriel-demetrios-lafis-62197711b)
- GitHub: [galafis](https://github.com/galafis)

### Technologies Used
- **Backend**: Python, Flask, OpenCV, TensorFlow, scikit-learn
- **Frontend**: HTML5, CSS3, JavaScript (ES6+), Canvas API
- **Computer Vision**: YOLO, R-CNN, SSD MobileNet, EfficientDet
- **Image Processing**: PIL, NumPy, Matplotlib
- **Machine Learning**: TensorFlow, Keras, PyTorch
- **Web Technologies**: WebSocket, File API, Drag & Drop API
- **Styling**: CSS Grid, Flexbox, CSS Animations, Gradients

### Features

#### Core Computer Vision
- **Object Detection**: Multiple model support (YOLO v8, R-CNN, SSD, EfficientDet)
- **Image Classification**: ResNet-50, VGG-16, Inception v3, MobileNet
- **Real-time Processing**: Live image analysis with confidence thresholds
- **Batch Processing**: Multiple image analysis capabilities

#### Advanced Analysis
- **Color Analysis**: Dominant color extraction and palette generation
- **Feature Detection**: Edge detection, corner detection, texture analysis
- **Image Metrics**: Resolution analysis, quality scoring, compression analysis
- **Symmetry Analysis**: Geometric symmetry detection and scoring

#### Web Interface
- **Modern UI**: Responsive design with CSS Grid and Flexbox
- **Interactive Canvas**: Real-time bounding box visualization
- **Drag & Drop**: File upload with visual feedback
- **Progress Tracking**: Real-time processing status updates
- **Export Options**: JSON, CSV, annotated images, comprehensive reports

#### Performance Features
- **Multi-threading**: Parallel processing for improved performance
- **Caching**: Intelligent model and result caching
- **Memory Management**: Optimized memory usage for large images
- **GPU Acceleration**: CUDA support for faster processing

### Installation

```bash
# Clone the repository
git clone https://github.com/galafis/Computer-Vision-AI.git
cd Computer-Vision-AI

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the application
python app.py
```

### Web Interface Usage

1. **Open the Application**
   ```bash
   python app.py
   # Open http://localhost:5000 in your browser
   ```

2. **Upload Images**
   - Drag and drop images onto the upload area
   - Or click "Select Image" to browse files
   - Supported formats: JPG, PNG, WebP, GIF, BMP, TIFF

3. **Object Detection**
   - Select detection model (YOLO, R-CNN, SSD, EfficientDet)
   - Adjust confidence threshold (0.1 - 1.0)
   - Click "Start Detection" to analyze

4. **Image Classification**
   - Choose classification model (ResNet, VGG, Inception, MobileNet)
   - View top predictions with confidence scores
   - Interactive prediction charts

5. **Advanced Analysis**
   - Color palette extraction
   - Feature detection visualization
   - Image quality metrics
   - Symmetry analysis

6. **Export Results**
   - JSON format for programmatic use
   - CSV for spreadsheet analysis
   - Annotated images with bounding boxes
   - Comprehensive PDF reports

### API Endpoints

```python
# Object Detection
POST /api/detect
{
    "image": "base64_encoded_image",
    "model": "yolo",
    "confidence": 0.5
}

# Image Classification
POST /api/classify
{
    "image": "base64_encoded_image",
    "model": "resnet"
}

# Advanced Analysis
POST /api/analyze
{
    "image": "base64_encoded_image",
    "features": ["color", "texture", "symmetry"]
}
```

### Configuration

```python
# config.py
MODELS = {
    'detection': {
        'yolo': 'models/yolo_v8.pt',
        'rcnn': 'models/faster_rcnn.pth',
        'ssd': 'models/ssd_mobilenet.pb'
    },
    'classification': {
        'resnet': 'models/resnet50.pth',
        'vgg': 'models/vgg16.pth'
    }
}

PROCESSING = {
    'max_image_size': (1920, 1080),
    'batch_size': 32,
    'gpu_enabled': True
}
```

### Performance Benchmarks
- **Detection Speed**: 15-30 FPS (depending on model and hardware)
- **Classification Accuracy**: 94%+ on ImageNet validation set
- **Memory Usage**: 2-4 GB (with GPU acceleration)
- **Supported Image Sizes**: Up to 4K resolution

---

## Português

### Visão Geral
Plataforma Avançada de IA para Visão Computacional com capacidades abrangentes de análise de imagens, detecção de objetos e classificação. Apresenta uma interface web moderna construída com HTML5, CSS3 e JavaScript para processamento de visão computacional em tempo real.

### Autor
**Gabriel Demetrios Lafis**
- Email: gabrieldemetrios@gmail.com
- LinkedIn: [Gabriel Demetrios Lafis](https://www.linkedin.com/in/gabriel-demetrios-lafis-62197711b)
- GitHub: [galafis](https://github.com/galafis)

### Tecnologias Utilizadas
- **Backend**: Python, Flask, OpenCV, TensorFlow, scikit-learn
- **Frontend**: HTML5, CSS3, JavaScript (ES6+), Canvas API
- **Visão Computacional**: YOLO, R-CNN, SSD MobileNet, EfficientDet
- **Processamento de Imagens**: PIL, NumPy, Matplotlib
- **Aprendizado de Máquina**: TensorFlow, Keras, PyTorch
- **Tecnologias Web**: WebSocket, File API, Drag & Drop API
- **Estilização**: CSS Grid, Flexbox, Animações CSS, Gradientes

### Funcionalidades

#### Visão Computacional Principal
- **Detecção de Objetos**: Suporte a múltiplos modelos (YOLO v8, R-CNN, SSD, EfficientDet)
- **Classificação de Imagens**: ResNet-50, VGG-16, Inception v3, MobileNet
- **Processamento em Tempo Real**: Análise de imagens ao vivo com limites de confiança
- **Processamento em Lote**: Capacidades de análise de múltiplas imagens

#### Análise Avançada
- **Análise de Cores**: Extração de cores dominantes e geração de paletas
- **Detecção de Características**: Detecção de bordas, cantos, análise de textura
- **Métricas de Imagem**: Análise de resolução, pontuação de qualidade, análise de compressão
- **Análise de Simetria**: Detecção de simetria geométrica e pontuação

#### Interface Web
- **UI Moderna**: Design responsivo com CSS Grid e Flexbox
- **Canvas Interativo**: Visualização de caixas delimitadoras em tempo real
- **Arrastar e Soltar**: Upload de arquivos com feedback visual
- **Rastreamento de Progresso**: Atualizações de status de processamento em tempo real
- **Opções de Exportação**: JSON, CSV, imagens anotadas, relatórios abrangentes

### Instalação

```bash
# Clonar o repositório
git clone https://github.com/galafis/Computer-Vision-AI.git
cd Computer-Vision-AI

# Criar ambiente virtual
python -m venv venv
source venv/bin/activate  # No Windows: venv\Scripts\activate

# Instalar dependências
pip install -r requirements.txt

# Executar a aplicação
python app.py
```

### Uso da Interface Web

1. **Abrir a Aplicação**
   ```bash
   python app.py
   # Abrir http://localhost:5000 no navegador
   ```

2. **Upload de Imagens**
   - Arrastar e soltar imagens na área de upload
   - Ou clicar em "Selecionar Imagem" para navegar pelos arquivos
   - Formatos suportados: JPG, PNG, WebP, GIF, BMP, TIFF

3. **Detecção de Objetos**
   - Selecionar modelo de detecção (YOLO, R-CNN, SSD, EfficientDet)
   - Ajustar limite de confiança (0.1 - 1.0)
   - Clicar em "Iniciar Detecção" para analisar

### Benchmarks de Performance
- **Velocidade de Detecção**: 15-30 FPS (dependendo do modelo e hardware)
- **Precisão de Classificação**: 94%+ no conjunto de validação ImageNet
- **Uso de Memória**: 2-4 GB (com aceleração GPU)
- **Tamanhos de Imagem Suportados**: Até resolução 4K

### Licença
MIT License

### Contribuições
Contribuições são bem-vindas! Por favor, abra uma issue ou envie um pull request.

### Contato
Para dúvidas ou suporte, entre em contato através do email ou LinkedIn mencionados acima.

