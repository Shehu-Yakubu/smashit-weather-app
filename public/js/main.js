/*  SEARCH BY USING A CITY NAME (e.g. New York)
    OR A COMMA-SEPARATED CITY NAME ALONG WITH
    THE COUNTRY CODE (e.g. New York,NYC)
*/
const form = document.querySelector(".wrap-container form");
const input = document.querySelector(".wrap-container input");
const msg = document.querySelector(".wrap-container .msg");
const list = document.querySelector(".cities-section .cities");

/*  API KEY BY OPENWEATHERMAP
    https://openweathermap.org
*/
const API_KEY = "f21a4d5a42f93da35fc4f863b91637d3";

form.addEventListener("submit", e => {
    e.preventDefault();
    let inputVal = input.value;
           
    //  Check to see if a city is already there
    const listItems = list.querySelectorAll(".cities-section .city");
    const listItemsArray = Array.from(listItems);

    if (listItemsArray.length > 0) {
        const filteredArray = listItemsArray.filter(el => {
            let content = "";

            //  New York,NYC
            if (inputVal.includes(",")) {
                if (inputVal.split(",")[1].length > 2) {
                    inputVal.split(",")[0];
                    content = el.querySelector(".city-name span")
                    .textContent.toLowerCase();
                } else {
                    content = el.querySelector(".city-name").dataset.name.toLowerCase();
                }
            } else {
                //  New York
                content = el.querySelector(".city-name span").textContent.toLowerCase();
            }
            return content == inputVal.toLowerCase();
        });
        
        if (filteredArray.length > 0) {
            msg.textContent = `You have the weather information for ${
                filteredArray[0].querySelector(".city-name span").textContent
            } try searching with a specific country code`;
            
            form.reset();
            input.focus();
            return;
        }
    }

    //  openweathermap URL
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${inputVal}&appid=${API_KEY}&units=metric`;

    fetch(url)
    .then(response => response.json())
    .then(data => {
        const {main, name, sys, weather} = data;
        const icon = `http://openweathermap.org/img/wn/${weather[0]["icon"]}.png`;

        const li = document.createElement("li");
        li.classList.add("city");
        const markup = `
            <h2 class="city-name" data-name="${name},${sys.country}">
                <span>${name}</span>
                <sup>${sys.country}</sup>
            </h2>
            
            <div class="city-temp">
                ${Math.round(main.temp)}
                <sup>&#8451;</span>
            </div>
            
            <figure>
                <img class="city-icon" src="${icon}" alt="${weather[0]["description"]}">
                
                <figcaption>
                    ${weather[0]["description"]}
                </figcaption>
            </figure>
        `;
        
        li.innerHTML = markup;
        list.appendChild(li);
    }).catch( () => {
        msg.textContent = "Please enter a valid city to search for";
    });

    msg.textContent = "";
    form.reset();
    input.focus();
});