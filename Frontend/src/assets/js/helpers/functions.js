export const createCard = (parentElement, array) => {
    array.forEach((element) => {
      const card = document.createElement("div");
      card.classList.add("card");
  
      const cardImg = document.createElement("div");
      cardImg.classList.add("cardImg");
  
      const img = document.createElement("img");
      img.classList.add("prodImg");
      img.src = element.image;
      img.alt = "";
  
      cardImg.appendChild(img);
  
      const cardName = document.createElement("h4");
      cardName.classList.add("cardName");
      cardName.textContent = `${element.title.substring(0, 10)}...`;
  
      const cardDesc = document.createElement("p");
      cardDesc.classList.add("cardDesc");
      cardDesc.textContent = `${element.description.substring(0, 15)}...`;
  
      const cardPrice = document.createElement("p");
      cardPrice.classList.add("cardPrice");
      cardPrice.textContent = element.price;
  
      const addBasketBtn = document.createElement("button");
      addBasketBtn.classList.add("addBasket");
      addBasketBtn.textContent = "Add basket";
      addBasketBtn.setAttribute("customId", element.id);
  
      const addFavBtn = document.createElement("button");
      addFavBtn.classList.add("addFav");
      addFavBtn.textContent = "Add Fav";
  
      const logo = document.createElement("h3");
      logo.classList.add("logo");
      logo.textContent = "Tap.az";
  
      card.appendChild(cardImg);
      card.appendChild(cardName);
      card.appendChild(cardDesc);
      card.appendChild(cardPrice);
      card.appendChild(addBasketBtn);
      card.appendChild(addFavBtn);
      card.appendChild(logo);
  
      parentElement.appendChild(card);
    });
  };