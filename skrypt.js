linie = [];
numery = [];

  async function wezLinie() {
    const response = await fetch('plik.txt')
    const movies = await response.text();

    linie = movies.split('\n');
    console.log(linie[0]);
    wezNumery();
  }
    

  function wezNumery()
  {
    linie.forEach(linia => {

       //console.log(linia);
       if(+linia)
       {
          numery.push(parseInt(linia));
       }
      
    });
    numery.sort(function(a, b){return a-b});
    console.log(numery);

    numery = [...new Set(numery)];
    console.log(numery);
    numery.forEach(numer =>{
        const nowyParagraf = document.createElement("p");
        nowyParagraf.textContent = numer;

        document.body.appendChild(nowyParagraf);
    })
  }
  
wezLinie();