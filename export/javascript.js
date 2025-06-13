document.addEventListener("DOMContentLoaded", () => {
  let section = document.querySelector("section") ;
  let div = document.createElement("div") ;
  div.className = "content";

  let textNode = section.firstChild ;
  let number = textNode.textContent.match(/\d+/)[0] ; // Pour récupérer le numéro de section

  let h1 = document.createElement("h1") ;
  h1.textContent = number ;
  section.removeChild(textNode) ;
  div.appendChild(h1) ;

  while (section.firstChild) {
    div.appendChild(section.firstChild) ;
  }

  section.appendChild(div) ;
}) ;

function printPictures() {
  let baseURL = "https://www.projectaon.org/en/xhtml/lw/02fotw/" ;
  let illustrations = document.getElementsByTagName("illustration");

  for (let illustration of illustrations) {
    let pictures = illustration.getElementsByTagName("img");

    for (let picture of pictures) {
      if (picture.src.endsWith(".png")) {
        picture.src = baseURL + picture.getAttribute("src");
      }
      else {
        picture.remove();
      }
    }
  }
}

window.onload = function() {
  printPictures() ;
} ;