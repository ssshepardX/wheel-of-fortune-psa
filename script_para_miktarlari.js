// Oyun State (Durum) Değişkenleri
let currentSpin = 0;
let balance = 0;
let freeSpins = 3;
let bankruptSpin = 0;
const COST_PER_SPIN = 1000; // Oynamaya teşvik ama bakiye eritecek yüksek bahis

// DOM Elementleri
const wheelEl = document.getElementById('wheel');
const wheelOuter = document.getElementById('wheel-outer');
const spinBtn = document.getElementById('spin-btn');
const balanceEl = document.getElementById('balance');
const freespinEl = document.getElementById('freespin-count');
const messageBox = document.getElementById('message-box');
const messageText = document.getElementById('message-text');
const gameContainer = document.getElementById('game-container');
const psaScreen = document.getElementById('psa-screen');
const restartBtn = document.getElementById('restart-btn');

// Çark Dilimleri Tanımı (Görseldeki gibi değerler)
const slices = [
    { label: "JACKPOT", color: "#00bfff", type: "jackpot", baseValue: 50000 },
    { label: "1000", color: "#32cd32", type: "win", baseValue: 1000 },
    { label: "1500", color: "#ffd700", type: "win", baseValue: 1500 },
    { label: "5000", color: "#ff8c00", type: "win", baseValue: 5000 },
    { label: "İFLAS", color: "#222222", type: "bankrupt", baseValue: 0 },
    { label: "300", color: "#00bfff", type: "win", baseValue: 300 },
    { label: "2000", color: "#32cd32", type: "win", baseValue: 2000 },
    { label: "500", color: "#ff3333", type: "win", baseValue: 500 }
];

const totalSlices = slices.length;
const sliceAngle = 360 / totalSlices;

// Web Audio API
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playSound(type) {
    if(audioCtx.state === 'suspended') audioCtx.resume();
    
    if (type === 'spinTick') {
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.05);
        
        gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.05);
        
        osc.start();
        osc.stop(audioCtx.currentTime + 0.05);
    } 
    else if (type === 'win') {
        const notes = [400, 500, 600, 800, 1000, 1200];
        notes.forEach((freq, i) => {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            
            osc.type = 'square';
            osc.frequency.value = freq;
            
            const time = audioCtx.currentTime + (i * 0.1);
            gain.gain.setValueAtTime(0, time);
            gain.gain.linearRampToValueAtTime(0.2, time + 0.05);
            gain.gain.linearRampToValueAtTime(0, time + 0.3);
            
            osc.start(time);
            osc.stop(time + 0.3);
        });
    } 
    else if (type === 'bigwin') {
        const notes = [440, 554, 659, 880, 1108, 1318];
        for(let j=0; j<3; j++) {
            notes.forEach((freq, i) => {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                
                osc.type = 'sawtooth';
                osc.frequency.value = freq;
                
                const time = audioCtx.currentTime + (j * 0.4) + (i * 0.05);
                gain.gain.setValueAtTime(0, time);
                gain.gain.linearRampToValueAtTime(0.3, time + 0.02);
                gain.gain.linearRampToValueAtTime(0, time + 0.2);
                
                osc.start(time);
                osc.stop(time + 0.2);
            });
        }
    }
    else if (type === 'bankrupt') {
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        osc.type = 'square';
        osc.frequency.setValueAtTime(80, audioCtx.currentTime);
        gainNode.gain.setValueAtTime(1, audioCtx.currentTime);
        gainNode.gain.setValueAtTime(0, audioCtx.currentTime + 0.3); 
        
        osc.start();
        osc.stop(audioCtx.currentTime + 0.3);
    }
}

function drawWheel() {
    wheelEl.innerHTML = '';
    
    // Conic gradient ile arkaplan
    let gradientStops = [];
    let currentAngle = 0;
    
    slices.forEach((slice) => {
        let endAngle = currentAngle + sliceAngle;
        gradientStops.push(`${slice.color} ${currentAngle}deg ${endAngle}deg`);
        currentAngle = endAngle;
    });
    
    wheelEl.style.background = `conic-gradient(${gradientStops.join(', ')})`;
    
    slices.forEach((slice, index) => {
        // Çizgi ayırıcı
        const line = document.createElement('div');
        line.style.position = 'absolute';
        line.style.width = '4px';
        line.style.height = '50%';
        line.style.backgroundColor = '#ffd700'; // altın sarısı ayırıcı çizgiler
        line.style.top = '0';
        line.style.left = '50%';
        line.style.transformOrigin = '50% 100%';
        line.style.transform = `translateX(-50%) rotate(${index * sliceAngle}deg)`;
        line.style.boxShadow = '0 0 5px rgba(0,0,0,0.5)';
        line.style.zIndex = '5';
        wheelEl.appendChild(line);

        // Yazı içeriği
        const contentEl = document.createElement('div');
        contentEl.className = 'slice-content';
        if (slice.type === 'jackpot') {
            contentEl.classList.add('jackpot-text');
        }
        contentEl.innerText = slice.label;
        
        const centerAngle = (index * sliceAngle) + (sliceAngle / 2);
        
        contentEl.style.position = 'absolute';
        contentEl.style.top = '50%';
        contentEl.style.left = '50%';
        // Yazıyı merkeze hizalayıp, açısına göre döndürüp dışa doğru öteliyoruz
        contentEl.style.transform = `translate(-50%, -50%) rotate(${centerAngle}deg) translateY(-135px)`;
        contentEl.style.zIndex = '10';
        
        wheelEl.appendChild(contentEl);
    });
}

function drawBulbs() {
    wheelOuter.innerHTML = '';
    const bulbCount = 24;
    const radius = 230; 
    for(let i=0; i<bulbCount; i++) {
        const angle = (i * (360 / bulbCount)) * (Math.PI / 180);
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        
        const bulb = document.createElement('div');
        bulb.className = `bulb ${i % 2 === 0 ? 'blink-1' : 'blink-2'}`;
        bulb.style.transform = `translate(${x}px, ${y}px)`;
        wheelOuter.appendChild(bulb);
    }
}

function updateStats() {
    balanceEl.innerText = `${balance} TL`;
    freespinEl.innerText = freeSpins;
    
    if (freeSpins === 0) {
        spinBtn.innerText = `BAKİYE İLE ÇEVİR (-${COST_PER_SPIN} TL)`;
        spinBtn.classList.remove('pulse');
    } else {
        spinBtn.innerText = "BEDAVA ÇEVİR!";
        spinBtn.classList.add('pulse');
    }
}

function showMessage(msg, isError = false) {
    messageText.innerText = msg;
    messageBox.style.borderColor = isError ? '#ff0000' : '#00d2ff';
    messageText.style.color = isError ? '#ffaaaa' : '#fff';
    messageBox.style.boxShadow = isError ? '0 0 50px rgba(255, 0, 0, 0.5)' : '0 0 50px rgba(0, 210, 255, 0.5)';
    messageBox.classList.remove('hidden');
    
    messageBox.style.animation = 'none';
    messageBox.offsetHeight; 
    messageBox.style.animation = null; 

    setTimeout(() => {
        messageBox.classList.add('hidden');
    }, 3500);
}

let currentRotation = 0;

function spinWheel() {
    if (freeSpins === 0 && balance < COST_PER_SPIN) {
        showMessage("YETERSİZ BAKİYE!", true);
        return;
    }

    if (audioCtx.state === 'suspended') audioCtx.resume();
    
    spinBtn.disabled = true;
    messageBox.classList.add('hidden');
    
    if (freeSpins > 0) {
        freeSpins--;
    } else {
        balance -= COST_PER_SPIN;
    }
    updateStats();
    
    currentSpin++;
    
    let targetSliceIndex = 0;
    let spinResultInfo = {};

    if (currentSpin === bankruptSpin) {
        targetSliceIndex = slices.findIndex(s => s.type === 'bankrupt');
        spinResultInfo = { type: 'bankrupt', msg: "İFLAS ETTİNİZ!", amount: 0 };
    } 
    else if (currentSpin === 1) {
        targetSliceIndex = slices.findIndex(s => s.label === '1000');
        spinResultInfo = { type: 'bigwin', msg: "HARİKA BAŞLANGIÇ!", amount: slices[targetSliceIndex].baseValue };
    } 
    else if (currentSpin === 2) {
         targetSliceIndex = slices.findIndex(s => s.label === '5000');
         spinResultInfo = { type: 'bigwin', msg: "BÜYÜK KAZANÇ!!! ŞANS YANINDA!", amount: slices[targetSliceIndex].baseValue };
    } 
    else if (currentSpin === 3 && bankruptSpin !== 3) {
        let jackpotIndex = slices.findIndex(s => s.type === 'jackpot');
        targetSliceIndex = (jackpotIndex + 1) % totalSlices; 
        spinResultInfo = { type: 'win', msg: "JACKPOT'U KIL PAYI KAÇIRDIN!", amount: slices[targetSliceIndex].baseValue };
    } 
    else {
        // Yüksek bahis (1000) ama düşük kazançlar (300, 500) vererek bakiyeyi sinsice erit
        if (balance < 1500 && currentSpin < bankruptSpin - 1) {
            targetSliceIndex = slices.findIndex(s => s.label === '1500');
            spinResultInfo = { type: 'bigwin', msg: "MÜKEMMEL GERİ DÖNÜŞ!", amount: slices[targetSliceIndex].baseValue };
        } else {
            let lowWinLabels = ['300', '500'];
            let label = lowWinLabels[Math.floor(Math.random() * lowWinLabels.length)];
            targetSliceIndex = slices.findIndex(s => s.label === label);
            spinResultInfo = { type: 'win', msg: "KAZANDIN!", amount: slices[targetSliceIndex].baseValue };
        }
    }

    const spins = 6; 
    const baseRotation = spins * 360;
    
    // Conic gradient 0 derece saat 12 yönüdür. Marker da saat 12 yönünde.
    const sliceCenterAngle = (targetSliceIndex * sliceAngle) + (sliceAngle / 2);
    const targetAngle = 360 - sliceCenterAngle; 
    const randomOffset = (Math.random() * 20) - 10;
    
    currentRotation += baseRotation + targetAngle + randomOffset - (currentRotation % 360);

    wheelEl.style.transform = `rotate(${currentRotation}deg)`;
    
    let spinTime = 0;
    let spinInterval = setInterval(() => {
        spinTime += 200;
        if(spinTime < 5500) playSound('spinTick');
    }, 200);

    setTimeout(() => {
        clearInterval(spinInterval);
        
        balance += spinResultInfo.amount;
        if(balance < 0) balance = 0; 
        
        updateStats();
        
        if (spinResultInfo.type === 'bankrupt') {
            triggerBankrupt();
        } else {
            playSound(spinResultInfo.type);
            showMessage(`${spinResultInfo.msg} (+${spinResultInfo.amount} TL)`);
            spinBtn.disabled = false;
        }
        
    }, 6000); 
}

function triggerBankrupt() {
    playSound('bankrupt');
    gameContainer.classList.add('hidden');
    psaScreen.classList.remove('hidden');
    balance = 0;
    updateStats();
}

function restartGame() {
    currentSpin = 0;
    balance = 0;
    freeSpins = 3;
    bankruptSpin = Math.floor(Math.random() * 4) + 4; // 4 ile 7 arası (Daha hızlı test edilebilmesi için)
    
    psaScreen.classList.add('hidden');
    gameContainer.classList.remove('hidden');
    
    spinBtn.disabled = false;
    currentRotation = 0;
    wheelEl.style.transform = `rotate(0deg)`;
    
    updateStats();
    showMessage("Yeniden Hoş Geldin Bonusu: 3 FREESPIN!");
}

// Init
bankruptSpin = Math.floor(Math.random() * 4) + 4; // 4-7 turda iflas eder
spinBtn.addEventListener('click', spinWheel);
restartBtn.addEventListener('click', restartGame);

drawWheel();
drawBulbs();
updateStats();
showMessage("Hoş Geldin Bonusu: 3 FREESPIN Kazandın!");
