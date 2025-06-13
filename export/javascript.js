document.addEventListener("DOMContentLoaded", () => {
  let section = document.querySelector("section");

  //On récupère le numéro de la section
  let textNode = section.firstChild;
  let number = textNode.textContent.match(/\d+/)[0];

  let h1 = document.createElement("h1");
  h1.textContent = number;
  section.removeChild(textNode);
  
  let div = document.createElement("div");
  div.className = "content";
  div.appendChild(h1);

  // On met tous les enfants dans la div
  while (section.firstChild) {
    div.appendChild(section.firstChild);
  }

  section.appendChild(div);

  printPictures();
});

// Fonction qui affiche les images dans le format png uniquement
function printPictures() {
  let baseURL = "https://www.projectaon.org/en/xhtml/lw/02fotw/" ;
  let illustrations = document.querySelectorAll("div.float, div.inline") ;

  illustrations.forEach(div => {
    let pictures = Array.from(div.getElementsByTagName("img")) ;
    let png = pictures.find(img => img.src.endsWith(".png")) ;

    // On vide la div pour ne garder que l'image
    div.innerHTML = "" ;
    if (png) {
      png.src = baseURL + png.getAttribute("src") ;
      div.appendChild(png) ;
    }
  }) ;
} 
