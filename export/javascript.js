document.addEventListener("DOMContentLoaded", () => {
  const section = document.querySelector("section") ;
  const div = document.createElement("div") ;
  div.className = "content";

  const textNode = section.firstChild ;
  const number = textNode.textContent.match(/\d+/)[0] ; // Pour récupérer le numéro de section

  const h1 = document.createElement("h1") ;
  h1.textContent = number ;
  section.removeChild(textNode) ;
  div.appendChild(h1) ;

  while (section.firstChild) {
    div.appendChild(section.firstChild) ;
  }

  section.appendChild(div) ;
}) ;
