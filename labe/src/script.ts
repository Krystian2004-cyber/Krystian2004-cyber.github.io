const message: string = "Hello!";
alert(message);

const style: Record<string, string> = {
    jeden: 'public/style-1.css',
    dwa: 'public/style-2.css',
    trzy: 'public/style-3.css'
};

let biezacyStyl: { nazwa: string; plik: string } | null = null;

function zmienStyl(nazwaStylu: string) {
    if (style[nazwaStylu]) {
        biezacyStyl = {
            nazwa: nazwaStylu,
            plik: style[nazwaStylu]
        };
    }

    const head = document.head;

    const staryLink = document.getElementById('styl');
    if (staryLink) {
        staryLink.remove();
    }

    const nowyLink = document.createElement('link');
    nowyLink.id = 'styl';
    nowyLink.rel = 'stylesheet';
    nowyLink.href = style[nazwaStylu];
   
    head.appendChild(nowyLink);
}

function utworzPrzyciski() {
    const przyciski = document.createElement('div');
    przyciski.id = 'kontrolki-stylu';

    for (const nazwaStylu in style) {
        const przycisk = document.createElement('button');
        przycisk.innerText = `Zmień na: ${nazwaStylu}`;
        przycisk.dataset.styl = nazwaStylu;
    
        przycisk.addEventListener('click', () => {
            zmienStyl(nazwaStylu);
        });
        
        przyciski.appendChild(przycisk);
    }
    document.body.prepend(przyciski);
}

function initApp() {
    utworzPrzyciski();
    
    const dostepneStyle = Object.keys(style);
    if (dostepneStyle.length > 0) {
        const nazwaPierwszegoStylu = dostepneStyle[0];
        zmienStyl(nazwaPierwszegoStylu);
    }
}

document.addEventListener('DOMContentLoaded', initApp);