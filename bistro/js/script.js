$(function () {
    $("#navbarToggle").blur(function (event) {
      var screenWidth = window.innerWidth;
      if (screenWidth < 768) {
        $("#collapsable-nav").collapse("hide");
      }
    });
  });
  
  (function (global) {
    var dc = {}; //namespace (david chu's)
  
    var homeHtml = "snippets/home-snippet.html";
    var allCategoriesUrl =
      "https://coursera-jhu-default-rtdb.firebaseio.com/categories.json";
    var categoriesTitleHtml = "snippets/categories-title-snippet.html";
    var categoryHtml = "snippets/category-snippet.html";
    var menuItemsUrl =
      "https://coursera-jhu-default-rtdb.firebaseio.com/menu_items/";
    var menuItemsTitleHtml = "snippets/menu-items-title.html";
    var menuItemHtml = "snippets/menu-item.html";
  
    //convenience function for inserting innerHTML for 'select'
    var insertHtml = function (selector, html) {
      var targetElem = document.querySelector(selector);
      targetElem.innerHTML = html;
    };
  
    //show loading icon inside element identified by 'selector'.
    var showLoading = function (selector) {
      var html = "<div class='text-center'>";
      html += "<img src='images/ajax-loader.gif'></div>";
      insertHtml(selector, html);
    };
  
    //return substitute of '{{propName}}'
    //with propValue in given 'string'
    var insertProperty = function (string, propName, propValue) {
      var propToReplace = "{{" + propName + "}}";
      string = string.replace(new RegExp(propToReplace, "g"), propValue);
      return string;
    };
  
    //remove the class 'active' from home and switch to Menu button
    var switchMenuToActive = function () {
      //remove 'active' from home button
      var classes = document.querySelector("#navHomeButton").className;
      classes = classes.replace(new RegExp("active", "g"), "");
      document.querySelector("#navHomeButton").className = classes;
  
      //add 'active' to menu button if not already there
      classes = document.querySelector("#navMenuButton").className;
      if (classes.indexOf("active") == -1) {
        classes += " active";
        document.querySelector("#navMenuButton").className = classes;
      }
    };
  
    //on page load (before images or CSS)
    document.addEventListener("DOMContentLoaded", function (event) {
      //on first load, show home view
      showLoading("#main-content");
      $ajaxUtils.sendGetRequest(
        homeHtml,
        function (responseText) {
          document.querySelector("#main-content").innerHTML = responseText;
        },
        false
      );
    });
  
    //load the menu categories view
    dc.loadMenuCategories = function () {
      showLoading("#main-content");
      $ajaxUtils.sendGetRequest(allCategoriesUrl, buildAndShowCategoriesHTML);
    };
  
    //load the menu items view
    dc.loadMenuItems = function (categoryShort) {
      showLoading("#main-content");
      $ajaxUtils.sendGetRequest(
        menuItemsUrl + categoryShort + ".json",
        buildAndShowMenuItemsHTML
      );
    };
  
    //builds HTML for the categories page based on the data
    //from the server
    function buildAndShowCategoriesHTML(categories) {
      //load title snippet of categories page
      $ajaxUtils.sendGetRequest(
        categoriesTitleHtml,
        function (categoriesTitleHtml) {
          //retrieve single category snippet
          $ajaxUtils.sendGetRequest(
            categoryHtml,
            function (categoryHtml) {
              //switch CSS class active to menu button
              switchMenuToActive();
  
              var categoriesViewHtml = buildCategoriesViewHtml(
                categories,
                categoriesTitleHtml,
                categoryHtml
              );
              insertHtml("#main-content", categoriesViewHtml);
            },
            false
          );
        },
        false
      );
    }
  
    //using categories data and snippets html
    //build categories view HTML to be inserted into page
    function buildCategoriesViewHtml(
      categories,
      categoriesTitleHtml,
      categoryHtml
    ) {
      var finalHtml = categoriesTitleHtml;
      finalHtml += "<section class='row'>";
  
      //loop over categories
      for (var i = 0; i < categories.length; i++) {
        //inserting category values
        var html = categoryHtml;
        var name = "" + categories[i].name;
        var short_name = categories[i].short_name;
        html = insertProperty(html, "name", name);
        html = insertProperty(html, "short_name", short_name);
        finalHtml += html;
      }
  
      finalHtml += "</section>";
      return finalHtml;
    }
  
    //building HTML for the single category page based on the data from the server
    function buildAndShowMenuItemsHTML(categoryMenuItems) {
      //load title snippet of menu items page
      $ajaxUtils.sendGetRequest(
        menuItemsTitleHtml,
        function (menuItemsTitleHtml) {
          //retrieve single menu item snippet
          $ajaxUtils.sendGetRequest(
            menuItemHtml,
            function (menuItemHtml) {
              //switch CSS class active to menu button
              switchMenuToActive();
  
              var menuItemsViewHtml = buildMenuItemsViewHtml(
                categoryMenuItems,
                menuItemsTitleHtml,
                menuItemHtml
              );
              insertHtml("#main-content", menuItemsViewHtml);
            },
            false
          );
        },
        false
      );
    }
  
    //using category and menu items data and snippets html
    //build menu items view HTML to be inserted into page
    function buildMenuItemsViewHtml(
      categoryMenuItems,
      menuItemsTitleHtml,
      menuItemHtml
    ) {
      menuItemsTitleHtml = insertProperty(
        menuItemsTitleHtml,
        "name",
        categoryMenuItems.category.name
      );
      menuItemsTitleHtml = insertProperty(
        menuItemsTitleHtml,
        "special_instructions",
        categoryMenuItems.category.special_instructions
      );
  
      var finalHtml = menuItemsTitleHtml;
      finalHtml += "<section class='row'>";
  
      //loop over menu items
      var menuItems = categoryMenuItems.menu_items;
      var catShortName = categoryMenuItems.category.short_name;
      for (var i = 0; i < menuItems.length; i++) {
        //insert menu item values
        var html = menuItemHtml;
        html = insertProperty(html, "short_name", menuItems[i].short_name);
        html = insertProperty(html, "catShortName", catShortName);
        html = insertItemPrice(html, "price_small", menuItems[i].price_small);
        html = insertItemPortionName(
          html,
          "small_portion_name",
          menuItems[i].small_portion_name
        );
        html = insertItemPrice(html, "price_large", menuItems[i].price_large);
        html = insertItemPortionName(
          html,
          "large_portion_name",
          menuItems[i].large_portion_name
        );
        html = insertProperty(html, "name", menuItems[i].name);
        html = insertProperty(html, "description", menuItems[i].description);
  
        //add clearfix after every second menu item
        if (i % 2 != 0) {
          html +=
            "<div class='clearfix visible-lg-block visible-md-block'></div>";
        }
  
        finalHtml += html;
      }
  
      finalHtml += "</section>";
      return finalHtml;
    }
  
    //appends price with '$' if price exists
    function insertItemPrice(html, pricePropName, priceValue) {
      //if not specified, replace with empty string
      if (!priceValue) {
        return insertProperty(html, pricePropName, "");
      }
  
      priceValue = "$" + priceValue.toFixed(2);
      html = insertProperty(html, pricePropName, priceValue);
      return html;
    }
  
    //appends portion name in () if it exists
    function insertItemPortionName(html, portionPropName, portionValue) {
      //if not specified, return original string
      if (!portionValue) {
        return insertProperty(html, portionPropName, "");
      }
  
      portionValue = "(" + portionValue + ")";
      html = insertProperty(html, portionPropName, portionValue);
      return html;
    }
  
    global.$dc = dc;
  })(window);