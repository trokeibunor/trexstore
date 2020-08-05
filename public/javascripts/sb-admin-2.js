// const e = require("express");

(function($) {
  "use strict"; // Start of use strict

  // Toggle the side navigation
  $("#sidebarToggle, #sidebarToggleTop").on('click', function(e) {
    $("body").toggleClass("sidebar-toggled");
    $(".sidebar").toggleClass("toggled");
    if ($(".sidebar").hasClass("toggled")) {
      $('.sidebar .collapse').collapse('hide');
    };
  });

  // Close any open menu accordions when window is resized below 768px
  $(window).resize(function() {
    if ($(window).width() < 768) {
      $('.sidebar .collapse').collapse('hide');
    };
  });

  // Prevent the content wrapper from scrolling when the fixed side navigation hovered over
  $('body.fixed-nav .sidebar').on('mousewheel DOMMouseScroll wheel', function(e) {
    if ($(window).width() > 768) {
      var e0 = e.originalEvent,
        delta = e0.wheelDelta || -e0.detail;
      this.scrollTop += (delta < 0 ? 1 : -1) * 30;
      e.preventDefault();
    }
  });

  // Scroll to top button appear
  $(document).on('scroll', function() {
    var scrollDistance = $(this).scrollTop();
    if (scrollDistance > 100) {
      $('.scroll-to-top').fadeIn();
    } else {
      $('.scroll-to-top').fadeOut();
    }
  });

  // Smooth scrolling using jQuery easing
  $(document).on('click', 'a.scroll-to-top', function(e) {
    var $anchor = $(this);
    $('html, body').stop().animate({
      scrollTop: ($($anchor.attr('href')).offset().top)
    }, 1000, 'easeInOutExpo');
    e.preventDefault();
  });

})(jQuery); // End of use strict

//SIDEBAR TOGGLE FUNCTION

// Nav links
var dashboardLink = document.querySelector('#dashboard-link');
var productLink = document.querySelector('#product-link');
var salesLink = document.querySelector('#sales-link');
var addProduct = document.querySelector('#add-products-link')

// components
var dashboard = document.querySelector('#dashboard-top');
var productList = document.querySelector('#productsList');
var update = document.querySelector('#add-products');
var sales = document.querySelector('#view-sales');

// TOGGLE FUNCTION
dashboardLink.addEventListener('click',function(){
  dashboard.classList.remove('d-none');
  productList.classList.add('d-none');
  update.classList.add('d-none');
  sales.classList.add('d-none')
});
productLink.addEventListener('click',function(){
  productList.classList.remove('d-none')
  dashboard.classList.add('d-none');
  update.classList.add('d-none');
  sales.classList.add('d-none')
});
addProduct.addEventListener('click',function(){
  update.classList.remove('d-none');
  dashboard.classList.add('d-none');
  productList.classList.add('d-none');
  sales.classList.add('d-none');
});
salesLink.addEventListener('click',function(){
  sales.classList.remove('d-none');
  dashboard.classList.add('d-none');
  productList.classList.add('d-none');
  update.classList.add('d-none')
})