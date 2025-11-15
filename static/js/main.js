(function ($) {
    "use strict";

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner(0);


    // Fixed Navbar
    $(window).scroll(function () {
        if ($(window).width() < 992) {
            if ($(this).scrollTop() > 55) {
                $('.fixed-top').addClass('shadow');
            } else {
                $('.fixed-top').removeClass('shadow');
            }
        } else {
            if ($(this).scrollTop() > 55) {
                $('.fixed-top').addClass('shadow').css('top', -55);
            } else {
                $('.fixed-top').removeClass('shadow').css('top', 0);
            }
        } 
    });
    
    
   // Back to top button
   $(window).scroll(function () {
    if ($(this).scrollTop() > 300) {
        $('.back-to-top').fadeIn('slow');
    } else {
        $('.back-to-top').fadeOut('slow');
    }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });


    // Testimonial carousel
    $(".testimonial-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 2000,
        center: false,
        dots: true,
        loop: true,
        margin: 25,
        nav : true,
        navText : [
            '<i class="bi bi-arrow-left"></i>',
            '<i class="bi bi-arrow-right"></i>'
        ],
        responsiveClass: true,
        responsive: {
            0:{
                items:1
            },
            576:{
                items:1
            },
            768:{
                items:1
            },
            992:{
                items:2
            },
            1200:{
                items:2
            }
        }
    });


    // vegetable carousel
    $(".vegetable-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1500,
        center: false,
        dots: true,
        loop: true,
        margin: 25,
        nav : true,
        navText : [
            '<i class="bi bi-arrow-left"></i>',
            '<i class="bi bi-arrow-right"></i>'
        ],
        responsiveClass: true,
        responsive: {
            0:{
                items:1
            },
            576:{
                items:1
            },
            768:{
                items:2
            },
            992:{
                items:3
            },
            1200:{
                items:4
            }
        }
    });


    // Modal Video
    $(document).ready(function () {
        var $videoSrc;
        $('.btn-play').click(function () {
            $videoSrc = $(this).data("src");
        });
        console.log($videoSrc);

        $('#videoModal').on('shown.bs.modal', function (e) {
            $("#video").attr('src', $videoSrc + "?autoplay=1&amp;modestbranding=1&amp;showinfo=0");
        })

        $('#videoModal').on('hide.bs.modal', function (e) {
            $("#video").attr('src', $videoSrc);
        })
    });



    // Product Quantity
    $('.quantity button').on('click', function () {
        var button = $(this);
        var oldValue = button.parent().parent().find('input').val();
        if (button.hasClass('btn-plus')) {
            var newVal = parseFloat(oldValue) + 1;
        } else {
            if (oldValue > 0) {
                var newVal = parseFloat(oldValue) - 1;
            } else {
                newVal = 0;
            }
        }
        button.parent().parent().find('input').val(newVal);
    });

    // Toast notification function
    function showToast(type, message) {
        // Remove existing toasts
        $('.toast-notification').remove();
        
        // Create toast
        var bgColor = type === 'success' ? 'bg-success' : 'bg-danger';
        var icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
        var toast = $('<div class="toast-notification ' + bgColor + ' text-white px-4 py-3 rounded shadow-lg" style="position: fixed; top: 80px; right: 20px; z-index: 9999; min-width: 300px; animation: slideIn 0.3s ease-out;">' +
            '<div class="d-flex align-items-center">' +
            '<i class="fas ' + icon + ' me-2 fa-lg"></i>' +
            '<span>' + message + '</span>' +
            '</div>' +
            '</div>');
        
        $('body').append(toast);
        
        // Auto remove after 3 seconds
        setTimeout(function() {
            toast.fadeOut(300, function() {
                $(this).remove();
            });
        }, 3000);
    }

    // AJAX Add to Cart - Prevent multiple attachments
    if (!window.addToCartHandlerAttached) {
        window.addToCartHandlerAttached = true;
        
        // Use event delegation to handle clicks on add-to-cart buttons
        $(document).on('click', '.add-to-cart-btn', function(e) {
            console.log('Add to cart button clicked');
            
            // Prevent default immediately - this is the most important line
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            
            var btn = $(this);
            var href = btn.attr('href');
            var productId = btn.data('product-id');
            var productName = btn.data('product-name');
            var originalText = btn.html();
            
            // Check if button is already processing
            if (btn.prop('disabled') || btn.hasClass('processing')) {
                console.log('Button already processing, ignoring click');
                return false;
            }
            
            // Mark as processing
            btn.addClass('processing');
            btn.prop('disabled', true);
            btn.css('pointer-events', 'none');
            btn.html('<i class="fa fa-spinner fa-spin me-2 text-primary"></i> Adding...');
            
            $.ajax({
                url: href,
                type: 'GET',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest'
                },
                success: function(response) {
                    try {
                        if (response && response.success) {
                            // Update cart count
                            var cartCountElement = $('#cart-count');
                            if (cartCountElement.length) {
                                cartCountElement.text(response.cart_count);
                            }
                            
                            // Show success message
                            showToast('success', response.message || 'Product added to cart');
                            
                            // Reset button after a short delay
                            setTimeout(function() {
                                btn.removeClass('processing');
                                btn.prop('disabled', false);
                                btn.css('pointer-events', 'auto');
                                btn.html(originalText);
                            }, 500);
                        } else {
                            showToast('error', response.message || 'Failed to add product to cart');
                            btn.removeClass('processing');
                            btn.prop('disabled', false);
                            btn.css('pointer-events', 'auto');
                            btn.html(originalText);
                        }
                    } catch (err) {
                        console.error('Error processing response:', err);
                        showToast('error', 'An error occurred processing the response.');
                        btn.removeClass('processing');
                        btn.prop('disabled', false);
                        btn.css('pointer-events', 'auto');
                        btn.html(originalText);
                    }
                },
                error: function(xhr, status, error) {
                    console.error('AJAX Error:', status, error, xhr.responseText);
                    showToast('error', 'An error occurred. Please try again.');
                    btn.removeClass('processing');
                    btn.prop('disabled', false);
                    btn.css('pointer-events', 'auto');
                    btn.html(originalText);
                }
            });
            
            return false;
        });
        
        // Initialize on document ready
        $(document).ready(function() {
            console.log('AJAX Add to Cart handler initialized');
            console.log('Found', $('.add-to-cart-btn').length, 'add-to-cart buttons');
        });
    }

    // Cart operations (remove, add, delete) - Prevent multiple attachments
    if (!window.cartOperationsHandlerAttached) {
        window.cartOperationsHandlerAttached = true;
        
        // Function to update cart table with new data
        function updateCartTable(productsData) {
            var tbody = $('#cart-items');
            
            if (!productsData || productsData.length === 0) {
                tbody.html('<tr><td colspan="6" class="text-center py-5"><h5>Your cart is empty</h5></td></tr>');
                $('#cart-subtotal').text('₹ 0');
                $('#cart-grand-total').text('₹ 100');
                return;
            }
            
            var html = '';
            for (var i = 0; i < productsData.length; i++) {
                var product = productsData[i];
                // Build image URL - prepend /static/ if not already present
                var imgUrl = product.image_url || '';
                if (imgUrl && !imgUrl.startsWith('/static/') && !imgUrl.startsWith('http')) {
                    imgUrl = '/static/' + imgUrl;
                }
                html += '<tr data-product-id="' + product.id + '">' +
                    '<th scope="row">' +
                    '<div class="d-flex align-items-center">' +
                    '<img src="' + imgUrl + '" class="img-fluid me-5 rounded-circle" style="width: 80px; height: 80px;" alt="">' +
                    '</div></th>' +
                    '<td><p class="mb-0 mt-4">' + product.name + '</p></td>' +
                    '<td><p class="mb-0 mt-4">₹ ' + product.price + '</p></td>' +
                    '<td><div class="input-group quantity mt-4" style="width: 100px;">' +
                    '<div class="input-group-btn">' +
                    '<span class="btn btn-sm btn-minus rounded-circle bg-light border">' +
                    '<a href="/cart-remove/' + product.id + '/" class="cart-remove-btn" data-product-id="' + product.id + '"><i class="fa fa-minus"></i></a>' +
                    '</span></div>' +
                    '<input type="text" class="form-control form-control-sm text-center border-0 cart-quantity" value="' + product.quantity + '" readonly>' +
                    '<div class="input-group-btn">' +
                    '<span class="btn btn-sm btn-plus rounded-circle bg-light border">' +
                    '<a href="/cart-add/' + product.id + '/" class="cart-add-btn" data-product-id="' + product.id + '"><i class="fa fa-plus"></i></a>' +
                    '</span></div></div></td>' +
                    '<td><p class="mb-0 mt-4 cart-item-total">₹ ' + product.total + '</p></td>' +
                    '<td><span class="btn btn-md rounded-circle bg-light border mt-4">' +
                    '<a href="/cart-delete/' + product.id + '/" class="cart-delete-btn" data-product-id="' + product.id + '"><i class="fa fa-times text-danger"></i></a>' +
                    '</span></td></tr>';
            }
            tbody.html(html);
        }
        
        // Function to handle cart operations
        function handleCartOperation(url, productId, operation) {
            $.ajax({
                url: url,
                type: 'GET',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest'
                },
                success: function(response) {
                    if (response && response.success) {
                        // Update cart count in navbar
                        var cartCountElement = $('#cart-count');
                        if (cartCountElement.length) {
                            cartCountElement.text(response.cart_count);
                        }
                        
                        // Update cart table
                        updateCartTable(response.products);
                        
                        // Update totals
                        $('#cart-subtotal').text('₹ ' + response.total);
                        $('#cart-grand-total').text('₹ ' + response.grand_total);
                        
                        // Show success message
                        var message = operation === 'remove' ? 'Item removed from cart' :
                                     operation === 'add' ? 'Item added to cart' :
                                     'Item deleted from cart';
                        showToast('success', message);
                    } else {
                        showToast('error', 'Failed to update cart');
                    }
                },
                error: function(xhr, status, error) {
                    console.error('Cart operation error:', status, error);
                    showToast('error', 'An error occurred. Please try again.');
                }
            });
        }
        
        // Cart remove handler
        $(document).on('click', '.cart-remove-btn', function(e) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            
            var btn = $(this);
            var productId = btn.data('product-id');
            var url = btn.attr('href');
            
            handleCartOperation(url, productId, 'remove');
            return false;
        });
        
        // Cart add handler
        $(document).on('click', '.cart-add-btn', function(e) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            
            var btn = $(this);
            var productId = btn.data('product-id');
            var url = btn.attr('href');
            
            handleCartOperation(url, productId, 'add');
            return false;
        });
        
        // Cart delete handler
        $(document).on('click', '.cart-delete-btn', function(e) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            
            var btn = $(this);
            var productId = btn.data('product-id');
            var url = btn.attr('href');
            
            if (confirm('Are you sure you want to remove this item from your cart?')) {
                handleCartOperation(url, productId, 'delete');
            }
            return false;
        });
    }

})(jQuery);

