/* Get All products */
$(function () {  // Document ready function
    $.get(allProductsUrl, function (response) {
        if (response) {
            var myTable = '';
            $.each(response, function (index, product) {
                myTable += '<tr data-id="' + product.product_id + '" data-name="' + product.name + '" data-unit="' + product.uom_id + '" data-price="' + product.price_per_unit + '">' +
                    '<td>' + product.name + '</td>' +
                    '<td>' + product.uom_name + '</td>' +
                    '<td>' + product.price_per_unit + '</td>' +
                    '<td><span class="btn btn-xs btn-danger delete-product">Delete</span></td></tr>';

            });

            $("table").find('tbody').empty().html(myTable);
        }
    });
    
});

$("#productCloseButton").on('click', function () {
    window.location.href = "http://127.0.0.1:5501/manageProducts.html";
})

/* Create Product */
$('#saveProduct').on('click', function (event) {
    event.preventDefault();

    var data = $('#productForm').serializeArray();
    var requestPayload = {
        name: null,
        uom_id: null,
        price_per_unit: null
    };

    for (var i = 0; i < data.length; ++i) {
        var element = data[i];
        switch (element.name) {
            case 'name':
                requestPayload.name = element.value;
                break;
            case 'uoms':
                requestPayload.uom_id = element.value;
                break;
            case 'price':
                requestPayload.price_per_unit = element.value;
                break;
        }
    }

    callApi("POST", insertProductUrl, { 'data': JSON.stringify(requestPayload) })
        .done(function (response) {
            $('#message').text("Product saved successfully.").css({
                "color": "green",
            });
            $("#productCloseButton, #saveProduct").css('visibility', 'hidden')

            setTimeout(function () {
                window.location.reload();
            }, 2000);
        })
        .fail(function (error) {
            $('#message').text("Failed to save product.").css({
                "color": "red",
            });
            $("#productCloseButton, #saveProduct").css('visibility', 'hidden')

            setTimeout(function () {
                window.location.reload();
            }, 2000);
        });
});


/* Delete Product */
$(document).on("click", ".delete-product", function () {
    var tr = $(this).closest('tr');
    console.log(tr)
    var data = {
        product_id: tr.data('id')
    };
    console.log(data)
    var isDelete = confirm("Are you sure to delete " + tr.data('name') + " item?");
    if (isDelete) {
        callApi("POST", deleteProductUrl, data)
            .done(function (response) {
                window.location.reload()
            })
            .fail(function (error) {
                console.log("Failed to delete Product")
            })
    }
});