// Контейнер, в который загружаем контент 
const contentElement = document.getElementById("content");  
// Объект, который содержит содержимое для различных страниц
const pages = { 
    home: { content: "Home Page", url: "#home"},      
    about: { content: "About Page", url: "#about"  },
    contacts: { content: "Contact Page", url: "#contacts"}   
};  
// Обработчик нажатия на ссылки
function handleClick(event){
    // получаем адрес перехода
    const url = event.target.getAttribute("href");
    // получаем имя страницы, которая совпадает с адресом перехода
    const pageName = url.split("#").pop();
    // получаем страницу из объекта pages
    const page = pages[pageName];
    // если текущий адрес совпадает с запрошенным, то игнорируем переход
    if(history.state.url != url) {
        contentElement.textContent = page.content;   
        // добавляем в историю
        history.pushState(page,  // объект state      
            event.target.textContent,   // Title      
            event.target.href           // URL    
        );
        document.title = event.target.textContent; // если браузер не устанавливает заголовок
    }
    return event.preventDefault();  
}  
// устанавливаем обработчик для извлечения состояния в History API
window.addEventListener("popstate", (event) => { 
    if(event.state)       // если  есть состояние 
        contentElement.textContent = event.state.content;   // получаем старое состояние
});
// устанавливаем обработчик нажатия для кнопок
const links = document.getElementsByTagName("a"); 
for (let i = 0; i < links.length; i++) {
    links[i].addEventListener("click", handleClick, true);  
} 
// по умолчанию загружаем Home Page
contentElement.textContent = pages.home.content;  
history.pushState(pages.home, "Home", pages.home.url);