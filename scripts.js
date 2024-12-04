const apiKey = "fdae661325754ffab9af2a80d758f9f0"
let url = `https://newsapi.org/v2/top-headlines?category=sports&country=us&apiKey=${apiKey}`
const newsContainer = document.querySelector(".content")
const searchInput = document.querySelector('.search-input')
const searchBtn = document.querySelector('.search-btn')



// NOTE: first method to make API request
function initializeNews(){
    const xhr = new XMLHttpRequest()
    xhr.addEventListener("readystatechange", () => {
        if(xhr.readyState == 4){
            if(xhr.status >= 200 && xhr.status < 300){
                // console.log(xhr.responseText);
                const response = JSON.parse(xhr.responseText)
                console.log(response)
                displayNews(response.articles)
            }else{
                console.log("Request failed : " + xhr.statusText)
            }
        }
    })
    xhr.open("GET", url, true)
    xhr.send()
}

// NOTE: second method to make API request
// function initializeNews(){
//     fetch(url)
//     .then(response => {
//         if(!response.ok) throw Error(response.statusText)
//         return response.json())
//     .then(data => {
//         console.log(data)
//         displayNews(data.articles)
//     })
//     .catch(error => console.log(error))
// }

// Combined event listeners for search
searchBtn.addEventListener('click', handleSearchEvent)
searchInput.addEventListener('keypress', handleSearchEvent)

function handleSearchEvent(e) {
    // Trigger search on click or Enter key press
    if (e.type === 'click' || (e.type === 'keypress' && e.key === 'Enter')) {
        const searchTerm = searchInput.value.trim()
        if (searchTerm) {
            // Use everything endpoint for search to get more results
            url = `https://newsapi.org/v2/everything?q=${searchTerm}+sports&apiKey=${apiKey}`
        } else {
            // Reset to default sports headlines if search is empty
            url = `https://newsapi.org/v2/top-headlines?category=sports&country=us&apiKey=${apiKey}`
        }
        initializeNews()
    }
}

function displayNews(arr){
    newsContainer.innerHTML = ''; // Clear previous content
    
    arr.forEach(article => {
        const articleContainer = document.createElement("article");
        articleContainer.className = "news-article";
        
        // Only create and append image if urlToImage exists
        if (article.urlToImage) {
            const image = document.createElement("img");
            image.src = article.urlToImage;
            image.alt = article.title;
            image.onerror = function() {
                this.style.display = 'none'; // Hide image if it fails to load
            };
            articleContainer.appendChild(image);
        }

        const title = document.createElement("h3");
        title.textContent = article.title || 'No title available';

        const description = document.createElement("p");
        description.textContent = article.description || 'No description available';

        const meta = document.createElement("div");
        meta.className = "meta";
        
        const date = new Date(article.publishedAt).toLocaleDateString();
        const source = article.source?.name || 'Unknown source';
        meta.innerHTML = `<span>${source}</span><span>${date}</span>`;

        const link = document.createElement("a");
        link.href = article.url;
        link.textContent = "Read More";
        link.target = "_blank";
        link.className = "read-more";

        articleContainer.appendChild(title);
        articleContainer.appendChild(description);
        articleContainer.appendChild(meta);
        articleContainer.appendChild(link);

        newsContainer.appendChild(articleContainer);
    });
}

window.addEventListener("load", initializeNews);