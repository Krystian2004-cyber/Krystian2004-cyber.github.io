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

      // console.log(linia);
       if(+linia)
       {
          numery.push(parseInt(linia));
       }
      
    });
    numery.sort(function(a, b){return a-b});
    //console.log(numery);

    numery = [...new Set(numery)];
   // console.log(numery);

   for(let i=0;i<numery.length;i++)
   {

    if(numery[i]<=2568)
    {
      const nowyParagraf = document.createElement("p");
    nowyParagraf.textContent = numery[i];

    if(numery[i-1]+1 !== numery[i])
    {
      console.log(numery[i]);
      console.log(numery[i+1]);
      
      nowyParagraf.style.backgroundColor = "red";
      
    }
    document.body.appendChild(nowyParagraf);
    }
      
    

      
   }
  
  }
  
wezLinie();