// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
    // 初始化3D模型
    init3DModel();
    
    // 初始化3D可视化
    initVisualization();
    
    // 初始化图表
    initCharts();
    
    // 初始化导航栏滚动效果
    initNavigation();
    
    // 初始化缺陷图像交互功能
    initDefectImageInteraction();
    
    // 初始化网络架构图交互功能
    initNetworkDiagramInteraction();
    
    // Initialize the defect visualization section
    initializeVisualization();
    
    // Initialize the products slider
    const productsSlider = new Swiper('.products-slider', {
        slidesPerView: 1,
        spaceBetween: 20,
        loop: true,
        autoplay: {
            delay: 5000,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        breakpoints: {
            640: {
                slidesPerView: 2,
            },
            1024: {
                slidesPerView: 3,
            },
        },
    });
});

// 初始化导航栏滚动效果
function initNavigation() {
    const navLinks = document.querySelectorAll('nav a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            window.scrollTo({
                top: targetSection.offsetTop - 80,
                behavior: 'smooth'
            });
        });
    });
    
    // 滚动时添加导航栏背景
    window.addEventListener('scroll', function() {
        const header = document.querySelector('header');
        
        if (window.scrollY > 100) {
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
            header.style.boxShadow = 'none';
        }
    });
}

// 初始化3D模型
function init3DModel() {
    // 创建场景
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);
    
    // 创建相机
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.z = 5;
    
    // 创建渲染器
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(document.getElementById('three-d-model').clientWidth, document.getElementById('three-d-model').clientHeight);
    document.getElementById('three-d-model').innerHTML = '';
    document.getElementById('three-d-model').appendChild(renderer.domElement);
    
    // 添加光源
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // 创建简单的3D模型（铸件）
    const geometry = new THREE.CylinderGeometry(2, 2, 1, 32);
    const material = new THREE.MeshPhongMaterial({ 
        color: 0x999999,
        transparent: true,
        opacity: 0.8
    });
    const cylinder = new THREE.Mesh(geometry, material);
    scene.add(cylinder);
    
    // 添加缺陷点（小球体）
    addDefects(scene);
    
    // 动画循环
    function animate() {
        requestAnimationFrame(animate);
        cylinder.rotation.y += 0.005;
        renderer.render(scene, camera);
    }
    animate();
}

// 添加缺陷点
function addDefects(scene) {
    // 随机生成10个缺陷点
    const defectPositions = [
        { x: 0.8, y: 0.3, z: 1.8, size: 0.15, type: 'pore' },
        { x: -1.2, y: 0, z: 1.5, size: 0.2, type: 'pore' },
        { x: 0.5, y: -0.4, z: 1.9, size: 0.1, type: 'inclusion' },
        { x: -0.7, y: 0.2, z: 1.8, size: 0.12, type: 'pore' },
        { x: 1.5, y: 0.1, z: 1.2, size: 0.18, type: 'crack' },
        { x: -0.3, y: -0.3, z: 1.9, size: 0.08, type: 'inclusion' },
        { x: 0.2, y: 0.4, z: 1.8, size: 0.14, type: 'pore' },
        { x: -1.0, y: -0.2, z: 1.7, size: 0.22, type: 'crack' },
        { x: 0.9, y: 0, z: 1.6, size: 0.13, type: 'inclusion' },
        { x: -0.5, y: 0.3, z: 2.0, size: 0.16, type: 'pore' }
    ];
    
    // 添加缺陷模型
    defectPositions.forEach(defect => {
        const defectGeometry = new THREE.SphereGeometry(defect.size, 16, 16);
        
        // 不同类型缺陷用不同颜色
        let defectColor;
        switch(defect.type) {
            case 'pore':
                defectColor = 0xff0000; // 红色为气孔
                break;
            case 'inclusion':
                defectColor = 0x00ff00; // 绿色为夹杂
                break;
            case 'crack':
                defectColor = 0x0000ff; // 蓝色为裂纹
                break;
            default:
                defectColor = 0xff0000;
        }
        
        const defectMaterial = new THREE.MeshPhongMaterial({ color: defectColor });
        const defectMesh = new THREE.Mesh(defectGeometry, defectMaterial);
        defectMesh.position.set(defect.x, defect.y, defect.z);
        scene.add(defectMesh);
    });
}

// 初始化3D可视化交互功能
function initVisualization() {
    // 获取DOM元素
    const sampleSelect = document.getElementById('sample-select');
    const mainImage = document.getElementById('main-image');
    const thumbnails = document.querySelectorAll('.thumbnail');
    const defectTypeCheckboxes = document.querySelectorAll('input[name="defect-type"]');
    const sizeRange = document.getElementById('size-range');
    const sizeValue = document.getElementById('size-value');
    const displayModeRadios = document.querySelectorAll('input[name="display-mode"]');
    
    // 更新缺陷详情信息
    const sampleIdInfo = document.getElementById('info-sample-id');
    const defectCountInfo = document.getElementById('info-defect-count');
    const primaryDefectInfo = document.getElementById('info-primary-defect');
    const maxSizeInfo = document.getElementById('info-max-size');
    const detectionTimeInfo = document.getElementById('info-detection-time');
    
    // 缺陷数据（模拟数据，实际应用中可从API获取）
    const defectsData = {
        'detected_image_2': {
            sampleId: '样本 #1',
            defectCount: 3,
            primaryDefect: '气孔',
            maxSize: '4.2mm',
            detectionTime: '2025-05-12',
            defectTypes: { '气孔': 2, '夹杂': 1, '裂纹': 0 },
            defectSizes: [2.1, 4.2, 3.5]
        },
        'detected_image_3': {
            sampleId: '样本 #2',
            defectCount: 5,
            primaryDefect: '夹杂',
            maxSize: '3.8mm',
            detectionTime: '2025-05-13',
            defectTypes: { '气孔': 1, '夹杂': 3, '裂纹': 1 },
            defectSizes: [1.9, 2.7, 3.8, 2.2, 3.1]
        },
        'detected_image_4': {
            sampleId: '样本 #4',
            defectCount: 4,
            primaryDefect: '气孔',
            maxSize: '3.9mm',
            detectionTime: '2025-05-15',
            defectTypes: { '气孔': 3, '夹杂': 1, '裂纹': 0 },
            defectSizes: [2.8, 3.9, 2.3, 3.2]
        },
        'detected_image_5': {
            sampleId: '样本 #5',
            defectCount: 6,
            primaryDefect: '气孔',
            maxSize: '4.5mm',
            detectionTime: '2025-05-16',
            defectTypes: { '气孔': 4, '夹杂': 2, '裂纹': 0 },
            defectSizes: [3.1, 4.5, 2.9, 3.3, 2.1, 3.6]
        },
        'detected_image_6': {
            sampleId: '样本 #6',
            defectCount: 3,
            primaryDefect: '夹杂',
            maxSize: '4.0mm',
            detectionTime: '2025-05-17',
            defectTypes: { '气孔': 0, '夹杂': 2, '裂纹': 1 },
            defectSizes: [4.0, 3.7, 2.9]
        },
        'detected_image_7': {
            sampleId: '样本 #7',
            defectCount: 7,
            primaryDefect: '气孔',
            maxSize: '4.8mm',
            detectionTime: '2025-05-18',
            defectTypes: { '气孔': 5, '夹杂': 1, '裂纹': 1 },
            defectSizes: [3.2, 4.8, 2.6, 3.7, 4.1, 2.9, 3.5]
        },
        'detected_image_8': {
            sampleId: '样本 #8',
            defectCount: 4,
            primaryDefect: '裂纹',
            maxSize: '5.3mm',
            detectionTime: '2025-05-19',
            defectTypes: { '气孔': 1, '夹杂': 0, '裂纹': 3 },
            defectSizes: [5.3, 4.7, 3.9, 2.8]
        },
        'detected_image_9': {
            sampleId: '样本 #9',
            defectCount: 5,
            primaryDefect: '夹杂',
            maxSize: '4.2mm',
            detectionTime: '2025-05-20',
            defectTypes: { '气孔': 2, '夹杂': 3, '裂纹': 0 },
            defectSizes: [3.4, 4.2, 2.5, 3.1, 3.8]
        }
    };
    
    // 初始化Charts
    let defectTypeChart, defectSizeChart, defectTrendChart;
    initCharts();
    
    // 缩略图点击事件
    thumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', function() {
            const imageId = this.getAttribute('data-image');
            
            // 更新缩略图选中状态
            thumbnails.forEach(thumb => thumb.classList.remove('active'));
            this.classList.add('active');
            
            // 更新下拉选择框
            sampleSelect.value = imageId;
            
            // 更新显示的图像和数据
            updateVisualization(imageId);
        });
    });
    
    // 样本选择下拉框变化事件
    sampleSelect.addEventListener('change', function() {
        const imageId = this.value;
        
        // 更新缩略图选中状态
        thumbnails.forEach(thumb => {
            if (thumb.getAttribute('data-image') === imageId) {
                thumb.classList.add('active');
            } else {
                thumb.classList.remove('active');
            }
        });
        
        // 更新显示的图像和数据
        updateVisualization(imageId);
    });
    
    // 缺陷类型过滤事件
    defectTypeCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            filterDefects();
        });
    });
    
    // 尺寸范围过滤事件
    if (sizeRange) {
        sizeRange.addEventListener('input', function() {
            sizeValue.textContent = `最小尺寸: ${this.value}mm`;
            filterBySize();
        });
    }
    
    // 显示模式变更事件
    displayModeRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            updateDisplayMode();
        });
    });
    
    // 更新可视化内容
    function updateVisualization(sampleId) {
        // 更新主图像
        mainImage.src = `./2025IDTC/Detected_Defects/${sampleId}.png`;
        mainImage.onerror = function() {
            this.src = './images/placeholder-defect.svg';
        };
        
        // 更新缺陷详情信息
        const data = defectsData[sampleId];
        if (data) {
            sampleIdInfo.textContent = data.sampleId;
            defectCountInfo.textContent = data.defectCount;
            primaryDefectInfo.textContent = data.primaryDefect;
            maxSizeInfo.textContent = data.maxSize;
            detectionTimeInfo.textContent = data.detectionTime;
            
            // 更新图表
            updateCharts(sampleId);
        }
        
        // 应用当前选中的显示模式
        updateDisplayMode();
    }
    
    // 根据选中的缺陷类型进行过滤
    function filterDefects() {
        const selectedTypes = Array.from(defectTypeCheckboxes)
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.value);
            
        // 这里可以根据选中的类型过滤显示图像或高亮特定缺陷
        // 示例中仅更新图表
        updateDefectTypeChart(selectedTypes);
    }
    
    // 根据尺寸范围过滤
    function filterBySize() {
        const minSize = parseFloat(sizeRange.value);
        // 在实际应用中，这里可以根据尺寸过滤显示图像或高亮特定缺陷
        // 示例中仅更新图表
        updateDefectSizeChart(minSize);
    }
    
    // 更新显示模式
    function updateDisplayMode() {
        const selectedMode = document.querySelector('input[name="display-mode"]:checked').value;
        
        // 移除所有模式类
        mainImage.classList.remove('cross-section', 'heatmap');
        
        // 应用选中的模式类
        if (selectedMode === 'cross-section') {
            mainImage.classList.add('cross-section');
        } else if (selectedMode === 'heatmap') {
            mainImage.classList.add('heatmap');
        }
    }
    
    // 初始化图表
    function initCharts() {
        // 缺陷类型图表
        const defectTypeCtx = document.getElementById('defect-type-chart');
        if (defectTypeCtx) {
            defectTypeChart = new Chart(defectTypeCtx, {
                type: 'doughnut',
                data: {
                    labels: ['气孔', '夹杂', '裂纹'],
                    datasets: [{
                        data: [0, 0, 0],
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.7)',
                            'rgba(54, 162, 235, 0.7)',
                            'rgba(255, 206, 86, 0.7)'
                        ],
                        borderColor: [
                            'rgba(255, 99, 132, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        },
                        title: {
                            display: true,
                            text: '缺陷类型分布'
                        }
                    }
                }
            });
        }
        
        // 缺陷尺寸图表
        const defectSizeCtx = document.getElementById('defect-size-chart');
        if (defectSizeCtx) {
            defectSizeChart = new Chart(defectSizeCtx, {
                type: 'bar',
                data: {
                    labels: ['0-2mm', '2-4mm', '4-6mm', '6-8mm', '8-10mm'],
                    datasets: [{
                        label: '缺陷数量',
                        data: [0, 0, 0, 0, 0],
                        backgroundColor: 'rgba(75, 192, 192, 0.7)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: '数量'
                            }
                        },
                        x: {
                            title: {
                                display: true,
                                text: '尺寸范围'
                            }
                        }
                    },
                    plugins: {
                        title: {
                            display: true,
                            text: '缺陷尺寸分布'
                        }
                    }
                }
            });
        }
        
        // 缺陷趋势图表
        const defectTrendCtx = document.getElementById('defect-trend-chart');
        if (defectTrendCtx) {
            defectTrendChart = new Chart(defectTrendCtx, {
                type: 'line',
                data: {
                    labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
                    datasets: [
                        {
                            label: '气孔',
                            data: [2, 1, 0, 3, 4, 0, 5, 1, 2],
                            borderColor: 'rgba(255, 99, 132, 1)',
                            backgroundColor: 'rgba(255, 99, 132, 0.1)',
                            tension: 0.4,
                            fill: true
                        },
                        {
                            label: '夹杂',
                            data: [1, 3, 0, 1, 2, 2, 1, 0, 3],
                            borderColor: 'rgba(54, 162, 235, 1)',
                            backgroundColor: 'rgba(54, 162, 235, 0.1)',
                            tension: 0.4,
                            fill: true
                        },
                        {
                            label: '裂纹',
                            data: [0, 1, 2, 0, 0, 1, 1, 3, 0],
                            borderColor: 'rgba(255, 206, 86, 1)',
                            backgroundColor: 'rgba(255, 206, 86, 0.1)',
                            tension: 0.4,
                            fill: true
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: '缺陷数量'
                            }
                        },
                        x: {
                            title: {
                                display: true,
                                text: '样本编号'
                            }
                        }
                    },
                    plugins: {
                        title: {
                            display: true,
                            text: '缺陷检测趋势'
                        }
                    }
                }
            });
        }
    }
    
    // 更新所有图表
    function updateCharts(sampleId) {
        const data = defectsData[sampleId];
        if (!data) return;
        
        // 更新缺陷类型图表
        if (defectTypeChart) {
            defectTypeChart.data.datasets[0].data = [
                data.defectTypes['气孔'],
                data.defectTypes['夹杂'],
                data.defectTypes['裂纹']
            ];
            defectTypeChart.update();
        }
        
        // 更新缺陷尺寸图表
        if (defectSizeChart) {
            // 按尺寸范围分组统计
            const sizeRanges = [0, 0, 0, 0, 0]; // 0-2mm, 2-4mm, 4-6mm, 6-8mm, 8-10mm
            
            data.defectSizes.forEach(size => {
                const rangeIndex = Math.min(Math.floor(size / 2), 4);
                sizeRanges[rangeIndex]++;
            });
            
            defectSizeChart.data.datasets[0].data = sizeRanges;
            defectSizeChart.update();
        }
    }
    
    // 更新缺陷类型图表（根据过滤）
    function updateDefectTypeChart(selectedTypes) {
        const currentSample = sampleSelect.value;
        const data = defectsData[currentSample];
        if (!data || !defectTypeChart) return;
        
        const filteredData = [
            selectedTypes.includes('气孔') ? data.defectTypes['气孔'] : 0,
            selectedTypes.includes('夹杂') ? data.defectTypes['夹杂'] : 0,
            selectedTypes.includes('裂纹') ? data.defectTypes['裂纹'] : 0
        ];
        
        defectTypeChart.data.datasets[0].data = filteredData;
        defectTypeChart.update();
    }
    
    // 更新缺陷尺寸图表（根据过滤）
    function updateDefectSizeChart(minSize) {
        const currentSample = sampleSelect.value;
        const data = defectsData[currentSample];
        if (!data || !defectSizeChart) return;
        
        // 按尺寸范围分组统计
        const sizeRanges = [0, 0, 0, 0, 0]; // 0-2mm, 2-4mm, 4-6mm, 6-8mm, 8-10mm
        
        data.defectSizes.forEach(size => {
            if (size >= minSize) {
                const rangeIndex = Math.min(Math.floor(size / 2), 4);
                sizeRanges[rangeIndex]++;
            }
        });
        
        defectSizeChart.data.datasets[0].data = sizeRanges;
        defectSizeChart.update();
    }
    
    // 初始化显示第一个样本
    updateVisualization('detected_image_2');
}

// 初始化缺陷图像交互功能
function initDefectImageInteraction() {
    // 获取DOM元素
    const sampleSelector = document.getElementById('sample-selector');
    const porositySelector = document.getElementById('porosity-selector');
    const realSelector = document.getElementById('real-selector');
    
    const defectImage = document.getElementById('defect-image');
    const porosityImage = document.getElementById('porosity-image');
    const realImage = document.getElementById('real-image');
    
    const filterPore = document.getElementById('filter-pore');
    const filterInclusion = document.getElementById('filter-inclusion');
    const filterCrack = document.getElementById('filter-crack');
    const sizeFilter = document.getElementById('size-filter');
    
    const mode3d = document.getElementById('mode-3d');
    const modeSlice = document.getElementById('mode-slice');
    const modeHeatmap = document.getElementById('mode-heatmap');
    
    const collectionDefects = document.getElementById('collection-defects');
    const collectionPorosity = document.getElementById('collection-porosity');
    const collectionReal = document.getElementById('collection-real');
    
    const defectsGallery = document.querySelector('.defects-gallery');
    const porosityGallery = document.querySelector('.porosity-gallery');
    const realGallery = document.querySelector('.real-gallery');
    
    const threeDContainer = document.getElementById('three-d-container');
    
    // 创建示例缺陷图像（当真实图像无法加载时使用）
    const sampleImages = {
        'defects': {
            '2': createSampleImage('red', 3, 'detected_defects'),
            '3': createSampleImage('green', 2, 'detected_defects'),
            '4': createSampleImage('red', 1, 'detected_defects'),
            '5': createSampleImage('blue', 1, 'detected_defects'),
            '6': createSampleImage('red,green', 4, 'detected_defects'),
            '7': createSampleImage('red,blue', 3, 'detected_defects'),
            '8': createSampleImage('green,blue', 2, 'detected_defects'),
            '9': createSampleImage('red', 2, 'detected_defects')
        },
        'porosity': {
            '1': createSampleImage('red', 5, 'porosity'),
            '10': createSampleImage('red', 3, 'porosity'),
            '11': createSampleImage('red', 4, 'porosity'),
            '12': createSampleImage('red', 6, 'porosity'),
            '13': createSampleImage('red', 4, 'porosity')
        },
        'real': {
            '12': createSampleImage('yellow,red', 3, 'real_scene'),
            '13': createSampleImage('yellow,red', 4, 'real_scene'),
            '14': createSampleImage('yellow,red', 5, 'real_scene'),
            '15': createSampleImage('yellow,red', 2, 'real_scene')
        }
    };
    
    // 定义缺陷类型数据 (模拟数据)
    const defectTypes = {
        'defects': {
            '2': { pore: true, inclusion: false, crack: false, size: 70 },
            '3': { pore: false, inclusion: true, crack: false, size: 50 },
            '4': { pore: true, inclusion: false, crack: false, size: 60 },
            '5': { pore: false, inclusion: false, crack: true, size: 80 },
            '6': { pore: true, inclusion: true, crack: false, size: 40 },
            '7': { pore: true, inclusion: false, crack: true, size: 65 },
            '8': { pore: false, inclusion: true, crack: true, size: 75 },
            '9': { pore: true, inclusion: false, crack: false, size: 55 }
        },
        'porosity': {
            '1': { pore: true, inclusion: false, crack: false, size: 85 },
            '10': { pore: true, inclusion: false, crack: false, size: 60 },
            '11': { pore: true, inclusion: false, crack: false, size: 75 },
            '12': { pore: true, inclusion: false, crack: false, size: 80 },
            '13': { pore: true, inclusion: false, crack: false, size: 65 }
        },
        'real': {
            '12': { pore: true, inclusion: true, crack: false, size: 65 },
            '13': { pore: true, inclusion: true, crack: false, size: 70 },
            '14': { pore: true, inclusion: true, crack: false, size: 75 },
            '15': { pore: true, inclusion: true, crack: false, size: 80 }
        }
    };
    
    // 当前选择的集合和样本
    let currentCollection = 'defects';
    let currentSample = '2';
    
    // 集合切换处理
    collectionDefects.addEventListener('change', function() {
        if (this.checked) switchCollection('defects');
    });
    
    collectionPorosity.addEventListener('change', function() {
        if (this.checked) switchCollection('porosity');
    });
    
    collectionReal.addEventListener('change', function() {
        if (this.checked) switchCollection('real');
    });
    
    // 切换图像集合
    function switchCollection(collection) {
        // 隐藏所有图像和选择器
        defectImage.style.display = 'none';
        porosityImage.style.display = 'none';
        realImage.style.display = 'none';
        
        sampleSelector.style.display = 'none';
        porositySelector.style.display = 'none';
        realSelector.style.display = 'none';
        
        defectsGallery.style.display = 'none';
        porosityGallery.style.display = 'none';
        realGallery.style.display = 'none';
        
        // 显示对应的图像和选择器
        currentCollection = collection;
        switch(collection) {
            case 'defects':
                defectImage.style.display = 'block';
                sampleSelector.style.display = 'block';
                defectsGallery.style.display = 'block';
                currentSample = sampleSelector.value;
                break;
            case 'porosity':
                porosityImage.style.display = 'block';
                porositySelector.style.display = 'block';
                porosityGallery.style.display = 'block';
                currentSample = porositySelector.value;
                break;
            case 'real':
                realImage.style.display = 'block';
                realSelector.style.display = 'block';
                realGallery.style.display = 'block';
                currentSample = realSelector.value;
                break;
        }
        
        // 更新可视化
        updateVisualization(currentCollection, currentSample);
    }
    
    // 处理样本选择变化
    sampleSelector.addEventListener('change', function() {
        currentSample = this.value;
        updateVisualization('defects', currentSample);
    });
    
    porositySelector.addEventListener('change', function() {
        currentSample = this.value;
        updateVisualization('porosity', currentSample);
    });
    
    realSelector.addEventListener('change', function() {
        currentSample = this.value;
        updateVisualization('real', currentSample);
    });
    
    // 处理缺陷类型筛选
    filterPore.addEventListener('change', filterDefects);
    filterInclusion.addEventListener('change', filterDefects);
    filterCrack.addEventListener('change', filterDefects);
    
    // 处理尺寸筛选
    sizeFilter.addEventListener('input', filterBySize);
    
    // 处理显示模式
    mode3d.addEventListener('change', updateDisplayMode);
    modeSlice.addEventListener('change', updateDisplayMode);
    modeHeatmap.addEventListener('change', updateDisplayMode);
    
    // 初始化画廊交互
    initGalleryItems();
    
    // 初始化默认图像
    updateVisualization('defects', '2');
    
    // 初始化画廊点击事件
    function initGalleryItems() {
        const galleryItems = document.querySelectorAll('.gallery-item');
        galleryItems.forEach(item => {
            item.addEventListener('click', function() {
                const collection = this.getAttribute('data-collection');
                const sample = this.getAttribute('data-sample');
                
                // 更新对应的选择器
                switch(collection) {
                    case 'defects':
                        sampleSelector.value = sample;
                        collectionDefects.checked = true;
                        break;
                    case 'porosity':
                        porositySelector.value = sample;
                        collectionPorosity.checked = true;
                        break;
                    case 'real':
                        realSelector.value = sample;
                        collectionReal.checked = true;
                        break;
                }
                
                // 切换到对应的集合和样本
                switchCollection(collection);
                updateVisualization(collection, sample);
                
                // 更新选中状态
                document.querySelectorAll('.gallery-item').forEach(el => {
                    el.classList.remove('active');
                });
                this.classList.add('active');
            });
        });
        
        // 默认选中第一个
        const defaultItem = document.querySelector('.gallery-item[data-collection="defects"][data-sample="2"]');
        if (defaultItem) {
            defaultItem.classList.add('active');
        }
    }
    
    // 更新可视化
    function updateVisualization(collection, sampleId) {
        let targetImage;
        let imagePath;
        
        // 确定目标图像和路径
        switch(collection) {
            case 'defects':
                targetImage = defectImage;
                imagePath = `./2025IDTC/Detected_Defects/detected_image_${sampleId}.png`;
                break;
            case 'porosity':
                targetImage = porosityImage;
                imagePath = `./2025IDTC/Detected_Porosity/image_${sampleId}.png`;
                break;
            case 'real':
                targetImage = realImage;
                imagePath = `./2025IDTC/Detected_Real_Images/image_${sampleId}.png`;
                break;
        }
        
        if(!targetImage) return;
        
        // 添加加载中状态
        targetImage.parentElement.classList.add('loading');
        
        // 设置数据属性
        targetImage.setAttribute('data-original-src', imagePath);
        
        // 尝试加载真实图像
        const testImage = new Image();
        testImage.onload = function() {
            targetImage.src = imagePath;
            targetImage.parentElement.classList.remove('loading');
        };
        testImage.onerror = function() {
            console.log(`Failed to load image: ${imagePath}`);
            // 如果有示例图像就使用
            if (sampleImages[collection] && sampleImages[collection][sampleId]) {
                targetImage.src = sampleImages[collection][sampleId];
            }
            targetImage.parentElement.classList.remove('loading');
        };
        testImage.src = imagePath;
        
        // 应用当前筛选条件
        filterDefects();
        updateDisplayMode();
        
        // 更新画廊选中状态
        updateGallerySelection(collection, sampleId);
    }
    
    // 更新画廊选中状态
    function updateGallerySelection(collection, sampleId) {
        document.querySelectorAll('.gallery-item').forEach(item => {
            item.classList.remove('active');
        });
        
        const selectedItem = document.querySelector(`.gallery-item[data-collection="${collection}"][data-sample="${sampleId}"]`);
        if (selectedItem) {
            selectedItem.classList.add('active');
            // 滚动到可见
            selectedItem.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
        }
    }
    
    // 创建示例缺陷图像 (SVG格式的Data URL)
    function createSampleImage(colors, defectCount, type) {
        const colorArray = colors.split(',');
        let circles = '';
        
        for (let i = 0; i < defectCount; i++) {
            const color = colorArray[i % colorArray.length];
            const cx = 200 + i * 100;
            const cy = 200 + (i % 2) * 100;
            const r = 20 + (i % 3) * 10;
            
            circles += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${color}" />`;
        }
        
        let title, background;
        switch(type) {
            case 'detected_defects':
                title = '缺陷检测示例';
                background = '#333333';
                break;
            case 'porosity':
                title = '气孔检测示例';
                background = '#222222';
                break;
            case 'real_scene':
                title = '真实场景示例';
                background = '#111111';
                break;
            default:
                title = '示例图像';
                background = '#444444';
        }
        
        const svgContent = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600">
          <rect width="800" height="600" fill="${background}"/>
          <text x="400" y="100" font-family="Arial" font-size="24" text-anchor="middle" fill="#ffffff">
            ${title} - 样本 ${defectCount}
          </text>
          ${circles}
          <text x="400" y="500" font-family="Arial" font-size="18" text-anchor="middle" fill="#ffffff">
            检测到 ${defectCount} 个缺陷
          </text>
        </svg>
        `;
        
        return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgContent)));
    }
    
    // 获取当前活动的图像元素
    function getCurrentImage() {
        switch(currentCollection) {
            case 'defects': return defectImage;
            case 'porosity': return porosityImage;
            case 'real': return realImage;
            default: return defectImage;
        }
    }
    
    // 过滤缺陷类型
    function filterDefects() {
        if (!defectTypes[currentCollection] || !defectTypes[currentCollection][currentSample]) return;
        
        const sampleData = defectTypes[currentCollection][currentSample];
        const currentImage = getCurrentImage();
        
        // 检查样本是否包含当前选择的缺陷类型
        let shouldShow = (
            (filterPore.checked && sampleData.pore) || 
            (filterInclusion.checked && sampleData.inclusion) || 
            (filterCrack.checked && sampleData.crack)
        );
        
        // 更新显示状态
        currentImage.style.opacity = shouldShow ? '1' : '0.3';
        
        // 更新统计图表
        updateDefectChart();
    }
    
    // 按尺寸筛选
    function filterBySize() {
        if (!defectTypes[currentCollection] || !defectTypes[currentCollection][currentSample]) return;
        
        const sizeValue = sizeFilter.value;
        const sampleData = defectTypes[currentCollection][currentSample];
        const currentImage = getCurrentImage();
        
        // 检查样本尺寸是否在筛选范围内
        const shouldShow = sampleData.size >= sizeValue;
        
        // 应用筛选效果，保留当前显示模式
        applyFilterEffects(currentImage);
        
        // 更新统计图表
        updateDefectChart();
    }
    
    // 更新显示模式
    function updateDisplayMode() {
        const currentImage = getCurrentImage();
        applyFilterEffects(currentImage);
    }
    
    // 应用筛选和显示模式效果
    function applyFilterEffects(imageElement) {
        if (!imageElement) return;
        
        // 获取当前的尺寸筛选值
        const sizeValue = sizeFilter.value;
        const sampleData = defectTypes[currentCollection][currentSample];
        const shouldShow = sampleData && sampleData.size >= sizeValue;
        
        // 确定显示模式
        let filterStyle = '';
        
        if (mode3d.checked) {
            imageElement.style.display = 'block';
            threeDContainer.style.display = 'none';
            filterStyle = '';
        } else if (modeSlice.checked) {
            imageElement.style.display = 'block';
            threeDContainer.style.display = 'none';
            filterStyle = 'grayscale(100%)';
        } else if (modeHeatmap.checked) {
            imageElement.style.display = 'block';
            threeDContainer.style.display = 'none';
            filterStyle = 'hue-rotate(180deg) saturate(200%)';
        }
        
        // 组合筛选器
        if (filterStyle) {
            imageElement.style.filter = `${filterStyle} brightness(${shouldShow ? 1 : 0.5})`;
        } else {
            imageElement.style.filter = `brightness(${shouldShow ? 1 : 0.5})`;
        }
    }
    
    // 更新缺陷统计图表
    function updateDefectChart() {
        const defectChartCanvas = document.getElementById('defect-chart');
        if (!defectChartCanvas) return;
        
        const ctx = defectChartCanvas.getContext('2d');
        
        // 计算当前可见缺陷数量
        let poreCount = 0;
        let inclusionCount = 0;
        let crackCount = 0;
        
        for (const collectionKey in defectTypes) {
            for (const sampleId in defectTypes[collectionKey]) {
                const sample = defectTypes[collectionKey][sampleId];
                
                // 根据筛选条件统计缺陷数量
                if (filterPore.checked && sample.pore && sample.size >= sizeFilter.value) {
                    poreCount++;
                }
                if (filterInclusion.checked && sample.inclusion && sample.size >= sizeFilter.value) {
                    inclusionCount++;
                }
                if (filterCrack.checked && sample.crack && sample.size >= sizeFilter.value) {
                    crackCount++;
                }
            }
        }
        
        // 更新图表数据
        window.defectChart.data.datasets[0].data = [poreCount, inclusionCount, crackCount];
        window.defectChart.update();
    }
}

// 初始化网络架构图交互功能
function initNetworkDiagramInteraction() {
    const networkDiagram = document.querySelector('.network-diagram');
    
    if (networkDiagram) {
        // 添加点击事件，打开大图
        networkDiagram.addEventListener('click', function() {
            openLightbox(this.src);
        });
        
        // 图片加载完成后，检查尺寸
        networkDiagram.addEventListener('load', function() {
            console.log('Network diagram loaded successfully');
        });
        
        // 图片加载失败处理
        networkDiagram.addEventListener('error', function() {
            console.error('Failed to load network diagram image');
            // 替换为默认图像
            this.src = 'images/mask-rcnn-diagram.svg';
        });
    }
}

// 打开大图查看
function openLightbox(imageSrc) {
    // 创建遮罩层
    const overlay = document.createElement('div');
    overlay.className = 'lightbox-overlay';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.zIndex = '9999';
    
    // 创建图片容器
    const imageContainer = document.createElement('div');
    imageContainer.style.position = 'relative';
    imageContainer.style.maxWidth = '90%';
    imageContainer.style.maxHeight = '90%';
    
    // 创建图片元素
    const image = document.createElement('img');
    image.src = imageSrc;
    image.style.maxWidth = '100%';
    image.style.maxHeight = '90vh';
    image.style.border = '2px solid white';
    image.style.borderRadius = '4px';
    
    // 创建关闭按钮
    const closeButton = document.createElement('button');
    closeButton.textContent = '×';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '-40px';
    closeButton.style.right = '0';
    closeButton.style.backgroundColor = 'transparent';
    closeButton.style.border = 'none';
    closeButton.style.color = 'white';
    closeButton.style.fontSize = '30px';
    closeButton.style.cursor = 'pointer';
    
    // 点击关闭遮罩层
    overlay.addEventListener('click', function() {
        document.body.removeChild(overlay);
    });
    
    // 阻止图片点击事件冒泡
    image.addEventListener('click', function(e) {
        e.stopPropagation();
    });
    
    // 添加到DOM
    imageContainer.appendChild(image);
    imageContainer.appendChild(closeButton);
    overlay.appendChild(imageContainer);
    document.body.appendChild(overlay);
}

function initializeVisualization() {
    // Load sample options
    const sampleSelect = document.getElementById('sample-select');
    if (!sampleSelect) return;
    
    // Sample data - would be replaced with real data from backend
    const samples = [
        { id: 1, name: "样本 #1 - X射线图像001" },
        { id: 2, name: "样本 #2 - X射线图像002" },
        { id: 3, name: "样本 #3 - X射线图像003" },
        { id: 4, name: "样本 #4 - X射线图像004" },
    ];
    
    // Populate sample dropdown
    samples.forEach(sample => {
        const option = document.createElement('option');
        option.value = sample.id;
        option.textContent = sample.name;
        sampleSelect.appendChild(option);
    });
    
    // Initialize filter handlers
    const defectTypeFilters = document.querySelectorAll('.defect-type-filter input');
    defectTypeFilters.forEach(filter => {
        filter.addEventListener('change', updateVisualization);
    });
    
    const sizeRange = document.getElementById('size-range');
    if (sizeRange) {
        sizeRange.addEventListener('input', function() {
            document.getElementById('size-value').textContent = sizeRange.value + 'mm';
            updateVisualization();
        });
    }
    
    const displayModes = document.querySelectorAll('.display-mode-option input');
    displayModes.forEach(mode => {
        mode.addEventListener('change', updateVisualization);
    });
    
    sampleSelect.addEventListener('change', updateVisualization);
    
    // Initial update
    updateVisualization();
    
    // Create charts
    createDefectTypeChart();
    createDefectSizeChart();
    createDefectTrendChart();
}

function updateVisualization() {
    const sampleId = document.getElementById('sample-select').value;
    
    // Get selected defect types
    const selectedDefectTypes = Array.from(
        document.querySelectorAll('.defect-type-filter input:checked')
    ).map(input => input.value);
    
    // Get size filter
    const sizeThreshold = document.getElementById('size-range').value;
    
    // Get display mode
    const displayMode = document.querySelector('.display-mode-option input:checked').value;
    
    // Update the visualization content based on selections
    const visualizationContent = document.querySelector('.visualization-content');
    if (!visualizationContent) return;
    
    // Update image based on sample and filters
    const imageDisplay = document.getElementById('image-display');
    if (imageDisplay) {
        // In a real implementation, this would fetch the appropriate image
        // For now, just use a placeholder with the sample ID
        imageDisplay.src = `./2025IDTC/Detected_Defects/detected_image_${sampleId}.png`;
        imageDisplay.onerror = function() {
            this.src = './images/placeholder-defect.svg';
        };
        
        // Apply display mode as CSS filter
        imageDisplay.className = ''; // Reset classes
        switch(displayMode) {
            case '3D模型':
                // No filter for 3D model
                break;
            case '截面视图':
                imageDisplay.classList.add('cross-section-filter');
                break;
            case '热图':
                imageDisplay.classList.add('heatmap-filter');
                break;
        }
    }
    
    // Update charts based on selected filters
    updateCharts(sampleId, selectedDefectTypes, sizeThreshold);
}

function updateCharts(sampleId, defectTypes, sizeThreshold) {
    // Update existing charts with new data based on filters
    // This would typically involve API calls to get filtered data
    
    // For demonstration, just update with random data
    updateDefectTypeChart(defectTypes);
    updateDefectSizeChart(sizeThreshold);
    updateDefectTrendChart(sampleId);
}

function createDefectTypeChart() {
    const ctx = document.getElementById('defect-type-chart');
    if (!ctx) return;
    
    // Sample data
    const defectTypes = {
        '气孔': 45,
        '夹杂': 30,
        '裂纹': 25
    };
    
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: Object.keys(defectTypes),
            datasets: [{
                data: Object.values(defectTypes),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.7)',
                    'rgba(54, 162, 235, 0.7)',
                    'rgba(255, 206, 86, 0.7)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                },
                title: {
                    display: true,
                    text: '缺陷类型分布'
                }
            }
        }
    });
}

function updateDefectTypeChart(selectedTypes) {
    // In a real implementation, this would update the chart with filtered data
    // For now, just simulate changes
    
    // This function would update the existing chart with new data
    // based on the selected defect types
}

function createDefectSizeChart() {
    const container = document.querySelector('.visualization-charts');
    if (!container) return;
    
    // Create canvas for size chart
    const chartContainer = document.createElement('div');
    chartContainer.className = 'chart-container';
    
    const canvas = document.createElement('canvas');
    canvas.id = 'defect-size-chart';
    chartContainer.appendChild(canvas);
    container.appendChild(chartContainer);
    
    // Sample data for defect sizes
    const sizeData = {
        labels: ['0-1mm', '1-2mm', '2-3mm', '3-4mm', '4-5mm', '>5mm'],
        values: [15, 25, 30, 20, 8, 2]
    };
    
    new Chart(canvas, {
        type: 'bar',
        data: {
            labels: sizeData.labels,
            datasets: [{
                label: '缺陷尺寸分布',
                data: sizeData.values,
                backgroundColor: 'rgba(75, 192, 192, 0.7)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: '数量'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: '尺寸范围'
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: '缺陷尺寸分布'
                }
            }
        }
    });
}

function updateDefectSizeChart(sizeThreshold) {
    // This function would update the size chart based on the threshold
}

function createDefectTrendChart() {
    const container = document.querySelector('.visualization-charts');
    if (!container) return;
    
    // Create canvas for trend chart
    const chartContainer = document.createElement('div');
    chartContainer.className = 'chart-container';
    
    const canvas = document.createElement('canvas');
    canvas.id = 'defect-trend-chart';
    chartContainer.appendChild(canvas);
    container.appendChild(chartContainer);
    
    // Sample data for defect trend
    const trendData = {
        labels: ['1月', '2月', '3月', '4月', '5月', '6月'],
        datasets: [
            {
                label: '气孔',
                data: [12, 19, 15, 17, 14, 13],
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                tension: 0.4,
                fill: true
            },
            {
                label: '夹杂',
                data: [7, 11, 13, 8, 10, 9],
                borderColor: 'rgba(54, 162, 235, 1)',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                tension: 0.4,
                fill: true
            },
            {
                label: '裂纹',
                data: [5, 8, 6, 9, 7, 4],
                borderColor: 'rgba(255, 206, 86, 1)',
                backgroundColor: 'rgba(255, 206, 86, 0.2)',
                tension: 0.4,
                fill: true
            }
        ]
    };
    
    new Chart(canvas, {
        type: 'line',
        data: {
            labels: trendData.labels,
            datasets: trendData.datasets
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: '缺陷数量'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: '时间'
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: '缺陷检测趋势分析'
                }
            }
        }
    });
}

function updateDefectTrendChart(sampleId) {
    // This function would update the trend chart based on the selected sample
} 