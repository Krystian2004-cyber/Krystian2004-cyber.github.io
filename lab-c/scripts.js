const map = L.map('map').setView([51.505, -0.09], 13);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap'
}).addTo(map);

document.addEventListener('DOMContentLoaded', () => {
    if (Notification.permission !== "granted") {
        Notification.requestPermission();
    }
});

const getLocationBtn = document.getElementById('getLocationBtn');
const coordsDiv = document.getElementById('coords');

getLocationBtn.addEventListener('click', () => {
    map.locate({setView: true, maxZoom: 16});
});

map.on('locationfound', (e) => {
    coordsDiv.innerText = `Wspolrzedne: ${e.latlng.lat.toFixed(4)}, ${e.latlng.lng.toFixed(4)}`;
    L.marker(e.latlng).addTo(map).bindPopup("Tu jestes").openPopup();
});

const downloadMapBtn = document.getElementById('downloadMapBtn');
const board = document.getElementById('puzzle-board');
const board_test = document.getElementById('board-test');
const piecesContainer = document.getElementById('pieces-container');
const gameArea = document.getElementById('game-area');

downloadMapBtn.addEventListener('click', () => {
    leafletImage(map, function(err, canvas) {
        if (err) return console.error(err);
       board_test.innerHTML = '';
board_test.appendChild(canvas);
        setupGame(canvas);
    });
});

function setupGame(sourceCanvas) {
    piecesContainer.innerHTML = '';
    board.innerHTML = '';
    gameArea.style.display = 'block';

    const pWidth = sourceCanvas.width / 4;
    const pHeight = sourceCanvas.height / 4;
    let pieces = [];

    for (let i = 0; i < 16; i++) {
        const slot = document.createElement('div');
        slot.className = 'puzzle-slot';
        slot.dataset.correctId = i;
        slot.addEventListener('dragover', e => e.preventDefault());
        slot.addEventListener('drop', handleDrop);
        board.appendChild(slot);
    }

    for (let i = 0; i < 16; i++) {
        const x = i % 4;
        const y = Math.floor(i / 4);

        const pCanvas = document.createElement('canvas');
        pCanvas.width = 100; pCanvas.height = 100;
        const ctx = pCanvas.getContext('2d');
        ctx.drawImage(sourceCanvas, x * pWidth, y * pHeight, pWidth, pHeight, 0, 0, 100, 100);

        const img = document.createElement('img');
        img.src = pCanvas.toDataURL();
        img.className = 'puzzle-piece';
        img.draggable = true;
        img.id = 'piece-' + i;
        img.dataset.pieceId = i;
        img.addEventListener('dragstart', e => e.dataTransfer.setData('text', e.target.id));

        pieces.push(img);
    }

     pieces.sort(() => Math.random() - 0.5).forEach(p => piecesContainer.appendChild(p));
}

function handleDrop(e) {
    e.preventDefault();
    const pieceId = e.dataTransfer.getData('text');
    const piece = document.getElementById(pieceId);

    if (this.childNodes.length === 0) {
        this.appendChild(piece);
        checkWin();
    }
}

function checkWin() {
    const slots = document.querySelectorAll('.puzzle-slot');
    let correctCount = 0;

    slots.forEach(slot => {
        const piece = slot.firstChild;
        if (piece && piece.dataset.pieceId === slot.dataset.correctId) {
            correctCount++;
        }
    });

    console.log(`Poprawne elementy: ${correctCount}/16`);
    if (correctCount === 16) {
        if (Notification.permission === "granted") {
            new Notification("Zrobiono", { body: "Mapa ulozona poprawnie" });
        } else {
            alert("Mapa ulozona poprawnie");
        }
    }
}

piecesContainer.addEventListener('dragover', e => e.preventDefault());
piecesContainer.addEventListener('drop', function(e) {
    const pieceId = e.dataTransfer.getData('text');
    this.appendChild(document.getElementById(pieceId));
});
