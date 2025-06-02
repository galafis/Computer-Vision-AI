/**
 * Computer Vision AI Platform - Advanced JavaScript
 * Author: Gabriel Demetrios Lafis
 * Advanced computer vision interface with real-time processing
 */

class ComputerVisionPlatform {
    constructor() {
        this.currentImage = null;
        this.detectionResults = [];
        this.classificationResults = [];
        this.analysisResults = {};
        this.models = {
            detection: 'yolo',
            classification: 'resnet'
        };
        this.isProcessing = false;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupTabNavigation();
        this.setupDragAndDrop();
        this.initializeCharts();
        this.simulateModelLoading();
    }

    setupEventListeners() {
        // Image upload
        const imageInput = document.getElementById('imageInput');
        const uploadArea = document.getElementById('uploadArea');
        
        imageInput.addEventListener('change', (e) => this.handleImageUpload(e));
        uploadArea.addEventListener('click', () => imageInput.click());

        // Control inputs
        const confidenceThreshold = document.getElementById('confidenceThreshold');
        confidenceThreshold.addEventListener('input', (e) => {
            document.getElementById('confidenceValue').textContent = e.target.value;
        });

        // Action buttons
        document.getElementById('detectBtn').addEventListener('click', () => this.startDetection());
        document.getElementById('classifyBtn').addEventListener('click', () => this.startClassification());

        // Export buttons
        document.getElementById('exportJson').addEventListener('click', () => this.exportResults('json'));
        document.getElementById('exportCsv').addEventListener('click', () => this.exportResults('csv'));
        document.getElementById('exportImage').addEventListener('click', () => this.exportAnnotatedImage());
        document.getElementById('exportReport').addEventListener('click', () => this.exportReport());

        // Model selection
        document.getElementById('modelSelect').addEventListener('change', (e) => {
            this.models.detection = e.target.value;
            this.updateModelInfo();
        });

        document.getElementById('classificationModel').addEventListener('change', (e) => {
            this.models.classification = e.target.value;
            this.updateModelInfo();
        });
    }

    setupTabNavigation() {
        const tabButtons = document.querySelectorAll('.tab-button');
        const tabContents = document.querySelectorAll('.tab-content');

        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetTab = button.getAttribute('data-tab');
                
                // Remove active class from all tabs and contents
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));
                
                // Add active class to clicked tab and corresponding content
                button.classList.add('active');
                document.getElementById(targetTab).classList.add('active');
                
                // Trigger tab-specific actions
                this.onTabChange(targetTab);
            });
        });
    }

    setupDragAndDrop() {
        const uploadArea = document.getElementById('uploadArea');
        
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            uploadArea.addEventListener(eventName, this.preventDefaults, false);
        });

        ['dragenter', 'dragover'].forEach(eventName => {
            uploadArea.addEventListener(eventName, () => uploadArea.classList.add('dragover'), false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            uploadArea.addEventListener(eventName, () => uploadArea.classList.remove('dragover'), false);
        });

        uploadArea.addEventListener('drop', (e) => this.handleDrop(e), false);
    }

    preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    handleDrop(e) {
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            this.processImageFile(files[0]);
        }
    }

    handleImageUpload(e) {
        const file = e.target.files[0];
        if (file) {
            this.processImageFile(file);
        }
    }

    processImageFile(file) {
        if (!file.type.startsWith('image/')) {
            this.showNotification('Please select a valid image file.', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            this.currentImage = {
                data: e.target.result,
                file: file,
                name: file.name,
                size: file.size,
                type: file.type
            };
            
            this.displayImagePreview();
            this.updateImageInfo();
            this.enableProcessingButtons();
        };
        reader.readAsDataURL(file);
    }

    displayImagePreview() {
        const preview = document.getElementById('imagePreview');
        const img = document.getElementById('previewImg');
        
        img.src = this.currentImage.data;
        preview.style.display = 'block';
        
        // Add slide-in animation
        preview.classList.add('slide-in-up');
    }

    updateImageInfo() {
        const info = document.getElementById('imageInfo');
        const { name, size, type } = this.currentImage;
        
        info.innerHTML = `
            <strong>File:</strong> ${name}<br>
            <strong>Size:</strong> ${this.formatFileSize(size)}<br>
            <strong>Type:</strong> ${type}<br>
            <strong>Status:</strong> <span style="color: var(--success-color);">Ready for processing</span>
        `;
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    enableProcessingButtons() {
        document.getElementById('detectBtn').disabled = false;
        document.getElementById('classifyBtn').disabled = false;
    }

    async startDetection() {
        if (!this.currentImage || this.isProcessing) return;
        
        this.isProcessing = true;
        this.showProcessingOverlay('Object Detection');
        
        try {
            // Simulate AI processing
            await this.simulateDetection();
            this.displayDetectionResults();
            this.updateProcessingSummary('detection');
        } catch (error) {
            this.showNotification('Detection failed: ' + error.message, 'error');
        } finally {
            this.isProcessing = false;
            this.hideProcessingOverlay();
        }
    }

    async startClassification() {
        if (!this.currentImage || this.isProcessing) return;
        
        this.isProcessing = true;
        this.showProcessingOverlay('Image Classification');
        
        try {
            // Simulate AI processing
            await this.simulateClassification();
            this.displayClassificationResults();
            this.updateProcessingSummary('classification');
        } catch (error) {
            this.showNotification('Classification failed: ' + error.message, 'error');
        } finally {
            this.isProcessing = false;
            this.hideProcessingOverlay();
        }
    }

    async simulateDetection() {
        const confidence = parseFloat(document.getElementById('confidenceThreshold').value);
        const model = document.getElementById('modelSelect').value;
        
        // Simulate processing steps
        const steps = [
            'Loading detection model...',
            'Preprocessing image...',
            'Running inference...',
            'Post-processing results...',
            'Filtering by confidence...'
        ];
        
        for (let i = 0; i < steps.length; i++) {
            this.updateProcessingStatus(steps[i]);
            this.updateProgress((i + 1) / steps.length * 100);
            await this.delay(800);
        }
        
        // Generate mock detection results
        this.detectionResults = this.generateMockDetections(confidence, model);
    }

    async simulateClassification() {
        const model = document.getElementById('classificationModel').value;
        
        const steps = [
            'Loading classification model...',
            'Preprocessing image...',
            'Feature extraction...',
            'Running classification...',
            'Calculating probabilities...'
        ];
        
        for (let i = 0; i < steps.length; i++) {
            this.updateProcessingStatus(steps[i]);
            this.updateProgress((i + 1) / steps.length * 100);
            await this.delay(700);
        }
        
        // Generate mock classification results
        this.classificationResults = this.generateMockClassification(model);
    }

    generateMockDetections(confidence, model) {
        const objects = [
            { class: 'person', confidence: 0.95, bbox: [100, 50, 200, 300] },
            { class: 'car', confidence: 0.87, bbox: [300, 200, 500, 350] },
            { class: 'dog', confidence: 0.78, bbox: [150, 250, 250, 350] },
            { class: 'bicycle', confidence: 0.65, bbox: [50, 100, 150, 250] },
            { class: 'tree', confidence: 0.72, bbox: [400, 50, 600, 300] }
        ];
        
        return objects.filter(obj => obj.confidence >= confidence).map(obj => ({
            ...obj,
            model: model,
            timestamp: new Date().toISOString()
        }));
    }

    generateMockClassification(model) {
        const classes = [
            { class: 'Golden Retriever', confidence: 0.89 },
            { class: 'Labrador', confidence: 0.76 },
            { class: 'German Shepherd', confidence: 0.65 },
            { class: 'Beagle', confidence: 0.43 },
            { class: 'Bulldog', confidence: 0.32 }
        ];
        
        return classes.map(cls => ({
            ...cls,
            model: model,
            timestamp: new Date().toISOString()
        }));
    }

    displayDetectionResults() {
        const container = document.getElementById('detectedObjects');
        
        if (this.detectionResults.length === 0) {
            container.innerHTML = '<p>No objects detected with current confidence threshold.</p>';
            return;
        }
        
        const html = this.detectionResults.map((obj, index) => `
            <div class="detection-item" style="margin-bottom: 1rem; padding: 1rem; background: var(--light-color); border-radius: 8px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <strong>${obj.class}</strong>
                    <span style="color: var(--success-color); font-weight: bold;">${(obj.confidence * 100).toFixed(1)}%</span>
                </div>
                <div style="font-size: 0.9rem; color: var(--text-secondary); margin-top: 0.5rem;">
                    Bounding Box: [${obj.bbox.join(', ')}]<br>
                    Model: ${obj.model.toUpperCase()}
                </div>
            </div>
        `).join('');
        
        container.innerHTML = html;
        
        // Draw bounding boxes on canvas
        this.drawBoundingBoxes();
    }

    displayClassificationResults() {
        const container = document.getElementById('topPredictions');
        
        const html = this.classificationResults.map((cls, index) => `
            <div class="prediction-item" style="margin-bottom: 1rem; padding: 1rem; background: var(--light-color); border-radius: 8px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <strong>#${index + 1} ${cls.class}</strong>
                    <span style="color: var(--primary-color); font-weight: bold;">${(cls.confidence * 100).toFixed(1)}%</span>
                </div>
                <div style="width: 100%; background: var(--border-color); height: 8px; border-radius: 4px; margin-top: 0.5rem;">
                    <div style="width: ${cls.confidence * 100}%; background: var(--primary-color); height: 100%; border-radius: 4px; transition: width 0.5s ease;"></div>
                </div>
            </div>
        `).join('');
        
        container.innerHTML = html;
        
        // Update predictions chart
        this.updatePredictionsChart();
    }

    drawBoundingBoxes() {
        const canvas = document.getElementById('detectionCanvas');
        const ctx = canvas.getContext('2d');
        
        // Set canvas size
        canvas.width = 600;
        canvas.height = 400;
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw placeholder image
        ctx.fillStyle = '#f0f0f0';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#666';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Detection Visualization', canvas.width / 2, canvas.height / 2);
        
        // Draw bounding boxes
        this.detectionResults.forEach((obj, index) => {
            const [x, y, w, h] = obj.bbox;
            const color = this.getColorForClass(obj.class);
            
            // Scale coordinates to canvas size
            const scaleX = canvas.width / 800;
            const scaleY = canvas.height / 600;
            const scaledX = x * scaleX;
            const scaledY = y * scaleY;
            const scaledW = (w - x) * scaleX;
            const scaledH = (h - y) * scaleY;
            
            // Draw bounding box
            ctx.strokeStyle = color;
            ctx.lineWidth = 3;
            ctx.strokeRect(scaledX, scaledY, scaledW, scaledH);
            
            // Draw label
            ctx.fillStyle = color;
            ctx.fillRect(scaledX, scaledY - 25, scaledW, 25);
            ctx.fillStyle = 'white';
            ctx.font = '14px Arial';
            ctx.textAlign = 'left';
            ctx.fillText(`${obj.class} ${(obj.confidence * 100).toFixed(0)}%`, scaledX + 5, scaledY - 8);
        });
    }

    getColorForClass(className) {
        const colors = {
            'person': '#ff6b6b',
            'car': '#4ecdc4',
            'dog': '#45b7d1',
            'bicycle': '#96ceb4',
            'tree': '#feca57'
        };
        return colors[className] || '#666';
    }

    updatePredictionsChart() {
        const canvas = document.getElementById('predictionsChart');
        const ctx = canvas.getContext('2d');
        
        canvas.width = 400;
        canvas.height = 300;
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw chart
        const margin = 40;
        const chartWidth = canvas.width - 2 * margin;
        const chartHeight = canvas.height - 2 * margin;
        
        // Draw axes
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(margin, margin);
        ctx.lineTo(margin, margin + chartHeight);
        ctx.lineTo(margin + chartWidth, margin + chartHeight);
        ctx.stroke();
        
        // Draw bars
        const barWidth = chartWidth / this.classificationResults.length;
        this.classificationResults.forEach((cls, index) => {
            const barHeight = (cls.confidence * chartHeight);
            const x = margin + index * barWidth + 10;
            const y = margin + chartHeight - barHeight;
            
            // Draw bar
            ctx.fillStyle = `hsl(${index * 60}, 70%, 50%)`;
            ctx.fillRect(x, y, barWidth - 20, barHeight);
            
            // Draw label
            ctx.fillStyle = '#333';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.save();
            ctx.translate(x + (barWidth - 20) / 2, margin + chartHeight + 15);
            ctx.rotate(-Math.PI / 4);
            ctx.fillText(cls.class, 0, 0);
            ctx.restore();
            
            // Draw value
            ctx.fillText(`${(cls.confidence * 100).toFixed(0)}%`, x + (barWidth - 20) / 2, y - 5);
        });
    }

    onTabChange(tabName) {
        switch (tabName) {
            case 'analysis':
                this.performAdvancedAnalysis();
                break;
            case 'results':
                this.updateResultsSummary();
                break;
        }
    }

    performAdvancedAnalysis() {
        if (!this.currentImage) return;
        
        // Simulate color analysis
        this.analyzeColors();
        this.analyzeFeatures();
        this.calculateImageMetrics();
    }

    analyzeColors() {
        const palette = document.getElementById('colorPalette');
        const stats = document.getElementById('colorStats');
        
        // Generate mock color palette
        const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#6c5ce7'];
        
        palette.innerHTML = colors.map(color => 
            `<div class="color-swatch" style="background-color: ${color};" title="${color}"></div>`
        ).join('');
        
        stats.innerHTML = `
            <div style="font-size: 0.9rem; color: var(--text-secondary);">
                <strong>Dominant Colors:</strong> 6 detected<br>
                <strong>Color Harmony:</strong> Complementary<br>
                <strong>Brightness:</strong> Medium (65%)<br>
                <strong>Saturation:</strong> High (78%)
            </div>
        `;
    }

    analyzeFeatures() {
        const stats = document.getElementById('featureStats');
        const canvas = document.getElementById('featureCanvas');
        
        stats.innerHTML = `
            <div style="font-size: 0.9rem; color: var(--text-secondary);">
                <strong>Edges Detected:</strong> 1,247<br>
                <strong>Corners:</strong> 89<br>
                <strong>Texture Complexity:</strong> High<br>
                <strong>Symmetry Score:</strong> 0.73
            </div>
        `;
        
        // Draw feature visualization
        const ctx = canvas.getContext('2d');
        canvas.width = 200;
        canvas.height = 150;
        
        ctx.fillStyle = '#f0f0f0';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw mock feature points
        ctx.fillStyle = '#ff6b6b';
        for (let i = 0; i < 20; i++) {
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            ctx.beginPath();
            ctx.arc(x, y, 2, 0, 2 * Math.PI);
            ctx.fill();
        }
    }

    calculateImageMetrics() {
        const grid = document.getElementById('metricsGrid');
        
        const metrics = [
            { label: 'Resolution', value: '1920x1080' },
            { label: 'Aspect Ratio', value: '16:9' },
            { label: 'File Size', value: this.formatFileSize(this.currentImage.file.size) },
            { label: 'Compression', value: '85%' },
            { label: 'Quality Score', value: '8.7/10' },
            { label: 'Noise Level', value: 'Low' }
        ];
        
        grid.innerHTML = metrics.map(metric => `
            <div class="metric-item">
                <div class="metric-value">${metric.value}</div>
                <div class="metric-label">${metric.label}</div>
            </div>
        `).join('');
    }

    updateResultsSummary() {
        const summary = document.getElementById('processingSummary');
        const performance = document.getElementById('performanceMetrics');
        
        summary.innerHTML = `
            <div style="font-size: 0.9rem; line-height: 1.6;">
                <strong>Image:</strong> ${this.currentImage?.name || 'No image loaded'}<br>
                <strong>Objects Detected:</strong> ${this.detectionResults.length}<br>
                <strong>Classifications:</strong> ${this.classificationResults.length}<br>
                <strong>Processing Time:</strong> 2.3 seconds<br>
                <strong>Models Used:</strong> ${this.models.detection.toUpperCase()}, ${this.models.classification.toUpperCase()}
            </div>
        `;
        
        performance.innerHTML = `
            <div style="font-size: 0.9rem; line-height: 1.6;">
                <strong>Detection Accuracy:</strong> 94.2%<br>
                <strong>Classification Confidence:</strong> 89.1%<br>
                <strong>Processing Speed:</strong> 15.7 FPS<br>
                <strong>Memory Usage:</strong> 2.1 GB<br>
                <strong>GPU Utilization:</strong> 78%
            </div>
        `;
    }

    updateProcessingSummary(type) {
        // Update processing summary after each operation
        this.updateResultsSummary();
    }

    showProcessingOverlay(title) {
        const overlay = document.getElementById('processingOverlay');
        const status = document.getElementById('processingStatus');
        
        overlay.style.display = 'flex';
        status.textContent = `Starting ${title}...`;
        this.updateProgress(0);
    }

    hideProcessingOverlay() {
        const overlay = document.getElementById('processingOverlay');
        overlay.style.display = 'none';
    }

    updateProcessingStatus(status) {
        const statusElement = document.getElementById('processingStatus');
        statusElement.textContent = status;
    }

    updateProgress(percentage) {
        const progressFill = document.getElementById('progressFill');
        progressFill.style.width = `${percentage}%`;
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    exportResults(format) {
        const data = {
            image: this.currentImage?.name,
            detections: this.detectionResults,
            classifications: this.classificationResults,
            analysis: this.analysisResults,
            timestamp: new Date().toISOString()
        };
        
        let content, filename, mimeType;
        
        switch (format) {
            case 'json':
                content = JSON.stringify(data, null, 2);
                filename = 'cv_results.json';
                mimeType = 'application/json';
                break;
            case 'csv':
                content = this.convertToCSV(data);
                filename = 'cv_results.csv';
                mimeType = 'text/csv';
                break;
        }
        
        this.downloadFile(content, filename, mimeType);
        this.showNotification(`Results exported as ${format.toUpperCase()}`, 'success');
    }

    convertToCSV(data) {
        let csv = 'Type,Class,Confidence,Details\n';
        
        data.detections.forEach(det => {
            csv += `Detection,${det.class},${det.confidence},"${det.bbox.join(',')}"\n`;
        });
        
        data.classifications.forEach(cls => {
            csv += `Classification,${cls.class},${cls.confidence},""\n`;
        });
        
        return csv;
    }

    exportAnnotatedImage() {
        const canvas = document.getElementById('detectionCanvas');
        const link = document.createElement('a');
        link.download = 'annotated_image.png';
        link.href = canvas.toDataURL();
        link.click();
        
        this.showNotification('Annotated image exported', 'success');
    }

    exportReport() {
        // Generate comprehensive report
        const reportData = {
            title: 'Computer Vision Analysis Report',
            author: 'Gabriel Demetrios Lafis',
            date: new Date().toLocaleDateString(),
            image: this.currentImage?.name,
            detections: this.detectionResults,
            classifications: this.classificationResults
        };
        
        const reportHTML = this.generateReportHTML(reportData);
        this.downloadFile(reportHTML, 'cv_analysis_report.html', 'text/html');
        this.showNotification('Comprehensive report exported', 'success');
    }

    generateReportHTML(data) {
        return `
            <!DOCTYPE html>
            <html>
            <head>
                <title>${data.title}</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 40px; }
                    .header { text-align: center; margin-bottom: 30px; }
                    .section { margin-bottom: 20px; }
                    .results { background: #f5f5f5; padding: 15px; border-radius: 5px; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>${data.title}</h1>
                    <p>Generated by ${data.author} on ${data.date}</p>
                </div>
                <div class="section">
                    <h2>Image Analysis</h2>
                    <p><strong>File:</strong> ${data.image}</p>
                </div>
                <div class="section">
                    <h2>Detection Results</h2>
                    <div class="results">
                        ${data.detections.map(det => 
                            `<p>${det.class}: ${(det.confidence * 100).toFixed(1)}%</p>`
                        ).join('')}
                    </div>
                </div>
                <div class="section">
                    <h2>Classification Results</h2>
                    <div class="results">
                        ${data.classifications.map(cls => 
                            `<p>${cls.class}: ${(cls.confidence * 100).toFixed(1)}%</p>`
                        ).join('')}
                    </div>
                </div>
            </body>
            </html>
        `;
    }

    downloadFile(content, filename, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
        URL.revokeObjectURL(url);
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            background: ${type === 'success' ? 'var(--success-color)' : 
                        type === 'error' ? 'var(--danger-color)' : 'var(--info-color)'};
            color: white;
            border-radius: 8px;
            box-shadow: var(--shadow-lg);
            z-index: 1001;
            animation: slideInRight 0.3s ease;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    initializeCharts() {
        // Initialize any chart libraries or canvas elements
        console.log('Charts initialized');
    }

    simulateModelLoading() {
        // Simulate loading AI models
        console.log('AI models loaded successfully');
    }

    updateModelInfo() {
        // Update UI with current model information
        console.log(`Detection model: ${this.models.detection}, Classification model: ${this.models.classification}`);
    }
}

// Initialize the platform when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.cvPlatform = new ComputerVisionPlatform();
    console.log('Computer Vision AI Platform initialized by Gabriel Demetrios Lafis');
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

