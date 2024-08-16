$(function () {
    $.get(allOrdersUrl, function (response) {
        if (response) {
            var myTable = '';
            $.each(response, function (index, order) {
                myTable += '<tr data-id="' + order.order_id + '">' +
                    '<td>' + order.order_id + '</td>' +
                    '<td>' + order.customer_name + '</td>' +
                    '<td>' + order.total.toFixed(2) + ' Rs</td>' +
                    '<td>' + order.datetime + '</td>' +
                    '<td>' + '<a href="#" class="detail-link" data-id="' + order.order_id + '">Detail</a>' + '</td></tr>';
            });
            $("table").find('tbody').empty().html(myTable);

            $('.detail-link').on('click', function (e) {
                e.preventDefault();
                var orderId = $(this).data('id');

                var order = response.find(o => o.order_id === orderId);

                var orderDetails = 
                    '<div class="indentation">' +
                        '<p>Order ID: <strong> ' + order.order_id + '</strong></p>' +
                        '<p>Date: <strong> ' + order.datetime.slice(5,16) + '</strong></p>' +
                    '</div>' + 
                    '<div class="indentation">' + 
                        '<p>Customer Name: <strong> ' + order.customer_name + '</strong></p>' +
                        '<p>Total Price Paid: <strong> ₹' + order.total.toFixed(2) + '</strong></p>' +
                    '</div>' +
                    '<div class="order-details-scrollable">' +
                        '<table class="table table-sm">' +
                            '<thead>' +
                                '<tr>' +
                                    '<th>Name</th>' +
                                    '<th>Price per Unit</th>' +
                                    '<th>Qty</th>' +
                                    '<th>Total</th>' +
                                '</tr>' +
                            '</thead>' +
                            '<tbody>';

                $.each(order.order_details, function (index, item) {
                    orderDetails += '<tr>' +
                        '<td>' + item.name + '</td>' +
                        '<td> ₹ ' + item.price_per_unit.toFixed(2) + '</td>' +
                        '<td>' + item.qty + '</td>' +
                        '<td> ₹ ' + item.total_price.toFixed(2) + '</td>' +
                        '</tr>';
                });

                orderDetails += '</tbody></table></div>';

                $('#orderDetailContent').html(orderDetails);

                $('#orderDetailDiv').show();
            });

            // Handle close button click event
            $('#closeOrderDetail').on('click', function () {
                $('#orderDetailDiv').hide();
            });
        }
    });
});
