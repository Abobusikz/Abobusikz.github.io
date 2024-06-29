var contentElement = document.getElementById("content");

var pages = {
    home: { content: "Home Page", url: "#home" },
    about: { content: "About Page", url: "#about" },
    contacts: { content: "Contact Page", url: "#contacts" }
};

function handleClick(event) {
    var url = event.target.getAttribute("href");
    // получаем имя страницы, которая совпадает с адресом перехода
    var pageName = url.split("#").pop();
    var page = pages[pageName];
    if (history.state.url != url) {
        contentElement.textContent = page.content;
        history.pushState(page, // объект state      
        event.target.textContent, // Title      
        event.target.href // URL    
        );
        document.title = event.target.textContent; // если браузер не устанавливает заголовок
    }
    return event.preventDefault();
}

window.addEventListener("popstate", function (event) {
    if (event.state) // если  есть состояние 
        contentElement.textContent = event.state.content; // получаем старое состояние
});

var links = document.getElementsByTagName("a");
for (var i = 0; i < links.length; i++) {
    links[i].addEventListener("click", handleClick, true);
}

contentElement.textContent = pages.home.content;
history.pushState(pages.home, "Home", pages.home.url);
