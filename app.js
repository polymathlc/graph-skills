// Graph Skills App - Interactive Line Graph Teaching Tool

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all canvases
    initStepCanvases();
    initFAQCanvases();
    initPracticeCanvas();
    initFAQToggle();
    initScenarioTabs();
    initScenarioCanvases();
});

// Scenario Tabs
function initScenarioTabs() {
    const tabs = document.querySelectorAll('.scenario-tab');
    const panels = document.querySelectorAll('.scenario-panel');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const scenario = tab.dataset.scenario;
            
            // Update tabs
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Update panels
            panels.forEach(p => p.classList.remove('active'));
            document.getElementById(`scenario-${scenario}`).classList.add('active');
        });
    });
}

// Scenario State
const scenarioState = {
    taxi: { showPoints: false, showLine: false },
    study: { showPoints: false, showLine: false },
    spring: { showPoints: false, showLine: false },
    cooling: { showPoints: false, showLine: false }
};

// Scenario Data
const scenarioData = {
    taxi: {
        data: [{x: 0, y: 4}, {x: 2, y: 6.4}, {x: 4, y: 8.8}, {x: 6, y: 11.2}, {x: 8, y: 13.6}, {x: 10, y: 16}],
        options: { maxX: 12, maxY: 18, xStep: 2, yStep: 4, xLabel: 'Distance (km)', yLabel: 'Fare ($)', lineStartY: 4, color: '#667eea' }
    },
    study: {
        data: [{x: 0, y: 35}, {x: 1, y: 45}, {x: 2, y: 58}, {x: 3, y: 68}, {x: 4, y: 75}, {x: 5, y: 85}],
        options: { maxX: 6, maxY: 100, xStep: 1, yStep: 20, xLabel: 'Hours Studied', yLabel: 'Score (%)', lineStartY: 35, color: '#10b981' }
    },
    spring: {
        data: [{x: 0, y: 5}, {x: 50, y: 6.2}, {x: 100, y: 7.5}, {x: 150, y: 8.6}, {x: 200, y: 10}, {x: 250, y: 11.3}],
        options: { maxX: 300, maxY: 14, xStep: 50, yStep: 2, xLabel: 'Mass (g)', yLabel: 'Length (cm)', lineStartY: 5, color: '#f59e0b' }
    },
    cooling: {
        data: [{x: 0, y: 80}, {x: 2, y: 68}, {x: 4, y: 55}, {x: 6, y: 45}, {x: 8, y: 38}, {x: 10, y: 32}],
        options: { maxX: 12, maxY: 100, xStep: 2, yStep: 20, xLabel: 'Time (min)', yLabel: 'Temp (°C)', lineStartY: 80, color: '#ef4444', curve: true }
    }
};

// Scenario Canvases
function initScenarioCanvases() {
    drawAllScenarios();
    initScenarioButtons();
}

function initScenarioButtons() {
    document.querySelectorAll('.scenario-buttons button').forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.dataset.action;
            const scenario = btn.dataset.scenario;
            
            if (action === 'points') {
                scenarioState[scenario].showPoints = !scenarioState[scenario].showPoints;
                btn.textContent = scenarioState[scenario].showPoints ? 'Hide Points' : 'Show Points';
            } else if (action === 'line') {
                scenarioState[scenario].showLine = !scenarioState[scenario].showLine;
                btn.textContent = scenarioState[scenario].showLine ? 'Hide Best-Fit Line' : 'Show Best-Fit Line';
            } else if (action === 'reset') {
                scenarioState[scenario].showPoints = false;
                scenarioState[scenario].showLine = false;
                // Reset button texts
                const panel = document.getElementById(`scenario-${scenario}`);
                panel.querySelector('[data-action="points"]').textContent = 'Show Points';
                panel.querySelector('[data-action="line"]').textContent = 'Show Best-Fit Line';
            }
            
            drawScenario(scenario);
        });
    });
}

function drawAllScenarios() {
    ['taxi', 'study', 'spring', 'cooling'].forEach(drawScenario);
}

function drawScenario(scenarioName) {
    const canvasId = `scenario${scenarioName.charAt(0).toUpperCase() + scenarioName.slice(1)}Canvas`;
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const { data, options } = scenarioData[scenarioName];
    const state = scenarioState[scenarioName];
    
    drawScenarioGraph(ctx, canvas, data, options, state.showPoints, state.showLine);
}

function drawScenarioGraph(ctx, canvas, data, options, showPoints, showLine) {
    const margin = 50;
    const width = canvas.width - margin - 20;
    const height = canvas.height - margin - 30;
    
    const scaleX = width / options.maxX;
    const scaleY = height / options.maxY;
    
    // Clear
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Grid
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    
    for (let i = 0; i <= options.maxX; i += options.xStep) {
        const x = margin + i * scaleX;
        ctx.beginPath();
        ctx.moveTo(x, 15);
        ctx.lineTo(x, canvas.height - margin);
        ctx.stroke();
    }
    
    for (let i = 0; i <= options.maxY; i += options.yStep) {
        const y = canvas.height - margin - i * scaleY;
        ctx.beginPath();
        ctx.moveTo(margin, y);
        ctx.lineTo(canvas.width - 15, y);
        ctx.stroke();
    }
    
    // Axes
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(margin, 15);
    ctx.lineTo(margin, canvas.height - margin);
    ctx.lineTo(canvas.width - 15, canvas.height - margin);
    ctx.stroke();
    
    // Scale labels
    ctx.font = '10px Poppins';
    ctx.fillStyle = '#64748b';
    ctx.textAlign = 'center';
    
    for (let i = 0; i <= options.maxX; i += options.xStep) {
        ctx.fillText(i, margin + i * scaleX, canvas.height - margin + 18);
    }
    
    ctx.textAlign = 'right';
    for (let i = 0; i <= options.maxY; i += options.yStep) {
        ctx.fillText(i, margin - 8, canvas.height - margin - i * scaleY + 4);
    }
    
    // Axis labels
    ctx.fillStyle = '#64748b';
    ctx.font = '11px Poppins';
    ctx.textAlign = 'center';
    ctx.fillText(options.xLabel, margin + width / 2, canvas.height - 5);
    
    ctx.save();
    ctx.translate(14, canvas.height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(options.yLabel, 0, 0);
    ctx.restore();
    
    // Draw best-fit line
    if (showLine) {
        ctx.strokeStyle = options.color;
        ctx.lineWidth = 3;
        ctx.beginPath();
        
        if (options.curve) {
            // Curved line for cooling
            ctx.moveTo(margin, canvas.height - margin - data[0].y * scaleY);
            for (let i = 1; i < data.length; i++) {
                const px = margin + data[i].x * scaleX;
                const py = canvas.height - margin - data[i].y * scaleY;
                const prevX = margin + data[i-1].x * scaleX;
                const prevY = canvas.height - margin - data[i-1].y * scaleY;
                ctx.quadraticCurveTo(prevX + (px - prevX) * 0.5, prevY, px, py);
            }
        } else {
            // Straight line
            const firstY = canvas.height - margin - options.lineStartY * scaleY;
            const lastData = data[data.length - 1];
            const lastX = margin + lastData.x * scaleX;
            const lastY = canvas.height - margin - lastData.y * scaleY;
            ctx.moveTo(margin, firstY);
            ctx.lineTo(lastX, lastY);
        }
        ctx.stroke();
        
        // Highlight y-intercept
        ctx.fillStyle = options.color;
        ctx.globalAlpha = 0.3;
        ctx.beginPath();
        ctx.arc(margin, canvas.height - margin - data[0].y * scaleY, 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
        
        // Y-intercept label
        ctx.fillStyle = options.color;
        ctx.font = 'bold 10px Poppins';
        ctx.textAlign = 'left';
        ctx.fillText(`(0, ${data[0].y})`, margin + 15, canvas.height - margin - data[0].y * scaleY + 4);
    }
    
    // Draw points
    if (showPoints) {
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 2;
        data.forEach(point => {
            const px = margin + point.x * scaleX;
            const py = canvas.height - margin - point.y * scaleY;
            drawXMark(ctx, px, py, 5);
        });
    }
    
    // Instruction text if nothing shown
    if (!showPoints && !showLine) {
        ctx.fillStyle = '#94a3b8';
        ctx.font = '12px Poppins';
        ctx.textAlign = 'center';
        ctx.fillText('Click "Show Points" to start!', canvas.width / 2, canvas.height / 2);
    }
}

// FAQ Toggle
function initFAQToggle() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        // Open first item by default
        if (item.dataset.open === 'true') {
            item.classList.add('open');
        }
        
        question.addEventListener('click', () => {
            // Close others
            faqItems.forEach(other => {
                if (other !== item) other.classList.remove('open');
            });
            // Toggle this one
            item.classList.toggle('open');
        });
    });
}

// Step Canvases
function initStepCanvases() {
    drawStep1Canvas();
    drawStep2Canvas();
    drawStep3Canvas();
    drawStep4Canvas();
    drawStep5Canvas();
}

function drawStep1Canvas() {
    const canvas = document.getElementById('step1Canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    const margin = 40;
    const width = canvas.width - margin * 2;
    const height = canvas.height - margin * 2;
    
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw axes
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(margin, margin);
    ctx.lineTo(margin, canvas.height - margin);
    ctx.lineTo(canvas.width - margin, canvas.height - margin);
    ctx.stroke();
    
    // Arrows
    drawArrow(ctx, margin, margin, margin, margin - 10);
    drawArrow(ctx, canvas.width - margin, canvas.height - margin, canvas.width - margin + 10, canvas.height - margin);
    
    // Labels
    ctx.fillStyle = '#667eea';
    ctx.font = 'bold 12px Poppins';
    ctx.textAlign = 'center';
    ctx.fillText('Independent Variable', canvas.width / 2 + 20, canvas.height - 10);
    
    ctx.save();
    ctx.translate(15, canvas.height / 2 - 20);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Dependent Variable', 0, 0);
    ctx.restore();
}

function drawStep2Canvas() {
    const canvas = document.getElementById('step2Canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    const margin = 40;
    
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw axes
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(margin, margin);
    ctx.lineTo(margin, canvas.height - margin);
    ctx.lineTo(canvas.width - margin, canvas.height - margin);
    ctx.stroke();
    
    // Scale marks and numbers
    ctx.font = '10px Poppins';
    ctx.fillStyle = '#64748b';
    ctx.textAlign = 'center';
    
    // X-axis
    for (let i = 0; i <= 5; i++) {
        const x = margin + (i / 5) * (canvas.width - margin * 2);
        ctx.beginPath();
        ctx.moveTo(x, canvas.height - margin);
        ctx.lineTo(x, canvas.height - margin + 5);
        ctx.stroke();
        ctx.fillText(i * 10, x, canvas.height - margin + 15);
    }
    
    // Y-axis
    ctx.textAlign = 'right';
    for (let i = 0; i <= 5; i++) {
        const y = canvas.height - margin - (i / 5) * (canvas.height - margin * 2);
        ctx.beginPath();
        ctx.moveTo(margin, y);
        ctx.lineTo(margin - 5, y);
        ctx.stroke();
        ctx.fillText(i, margin - 10, y + 3);
    }
}

function drawStep3Canvas() {
    const canvas = document.getElementById('step3Canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    const margin = 50;
    
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw axes
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(margin, 20);
    ctx.lineTo(margin, canvas.height - margin);
    ctx.lineTo(canvas.width - 20, canvas.height - margin);
    ctx.stroke();
    
    // Labels with units
    ctx.fillStyle = '#667eea';
    ctx.font = 'bold 11px Poppins';
    ctx.textAlign = 'center';
    ctx.fillText('Light intensity (lux)', canvas.width / 2 + 20, canvas.height - 10);
    
    ctx.save();
    ctx.translate(15, canvas.height / 2 - 10);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Oxygen (cm³/min)', 0, 0);
    ctx.restore();
    
    // Highlight boxes around labels
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]);
    ctx.strokeRect(canvas.width / 2 - 50, canvas.height - 25, 130, 20);
    ctx.strokeRect(5, canvas.height / 2 - 55, 20, 90);
    ctx.setLineDash([]);
}

function drawStep4Canvas() {
    const canvas = document.getElementById('step4Canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    const margin = 40;
    
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw axes
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(margin, 20);
    ctx.lineTo(margin, canvas.height - margin);
    ctx.lineTo(canvas.width - 20, canvas.height - margin);
    ctx.stroke();
    
    // Sample points
    const points = [
        {x: 0, y: 0},
        {x: 10, y: 1.5},
        {x: 20, y: 2.8},
        {x: 30, y: 4.2},
        {x: 40, y: 5.5}
    ];
    
    const scaleX = (canvas.width - margin - 30) / 50;
    const scaleY = (canvas.height - margin - 30) / 6;
    
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 2;
    
    points.forEach(point => {
        const px = margin + point.x * scaleX;
        const py = canvas.height - margin - point.y * scaleY;
        
        // Draw X mark
        ctx.beginPath();
        ctx.moveTo(px - 5, py - 5);
        ctx.lineTo(px + 5, py + 5);
        ctx.moveTo(px + 5, py - 5);
        ctx.lineTo(px - 5, py + 5);
        ctx.stroke();
    });
}

function drawStep5Canvas() {
    const canvas = document.getElementById('step5Canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    const margin = 40;
    
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw axes
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(margin, 20);
    ctx.lineTo(margin, canvas.height - margin);
    ctx.lineTo(canvas.width - 20, canvas.height - margin);
    ctx.stroke();
    
    // Sample points (scattered)
    const points = [
        {x: 5, y: 1.0},
        {x: 10, y: 2.3},
        {x: 15, y: 2.8},
        {x: 20, y: 3.5},
        {x: 25, y: 4.0},
        {x: 30, y: 5.2}
    ];
    
    const scaleX = (canvas.width - margin - 30) / 35;
    const scaleY = (canvas.height - margin - 30) / 6;
    
    // Draw best-fit line first
    ctx.strokeStyle = '#667eea';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(margin, canvas.height - margin - 0.5 * scaleY);
    ctx.lineTo(canvas.width - 30, canvas.height - margin - 5.5 * scaleY);
    ctx.stroke();
    
    // Draw points
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 2;
    
    points.forEach(point => {
        const px = margin + point.x * scaleX;
        const py = canvas.height - margin - point.y * scaleY;
        
        ctx.beginPath();
        ctx.moveTo(px - 5, py - 5);
        ctx.lineTo(px + 5, py + 5);
        ctx.moveTo(px + 5, py - 5);
        ctx.lineTo(px - 5, py + 5);
        ctx.stroke();
    });
    
    // Labels for points above/below
    ctx.font = '10px Poppins';
    ctx.fillStyle = '#64748b';
}

// FAQ Canvases
function initFAQCanvases() {
    drawFAQ1Canvas();
    drawFAQ2Canvases();
    drawFAQ3Canvas();
    drawFAQ4Canvases();
    drawFAQ5Canvas();
}

function drawFAQ1Canvas() {
    const canvas = document.getElementById('faq1Canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    const margin = 50;
    
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 10; i++) {
        const x = margin + (i / 10) * (canvas.width - margin - 20);
        ctx.beginPath();
        ctx.moveTo(x, margin);
        ctx.lineTo(x, canvas.height - margin);
        ctx.stroke();
        
        const y = margin + (i / 10) * (canvas.height - margin - margin);
        ctx.beginPath();
        ctx.moveTo(margin, y);
        ctx.lineTo(canvas.width - 20, y);
        ctx.stroke();
    }
    
    // Draw axes
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(margin, margin);
    ctx.lineTo(margin, canvas.height - margin);
    ctx.lineTo(canvas.width - 20, canvas.height - margin);
    ctx.stroke();
    
    // Points that DON'T lie exactly on the line
    const points = [
        {x: 0, y: 0.5},
        {x: 1, y: 1.8},
        {x: 2, y: 2.2},
        {x: 3, y: 3.6},
        {x: 4, y: 3.9},
        {x: 5, y: 5.2}
    ];
    
    const scaleX = (canvas.width - margin - 40) / 5.5;
    const scaleY = (canvas.height - margin * 2) / 6;
    
    // Draw best-fit line
    ctx.strokeStyle = '#667eea';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(margin, canvas.height - margin - 0.2 * scaleY);
    ctx.lineTo(margin + 5.5 * scaleX, canvas.height - margin - 5.5 * scaleY);
    ctx.stroke();
    
    // Draw points
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 2;
    points.forEach(point => {
        const px = margin + point.x * scaleX;
        const py = canvas.height - margin - point.y * scaleY;
        drawXMark(ctx, px, py);
    });
}

function drawFAQ2Canvases() {
    // Good example - balanced
    const canvas1 = document.getElementById('faq2aCanvas');
    if (canvas1) {
        const ctx = canvas1.getContext('2d');
        drawBalancedGraph(ctx, canvas1, true);
    }
    
    // Bad example - unbalanced
    const canvas2 = document.getElementById('faq2bCanvas');
    if (canvas2) {
        const ctx = canvas2.getContext('2d');
        drawBalancedGraph(ctx, canvas2, false);
    }
}

function drawBalancedGraph(ctx, canvas, isBalanced) {
    const margin = 30;
    
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Axes
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(margin, 10);
    ctx.lineTo(margin, canvas.height - margin);
    ctx.lineTo(canvas.width - 10, canvas.height - margin);
    ctx.stroke();
    
    const scaleX = (canvas.width - margin - 20) / 5;
    const scaleY = (canvas.height - margin - 20) / 5;
    
    let points, lineY1, lineY2;
    
    if (isBalanced) {
        // Balanced - equal above and below
        points = [
            {x: 0.5, y: 1.2},  // below
            {x: 1.5, y: 2.3},  // above
            {x: 2.5, y: 2.2},  // below
            {x: 3.5, y: 3.8},  // above
            {x: 4.5, y: 4.3},  // below
        ];
        lineY1 = 0.5;
        lineY2 = 4.5;
    } else {
        // Unbalanced - most above
        points = [
            {x: 0.5, y: 1.5},
            {x: 1.5, y: 2.5},
            {x: 2.5, y: 3.0},
            {x: 3.5, y: 4.0},
            {x: 4.5, y: 4.8},
        ];
        lineY1 = 0;
        lineY2 = 3.5;
    }
    
    // Draw line
    ctx.strokeStyle = '#667eea';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(margin, canvas.height - margin - lineY1 * scaleY);
    ctx.lineTo(canvas.width - 10, canvas.height - margin - lineY2 * scaleY);
    ctx.stroke();
    
    // Draw points
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 2;
    points.forEach(point => {
        const px = margin + point.x * scaleX;
        const py = canvas.height - margin - point.y * scaleY;
        drawXMark(ctx, px, py);
    });
}

function drawFAQ3Canvas() {
    const canvas = document.getElementById('faq3Canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    const margin = 50;
    
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Axes
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(margin, margin);
    ctx.lineTo(margin, canvas.height - margin);
    ctx.lineTo(canvas.width - 20, canvas.height - margin);
    ctx.stroke();
    
    const scaleX = (canvas.width - margin - 40) / 6;
    const scaleY = (canvas.height - margin * 2) / 6;
    
    // Points including origin
    const points = [
        {x: 0, y: 0},
        {x: 1, y: 0.8},
        {x: 2, y: 1.9},
        {x: 3, y: 2.8},
        {x: 4, y: 4.2},
        {x: 5, y: 4.8}
    ];
    
    // Draw best-fit line (not forced through origin)
    ctx.strokeStyle = '#667eea';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(margin - 0.2 * scaleX, canvas.height - margin + 0.3 * scaleY);
    ctx.lineTo(margin + 5.5 * scaleX, canvas.height - margin - 5.3 * scaleY);
    ctx.stroke();
    
    // Label
    ctx.font = '10px Poppins';
    ctx.fillStyle = '#667eea';
    ctx.fillText('Line doesn\'t pass through (0,0)', margin + 2 * scaleX, canvas.height - margin + 15);
    
    // Highlight origin
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(margin, canvas.height - margin, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 8px Poppins';
    ctx.textAlign = 'center';
    ctx.fillText('0,0', margin, canvas.height - margin + 3);
    
    // Draw points
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 2;
    points.forEach(point => {
        const px = margin + point.x * scaleX;
        const py = canvas.height - margin - point.y * scaleY;
        drawXMark(ctx, px, py);
    });
}

function drawFAQ4Canvases() {
    // End of axis
    const canvas1 = document.getElementById('faq4aCanvas');
    if (canvas1) {
        const ctx = canvas1.getContext('2d');
        const margin = 40;
        
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(0, 0, canvas1.width, canvas1.height);
        
        // Axes
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(margin, 20);
        ctx.lineTo(margin, canvas1.height - margin);
        ctx.lineTo(canvas1.width - 10, canvas1.height - margin);
        ctx.stroke();
        
        // Labels at end
        ctx.fillStyle = '#667eea';
        ctx.font = 'bold 10px Poppins';
        ctx.textAlign = 'left';
        ctx.fillText('X (unit)', canvas1.width - 45, canvas1.height - margin + 15);
        ctx.fillText('Y', margin - 5, 15);
        ctx.fillText('(unit)', margin - 15, 28);
    }
    
    // Along the side
    const canvas2 = document.getElementById('faq4bCanvas');
    if (canvas2) {
        const ctx = canvas2.getContext('2d');
        const margin = 50;
        
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(0, 0, canvas2.width, canvas2.height);
        
        // Axes
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(margin, 20);
        ctx.lineTo(margin, canvas2.height - margin);
        ctx.lineTo(canvas2.width - 10, canvas2.height - margin);
        ctx.stroke();
        
        // Labels along side
        ctx.fillStyle = '#667eea';
        ctx.font = 'bold 10px Poppins';
        ctx.textAlign = 'center';
        ctx.fillText('X variable (unit)', canvas2.width / 2 + 10, canvas2.height - 10);
        
        ctx.save();
        ctx.translate(15, canvas2.height / 2 - 10);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText('Y variable (unit)', 0, 0);
        ctx.restore();
    }
}

function drawFAQ5Canvas() {
    const canvas = document.getElementById('faq5Canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    const margin = 50;
    
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Axes
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(margin, margin);
    ctx.lineTo(margin, canvas.height - margin);
    ctx.lineTo(canvas.width - 20, canvas.height - margin);
    ctx.stroke();
    
    const scaleX = (canvas.width - margin - 40) / 6;
    const scaleY = (canvas.height - margin * 2) / 5;
    
    // Curved data points
    const points = [
        {x: 0, y: 0},
        {x: 1, y: 1.8},
        {x: 2, y: 3.2},
        {x: 3, y: 4.0},
        {x: 4, y: 4.5},
        {x: 5, y: 4.7}
    ];
    
    // Draw smooth curve
    ctx.strokeStyle = '#667eea';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(margin, canvas.height - margin);
    
    // Bezier curve
    ctx.bezierCurveTo(
        margin + 1 * scaleX, canvas.height - margin - 2 * scaleY,
        margin + 2 * scaleX, canvas.height - margin - 4 * scaleY,
        margin + 5.5 * scaleX, canvas.height - margin - 4.8 * scaleY
    );
    ctx.stroke();
    
    // Draw points
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 2;
    points.forEach(point => {
        const px = margin + point.x * scaleX;
        const py = canvas.height - margin - point.y * scaleY;
        drawXMark(ctx, px, py);
    });
    
    // Label
    ctx.font = '11px Poppins';
    ctx.fillStyle = '#667eea';
    ctx.fillText('Smooth curve of best fit', canvas.width / 2, margin - 5);
}

function drawFAQ6Canvas() {
    const canvas = document.getElementById('faq6Canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    const margin = 50;
    
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Grid
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 8; i++) {
        const x = margin + (i / 8) * (canvas.width - margin - 30);
        ctx.beginPath();
        ctx.moveTo(x, margin);
        ctx.lineTo(x, canvas.height - margin);
        ctx.stroke();
        
        const y = margin + (i / 8) * (canvas.height - margin - margin);
        ctx.beginPath();
        ctx.moveTo(margin, y);
        ctx.lineTo(canvas.width - 30, y);
        ctx.stroke();
    }
    
    // Axes
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(margin, margin);
    ctx.lineTo(margin, canvas.height - margin);
    ctx.lineTo(canvas.width - 20, canvas.height - margin);
    ctx.stroke();
    
    const scaleX = (canvas.width - margin - 50) / 10;
    const scaleY = (canvas.height - margin * 2) / 20;
    
    // Taxi fare example: starts at $4, increases with distance
    const points = [
        {x: 0, y: 4},
        {x: 2, y: 6.5},
        {x: 4, y: 8.8},
        {x: 6, y: 11.2},
        {x: 8, y: 14}
    ];
    
    // Draw best-fit line (not through origin)
    ctx.strokeStyle = '#667eea';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(margin, canvas.height - margin - 4 * scaleY);
    ctx.lineTo(margin + 9 * scaleX, canvas.height - margin - 15.5 * scaleY);
    ctx.stroke();
    
    // Draw points
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 2;
    points.forEach(point => {
        const px = margin + point.x * scaleX;
        const py = canvas.height - margin - point.y * scaleY;
        drawXMark(ctx, px, py);
    });
    
    // Highlight where line crosses y-axis (not at origin)
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(margin, canvas.height - margin - 4 * scaleY, 8, 0, Math.PI * 2);
    ctx.fill();
    
    // Labels
    ctx.font = '10px Poppins';
    ctx.fillStyle = '#667eea';
    ctx.textAlign = 'left';
    ctx.fillText('Starts at $4', margin + 10, canvas.height - margin - 4 * scaleY);
    ctx.fillText('(flag-down fee)', margin + 10, canvas.height - margin - 4 * scaleY + 12);
    
    ctx.fillStyle = '#64748b';
    ctx.textAlign = 'center';
    ctx.fillText('Distance (km)', canvas.width / 2, canvas.height - 10);
    
    ctx.save();
    ctx.translate(15, canvas.height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Fare ($)', 0, 0);
    ctx.restore();
    
    // Mark origin
    ctx.fillStyle = '#94a3b8';
    ctx.font = '9px Poppins';
    ctx.textAlign = 'center';
    ctx.fillText('(0,0)', margin, canvas.height - margin + 12);
}

// Practice Canvas
function initPracticeCanvas() {
    const canvas = document.getElementById('practiceCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const margin = 60;
    
    // Data from table
    const data = [
        {x: 0, y: 0},
        {x: 5, y: 1.2},
        {x: 10, y: 2.0},
        {x: 15, y: 3.0},
        {x: 20, y: 3.5},
        {x: 25, y: 4.8},
        {x: 30, y: 5.9}
    ];
    
    const maxX = 35;
    const maxY = 7;
    const scaleX = (canvas.width - margin - 30) / maxX;
    const scaleY = (canvas.height - margin - 30) / maxY;
    
    let userPoints = [];
    let showDataPoints = false;
    let showBestFit = false;
    
    function draw() {
        // Clear
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Grid
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 1;
        
        for (let i = 0; i <= maxX; i += 5) {
            const x = margin + i * scaleX;
            ctx.beginPath();
            ctx.moveTo(x, margin);
            ctx.lineTo(x, canvas.height - margin);
            ctx.stroke();
        }
        
        for (let i = 0; i <= maxY; i++) {
            const y = canvas.height - margin - i * scaleY;
            ctx.beginPath();
            ctx.moveTo(margin, y);
            ctx.lineTo(canvas.width - 20, y);
            ctx.stroke();
        }
        
        // Axes
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(margin, margin - 10);
        ctx.lineTo(margin, canvas.height - margin);
        ctx.lineTo(canvas.width - 10, canvas.height - margin);
        ctx.stroke();
        
        // Arrows
        drawArrow(ctx, margin, margin - 10, margin, margin - 20);
        drawArrow(ctx, canvas.width - 10, canvas.height - margin, canvas.width, canvas.height - margin);
        
        // Scale labels
        ctx.font = '12px Poppins';
        ctx.fillStyle = '#64748b';
        ctx.textAlign = 'center';
        
        for (let i = 0; i <= maxX; i += 5) {
            ctx.fillText(i, margin + i * scaleX, canvas.height - margin + 20);
        }
        
        ctx.textAlign = 'right';
        for (let i = 0; i <= maxY; i++) {
            ctx.fillText(i, margin - 10, canvas.height - margin - i * scaleY + 4);
        }
        
        // Axis labels
        ctx.fillStyle = '#667eea';
        ctx.font = 'bold 12px Poppins';
        ctx.textAlign = 'center';
        ctx.fillText('Light Intensity (lux)', canvas.width / 2, canvas.height - 10);
        
        ctx.save();
        ctx.translate(15, canvas.height / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText('Oxygen Production (cm³/min)', 0, 0);
        ctx.restore();
        
        // Data points
        if (showDataPoints) {
            ctx.strokeStyle = '#ef4444';
            ctx.lineWidth = 2;
            data.forEach(point => {
                const px = margin + point.x * scaleX;
                const py = canvas.height - margin - point.y * scaleY;
                drawXMark(ctx, px, py);
            });
        }
        
        // Best fit line
        if (showBestFit) {
            ctx.strokeStyle = '#667eea';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(margin, canvas.height - margin + 0.1 * scaleY);
            ctx.lineTo(margin + 32 * scaleX, canvas.height - margin - 6.2 * scaleY);
            ctx.stroke();
        }
        
        // User points
        ctx.fillStyle = '#10b981';
        userPoints.forEach(point => {
            ctx.beginPath();
            ctx.arc(point.x, point.y, 5, 0, Math.PI * 2);
            ctx.fill();
        });
    }
    
    // Initial draw
    draw();
    
    // Click to add points
    canvas.addEventListener('click', (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        if (x > margin && x < canvas.width - 20 && y > margin && y < canvas.height - margin) {
            userPoints.push({x, y});
            draw();
        }
    });
    
    // Buttons
    document.getElementById('showPointsBtn').addEventListener('click', () => {
        showDataPoints = !showDataPoints;
        document.getElementById('showPointsBtn').textContent = showDataPoints ? 'Hide Points' : 'Show Points';
        draw();
    });
    
    document.getElementById('showLineBtn').addEventListener('click', () => {
        showBestFit = !showBestFit;
        document.getElementById('showLineBtn').textContent = showBestFit ? 'Hide Line' : 'Show Best-Fit Line';
        draw();
    });
    
    document.getElementById('resetBtn').addEventListener('click', () => {
        userPoints = [];
        showDataPoints = false;
        showBestFit = false;
        document.getElementById('showPointsBtn').textContent = 'Show Points';
        document.getElementById('showLineBtn').textContent = 'Show Best-Fit Line';
        draw();
    });
}

// Utility functions
function drawXMark(ctx, x, y, size = 5) {
    ctx.beginPath();
    ctx.moveTo(x - size, y - size);
    ctx.lineTo(x + size, y + size);
    ctx.moveTo(x + size, y - size);
    ctx.lineTo(x - size, y + size);
    ctx.stroke();
}

function drawArrow(ctx, fromX, fromY, toX, toY) {
    const headLen = 8;
    const angle = Math.atan2(toY - fromY, toX - fromX);
    
    ctx.beginPath();
    ctx.moveTo(toX, toY);
    ctx.lineTo(toX - headLen * Math.cos(angle - Math.PI / 6), toY - headLen * Math.sin(angle - Math.PI / 6));
    ctx.moveTo(toX, toY);
    ctx.lineTo(toX - headLen * Math.cos(angle + Math.PI / 6), toY - headLen * Math.sin(angle + Math.PI / 6));
    ctx.stroke();
}
