// Initialize the productPrices object
productPrices = {};
productNames = {};
var orderDetails = [];
var grand_total = 0;

$(function () {
    $.get(allProductsUrl, function (response) {
        if (response) {
            var option = '<option value="">Select Item</option>';
            $.each(response, function (index, prod) {
                option += '<option value="' + prod.product_id + '">' + prod.name + ' - ₹' + prod.price_per_unit + '</option>';
                productPrices[prod.product_id] = prod.price_per_unit;
                productNames[prod.product_id] = prod.name;
            });

            $("#selectProduct").empty().html(option);
        }
    });
});

$(document).ready(function () {
    var currentDate = new Date().toLocaleDateString();
    $('.dateElement').text(currentDate);
});

function updateCost(evt) {
    evt.preventDefault();

    const selectedProductId = $("#selectProduct").val();
    const quantity = $("#selectQuantity").val();

    const itemPrice = productPrices[selectedProductId] || 0;
    const itemIntoQtyPrice = itemPrice * quantity;

    $("#item_qty_price").text("₹ " + itemIntoQtyPrice.toFixed(2));
}

$("#selectProduct").on("change", updateCost);
$("#selectQuantity").on("change", updateCost);

/* ADD TO CART */
$(".add-to-cart-btn").on('click', function (evt) {
    evt.preventDefault();
    const selectedProductId = $("#selectProduct").val();
    const quantity = $("#selectQuantity").val();

    if (selectedProductId && quantity > 0) { // Ensure a valid product and quantity are selected
        var PreVal = $("#items_in_cart").val();
        var inst_total = productPrices[selectedProductId] * quantity;

        grand_total += inst_total;

        PreVal += (productNames[selectedProductId] + " - ₹ " + inst_total.toFixed(2) + "\n");
        $("#items_in_cart").val(PreVal);  // Use `val` instead of `text` for textarea
        $("#total_price_till_now").text("Grand Total - ₹" + grand_total.toFixed(2));

        orderDetails.push({
            product_id: selectedProductId,
            qty: quantity,
            total_price: inst_total
        });
    } else {
        alert("Please select a product and a valid quantity.");
    }
});

/* CLEAR ORDER */
$("#orderClearBtn").on("click", function (event) {
    event.preventDefault();
    grand_total = 0;
    orderDetails = [];
    window.location.reload();
});

/* SAVE ORDER */
$("#saveOrder").on("click", function (event) {
    event.preventDefault();

    if (orderDetails.length === 0) {
        alert("No items in the cart.");
        return;
    }

    var customerName = $("#customer_name").val();
    if (!customerName) {
        alert("Please enter a customer name.");
        return;
    }

    var payload = {
        customer_name: customerName,
        total: grand_total,
        order_details: orderDetails
    };

    callApi("POST", createOrderUrl, { 'data': JSON.stringify(payload) })
        .done(function (response) {
            $('#message').text("Order saved successfully.").css("color", "green");
            $("#orderClearBtn, #saveOrder").css('visibility', 'hidden');

            setTimeout(function () {
                window.location.reload();
            }, 2000);
        })
        .fail(function (error) {
            $('#message').text("Failed to save order.").css("color", "red");
            $("#orderClearBtn, #saveOrder").css('visibility', 'hidden');

            // setTimeout(function () {
            //     window.location.reload();
            // }, 2000);
        });
});
