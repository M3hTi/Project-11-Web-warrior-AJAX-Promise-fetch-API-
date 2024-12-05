const apiKey = "fdae661325754ffab9af2a80d758f9f0"
let url = `https://newsapi.org/v2/top-headlines?category=sports&country=us&apiKey=${apiKey}`
const newsContainer = document.querySelector(".content")
const searchInput = document.querySelector('.search-input')
const searchBtn = document.querySelector('.search-btn')
const aside = document.querySelector('.headlines')
const serachSection = document.querySelector('.search-section')



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
    aside.innerHTML = '<h2>Current Headlines</h2>'; // Reset headlines but keep the title
    
    arr.forEach((article, index) => {
        const articleContainer = document.createElement("article");
        articleContainer.className = "news-article";
        articleContainer.id = `article-${index}`; // Add unique ID for scrolling
        
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

        // Add to headlines sidebar with click functionality
        const headline = document.createElement("div");
        headline.className = "headline-item";
        const headlineLink = document.createElement("a");
        headlineLink.href = `#article-${index}`;
        headlineLink.textContent = article.title || 'No title available';
        

        headline.appendChild(headlineLink);
        aside.appendChild(headline);
        newsContainer.appendChild(articleContainer);
    });
}

function autoComplete() {
    fetch('keywords.json')
    .then(response => {
        if(!response.ok) throw Error(response.statusText)
        return response.json()
    })
    .then(data => {
        const searchInput = document.querySelector('.search-input').value
        const matches = []
        matchFound(searchInput, data.keywords, matches)
        console.log(matches)
        showMatchesWords(matches)

    })
    .catch(error => {
        console.log("Fetch error:", error)  // More detailed error logging
    })
}

function matchFound(searchInput, keywords, matches) {
    // Only find matches if searchInput has content
    if (searchInput.trim() !== '') {
        keywords.forEach(keyword => {
            if (keyword.toLowerCase().startsWith(searchInput.toLowerCase())) {
                matches.push(keyword)
            }
        })
    }
}

function showMatchesWords(arr) {
    // Remove existing suggestions
    const existingList = serachSection.querySelector('ul');
    if (existingList) {
        existingList.remove();
    }

    // Don't show suggestions if array is empty
    if (arr.length === 0) {
        return;
    }

    // Create new suggestions list
    const lists = document.createElement('ul')
    lists.style.position = 'absolute'
    lists.style.top = '50px'
    lists.style.right = '100px'
    lists.style.width = '200px'
    lists.style.backgroundColor = 'white'
    lists.style.border = '1px solid #ddd'
    lists.style.borderRadius = '4px'
    lists.style.padding = '0'
    lists.style.margin = '0'
    lists.style.listStyle = 'none'
    lists.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)'
    lists.style.maxHeight = '200px'
    lists.style.overflowY = 'auto'

    arr.forEach(word => {
        const listItem = document.createElement('li')
        listItem.textContent = word
        listItem.style.padding = '8px 12px'
        listItem.style.cursor = 'pointer'
        listItem.style.borderBottom = '1px solid #eee'
        listItem.addEventListener('mouseover', () => {
            listItem.style.backgroundColor = '#f0f0f0'
        })
        listItem.addEventListener('mouseout', () => {
            listItem.style.backgroundColor = 'white'
        })
        listItem.addEventListener('click', () => {
            searchInput.value = word
            lists.remove()
        })
        lists.appendChild(listItem)
    })
    serachSection.appendChild(lists)
}

searchInput.addEventListener('input', autoComplete)
window.addEventListener("load", initializeNews);