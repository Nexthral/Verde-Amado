class PetalSystem {
    constructor() {
        this.container = document.querySelector('.falling-petals-container');
        this.activePetals = [];
        // Menos pétalas em mobile para performance
        const isMobile = window.innerWidth <= 768;
        this.maxPetals = isMobile ? 10 : 20;
        this.spawnRate = isMobile ? 3500 : 2500;
        this.init();
    }

    init() {
        for (let i = 0; i < 6; i++) {
            setTimeout(() => this.createPetal(), i * 300);
        }

        setInterval(() => {
            if (this.activePetals.length < this.maxPetals) {
                this.createPetal();
            }
        }, this.spawnRate);
    }

    createPetal() {
        const petal = document.createElement('div');
        petal.className = 'falling-petal';
        
        const startX = Math.random() * window.innerWidth;
        const startY = -30;
        
        const size = 0.7 + Math.random() * 0.5;
        const fallSpeed = 0.3 + Math.random() * 0.4;
        const horizontalDrift = -0.2 + Math.random() * 0.4;
        const rotation = Math.random() * 360;
        const rotationSpeed = -1 + Math.random() * 2;
        const opacity = 0.7 + Math.random() * 0.3;
        petal.style.width = `${12 * size}px`;
        petal.style.height = `${16 * size}px`;
        petal.style.left = `${startX}px`;
        petal.style.top = `${startY}px`;
        petal.style.transform = `rotate(${rotation}deg)`;
        petal.style.opacity = opacity;
        
        this.container.appendChild(petal);
        
        const state = {
            x: startX,
            y: startY,
            rotation: rotation,
            fallSpeed: fallSpeed,
            horizontalDrift: horizontalDrift,
            rotationSpeed: rotationSpeed,
            windPhase: Math.random() * Math.PI * 2,
            windAmplitude: 0.02 + Math.random() * 0.03
        };
        
        this.activePetals.push({ element: petal, state });
        this.animatePetal(petal, state);
    }

    animatePetal(petal, state) {
        const animate = () => {
            state.y += state.fallSpeed;
            
            state.windPhase += 0.015;
            const windEffect = Math.sin(state.windPhase) * state.windAmplitude;
            state.x += state.horizontalDrift + windEffect;
            
            state.rotation += state.rotationSpeed;
            
            petal.style.top = `${state.y}px`;
            petal.style.left = `${state.x}px`;
            petal.style.transform = `rotate(${state.rotation}deg)`;
            
            if (state.y > window.innerHeight + 50 || 
                state.x < -50 || 
                state.x > window.innerWidth + 50) {
                petal.remove();
                const index = this.activePetals.findIndex(p => p.element === petal);
                if (index > -1) {
                    this.activePetals.splice(index, 1);
                }
                return;
            }
            
            requestAnimationFrame(() => animate());
        };
        
        animate();
    }
}

class InteractionSystem {
    constructor() {
        this.bouquet = document.querySelector('.bouquet-container');
        this.roses = document.querySelectorAll('.rose');
        this.mouseX = 0;
        this.mouseY = 0;
        this.targetX = 0;
        this.targetY = 0;
        this.currentX = 0;
        this.currentY = 0;
        this.init();
    }

    init() {
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        });

        this.animateParallax();

        this.roses.forEach(rose => {
            rose.addEventListener('mouseenter', () => this.onRoseHover(rose));
            rose.addEventListener('mouseleave', () => this.onRoseLeave(rose));
        });

        this.bouquet.addEventListener('click', (e) => {
            if (e.target.closest('.rose')) {
                this.createPetalBurst(e.clientX, e.clientY);
            }
        });
    }

    animateParallax() {
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        
        this.targetX = (this.mouseX - centerX) * 0.015;
        this.targetY = (this.mouseY - centerY) * 0.015;
        
        this.currentX += (this.targetX - this.currentX) * 0.08;
        this.currentY += (this.targetY - this.currentY) * 0.1;
        
        const rotateY = this.currentX * 0.25;
        const rotateX = -this.currentY * 0.2;
        
        this.bouquet.style.transform = `
            translateX(${this.currentX}px) 
            translateY(${this.currentY}px)
            rotateY(${rotateY}deg)
            rotateX(${rotateX}deg)
        `;
        
        requestAnimationFrame(() => this.animateParallax());
    }

    onRoseHover(rose) {
        const petals = rose.querySelectorAll('.petal');
        const core = rose.querySelector('.rose-center-core');
        
        petals.forEach(petal => {
            petal.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
        });
        
        if (core) {
            core.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
        }
    }

    onRoseLeave(rose) {
        const petals = rose.querySelectorAll('.petal');
        const core = rose.querySelector('.rose-center-core');
        
        petals.forEach(petal => {
            petal.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
        });
        
        if (core) {
            core.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
        }
    }

    createPetalBurst(x, y) {
        const container = document.querySelector('.falling-petals-container');
        const count = 12;
        
        for (let i = 0; i < count; i++) {
            const petal = document.createElement('div');
            petal.className = 'falling-petal';
            petal.style.left = `${x}px`;
            petal.style.top = `${y}px`;
            petal.style.width = '14px';
            petal.style.height = '18px';
            petal.style.opacity = '0.9';
            
            container.appendChild(petal);
            
            const angle = (i / count) * Math.PI * 2;
            const speed = 1.5 + Math.random() * 2;
            const vx = Math.cos(angle) * speed;
            const vy = Math.sin(angle) * speed;
            const rotation = Math.random() * 360;
            const rotationSpeed = -8 + Math.random() * 16;
            
            let px = x;
            let py = y;
            let rot = rotation;
            let vxCurrent = vx;
            let vyCurrent = vy;
            let opacity = 0.9;
            
            const animate = () => {
                px += vxCurrent;
                py += vyCurrent + 0.3;
                rot += rotationSpeed;
                vxCurrent *= 0.98;
                vyCurrent *= 0.97;
                opacity *= 0.98;
                
                petal.style.left = `${px}px`;
                petal.style.top = `${py}px`;
                petal.style.transform = `rotate(${rot}deg)`;
                petal.style.opacity = opacity;
                
                if (py < window.innerHeight + 50 && opacity > 0.05) {
                    requestAnimationFrame(animate);
                } else {
                    petal.remove();
                }
            };
            
            animate();
        }
    }
}

// Animação do texto - lê diretamente do HTML com spans já definidos
function animateTextFromHTML() {
    const verseMain = document.querySelector('.verse-main');
    const verseReference = document.querySelector('.verse-reference');
    
    if (verseMain) {
        // Pega o HTML original com os spans red-letter já definidos
        const originalHTML = verseMain.innerHTML;
        
        // Cria um elemento temporário para parsear o HTML
        const temp = document.createElement('div');
        temp.innerHTML = originalHTML;
        
        // Extrai todos os nós de texto e spans, preservando a estrutura
        const nodes = [];
        function extractNodes(parent) {
            parent.childNodes.forEach(node => {
                if (node.nodeType === Node.TEXT_NODE) {
                    const text = node.textContent;
                    for (let i = 0; i < text.length; i++) {
                        nodes.push({ char: text[i], isRed: false });
                    }
                } else if (node.nodeType === Node.ELEMENT_NODE && node.classList.contains('red-letter')) {
                    const text = node.textContent;
                    for (let i = 0; i < text.length; i++) {
                        nodes.push({ char: text[i], isRed: true });
                    }
                } else if (node.nodeType === Node.ELEMENT_NODE) {
                    extractNodes(node);
                }
            });
        }
        extractNodes(temp);
        
        // Limpa e reconstrói com animação
        verseMain.innerHTML = '';
        verseMain.style.visibility = 'visible';
        
        let charIndex = 0;
        let currentWordSpan = null;
        const delay = 40;
        
        function processNextChar() {
            if (charIndex >= nodes.length) {
                if (verseReference) {
                    setTimeout(animateReference, 200);
                }
                return;
            }
            
            const node = nodes[charIndex];
            const char = node.char;
            
            // Se é espaço, fecha a palavra atual e adiciona espaço
            if (char === ' ' || char === '\n' || char === '\t') {
                const space = document.createTextNode(' ');
                verseMain.appendChild(space);
                currentWordSpan = null;
                charIndex++;
                setTimeout(processNextChar, delay);
                return;
            }
            
            // Se não tem container de palavra, cria um
            if (!currentWordSpan) {
                currentWordSpan = document.createElement('span');
                currentWordSpan.className = 'word';
                verseMain.appendChild(currentWordSpan);
            }
            
            // Cria span para o caractere
            const charSpan = document.createElement('span');
            charSpan.className = 'char';
            if (node.isRed) {
                charSpan.classList.add('red-letter');
            }
            charSpan.textContent = char;
            
            currentWordSpan.appendChild(charSpan);
            charIndex++;
            setTimeout(processNextChar, delay);
        }
        
        processNextChar();
    }
    
    function animateReference() {
        if (!verseReference) return;
        
        const refText = verseReference.getAttribute('data-text') || verseReference.textContent.trim();
        verseReference.innerHTML = '';
        verseReference.style.visibility = 'visible';
        
        let refIndex = 0;
        const refDelay = 40;
        
        function addNextRefChar() {
            if (refIndex >= refText.length) return;
            
            const char = refText[refIndex];
            const span = document.createElement('span');
            span.className = 'char';
            span.textContent = char === ' ' ? '\u00A0' : char;
            
            verseReference.appendChild(span);
            refIndex++;
            setTimeout(addNextRefChar, refDelay);
        }
        
        addNextRefChar();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    document.body.style.overflow = 'hidden';
    
    // Audio is controlled by parent page (home)
    
    // ===== ANIMAÇÃO DE TEXTO =====
    setTimeout(() => {
        animateTextFromHTML();
    }, 500);
    
    new PetalSystem();
    new InteractionSystem();
    
    const container = document.querySelector('.falling-petals-container');
    container.style.width = `${window.innerWidth}px`;
    container.style.height = `${window.innerHeight}px`;
    
    window.addEventListener('resize', () => {
        container.style.width = `${window.innerWidth}px`;
        container.style.height = `${window.innerHeight}px`;
    });
    
    const bouquet = document.querySelector('.bouquet-container');
    bouquet.style.opacity = '0';
    bouquet.style.transition = 'opacity 3s ease-in';
    
    setTimeout(() => {
        bouquet.style.opacity = '1';
    }, 300);
});

document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    return false;
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'F12' || e.keyCode === 123) {
        e.preventDefault();
        return false;
    }
    
    if (e.ctrlKey && e.shiftKey && e.key === 'I') {
        e.preventDefault();
        return false;
    }
    
    if (e.ctrlKey && e.shiftKey && e.key === 'J') {
        e.preventDefault();
        return false;
    }
    
    if (e.ctrlKey && e.shiftKey && e.key === 'C') {
        e.preventDefault();
        return false;
    }
    
    if (e.ctrlKey && e.key === 'U') {
        e.preventDefault();
        return false;
    }
    
    if (e.ctrlKey && e.key === 'S') {
        e.preventDefault();
        return false;
    }
    
    if (e.ctrlKey && e.key === 'P') {
        e.preventDefault();
        return false;
    }
    
    if (e.ctrlKey && e.key === 'A') {
        e.preventDefault();
        return false;
    }
    
    if (e.ctrlKey && e.key === 'C') {
        e.preventDefault();
        return false;
    }
    
    if (e.ctrlKey && e.key === 'X') {
        e.preventDefault();
        return false;
    }
    
    if (e.ctrlKey && e.key === 'V') {
        e.preventDefault();
        return false;
    }
    
    if (e.ctrlKey && e.shiftKey && e.key === 'P') {
        e.preventDefault();
        return false;
    }
});

document.addEventListener('selectstart', (e) => {
    e.preventDefault();
    return false;
});

document.addEventListener('dragstart', (e) => {
    e.preventDefault();
    return false;
});

document.addEventListener('copy', (e) => {
    e.clipboardData.setData('text/plain', '');
    e.preventDefault();
    return false;
});

document.addEventListener('cut', (e) => {
    e.clipboardData.setData('text/plain', '');
    e.preventDefault();
    return false;
});

let devtools = {open: false};
const element = new Image();
Object.defineProperty(element, 'id', {
    get: function() {
        devtools.open = true;
        document.body.innerHTML = '';
    }
});
setInterval(function() {
    if (devtools.open) {
        document.body.innerHTML = '';
    }
    devtools.open = false;
}, 500);

document.addEventListener('wheel', (e) => {
    if (e.ctrlKey) {
        e.preventDefault();
        return false;
    }
}, { passive: false });

let lastTouchEnd = 0;
document.addEventListener('touchend', (e) => {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
        e.preventDefault();
    }
    lastTouchEnd = now;
}, false);

(function() {
    const noop = () => {};
    const methods = ['log', 'debug', 'info', 'warn', 'error', 'assert', 'dir', 'dirxml', 'group', 'groupEnd', 'time', 'timeEnd', 'count', 'trace', 'profile', 'profileEnd'];
    methods.forEach(method => {
        window.console[method] = noop;
    });
})();

