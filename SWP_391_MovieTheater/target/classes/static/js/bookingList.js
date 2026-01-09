$(document).ready(function () {
    loadData(pageNumber, pageSize, searchByInvoiceId);
    searchByBookingIdFunction();
    changePageSize();
    attachCheckboxClickHandlers(); // Thêm dòng này
});
let lsdRing = $('.lsd-ring-container');

let pageNumber = 0;
let pageSize = 1;
let searchByInvoiceId = '';
function attachCheckboxClickHandlers() {
    $(document).on('click', '.tgl.tgl-flip', function() {
        const invoiceItemId = this.id;
        const isChecked = this.checked;
        const status = isChecked ? "Confirm" : "Waiting"; // Đặt trạng thái dựa trên giá trị của checkbox
        $.ajax({
            url: '/update-status',
            type: 'POST',
            // Bỏ contentType nếu bạn không cần thiết lập nó một cách rõ ràng
            data: {
                invoiceItemId: invoiceItemId,
                status: status
            },
            beforeSend: function () {
                lsdRing.removeClass('d-none');
            },
            success: function(response) {
                console.log('Status updated successfully for item', invoiceItemId);
                // Có thể thêm mã xử lý thành công ở đây
            },
            error: function(xhr, status, error) {
                console.error('Failed to update status for item', invoiceItemId, ':', error);
                // Có thể thêm mã xử lý lỗi ở đây
            },
            complete: function (xhr, status) {
                lsdRing.addClass('d-none');
            }
        });
    });
}
function loadData(pageNumber, pageSize, searchByInvoiceId) {
    $.ajax({
        url: '/get-booking-ticket',
        data: {
            pageNumber: pageNumber,
            pageSize: pageSize,
            searchByInvoiceId: searchByInvoiceId
        },
        type: 'GET',
        beforeSend: function () {
            lsdRing.removeClass('d-none');
        },
        success: function (response) {
            let table = $('#table-data');
            const data = response.data;
            if(data == null){
                Swal.fire({
                    title: "Load Data Fail",
                    icon: "error",
                    text: "Please try later.",
                    confirmButtonText: "Oke Bro :)",
                });
                return;
            }
            const lstBookingTicket = data.lstBookingTicket;

            if (lstBookingTicket === null || lstBookingTicket.length === 0 || data.pageNumber === null || data.pageSize === null || data.totalPage === null) {    //No Data
                table.empty();
                table.append(nullRowTemplate());
                renderPagination(1, 1);
            } else {                          //Has Data

                table.empty();

                $.each(lstBookingTicket, function (index, value) {
                    table.append(rowTemplate(index + 1, value));
                });

                renderPagination(data.pageNumber, data.totalPage);
            }
            if (response.data && response.data.lstBookingTicket) {
                updateCheckboxStatus(response.data.lstBookingTicket);
                attachCheckboxClickHandlers();
            }

        },
        error: function (xhr, status, error) {
            console.log('Error:', error);
            Swal.fire({
                title: "Load Data Fail",
                icon: "error",
                text: "Please try later.",
                confirmButtonText: "Oke Bro :)",
            });
        },
        complete: function (xhr, status) {
            lsdRing.addClass('d-none');
        }
    });
}

function nullRowTemplate() {
    return `
    <tr>
        <td colspan="10">
            <div class="main__table-text">
                <span >No Data</span>
            </div>
        </td>
    </tr>    
    `
}
function rowTemplate(index, value) {
    const checkboxChecked = value.status === "Confirm" ? "checked" : ""; // Kiểm tra trạng thái để đánh dấu checkbox
    return `
    <tr id="bookingListContainer">
                            <!-- id -->
                            <td>
                                <div class="main__table-text">
                                    <span class="id1" >` + index + `</span>
                                </div>
                            </td>
                            <!-- basic info -->
                            <td>
                                <div class="main__user">
                                    <div class="main__meta">
                                        <span>` + value.invoiceId + `</span>
                                    </div>
                                </div>
                            </td>
                            <!-- === -->
                            <td>
                                <div class="main__user">
                                    <div class="main__meta">
                                        <span>` + value.memberId + `</span>
                                    </div>
                                </div>
                            </td>
                            <!-- username -->
                            <td>
                                <div class="main__table-text">
                                    <span >` + value.fullName + `</span>
                                </div>
                            </td>
                            <!-- Date of birth -->
                            <td>
                                <div class="main__table-text">
                                    <span >` + value.identityCard + `</span>
                                </div>
                            </td>

                            <td>
                                <div class="main__table-text">
                                    <span >` + value.phoneNumber + `</span>
                                </div>
                            </td>
                            <!-- Gender -->
                            <td>
                                <div class="main__table-text main__table-text--green">
                                    <span >` + value.movieNameVn + `</span>
                                </div>
                            </td>
                            <!-- Identity card -->
                            <td>
                                <div class="main__table-text">
                                    <span >` +formatDateString(value.scheduleTime)  + `</span>
                                </div>
                            </td>
                            <!-- Phone number -->
                            <td>
                                <div class="main__table-text">
                                    <span>` + value.seat + `</span>
                                </div>
                            </td>


                            <!-- Action -->
                            <td style="background-color: #3b3b3b !important;">
                                <div class="checkbox-wrapper-10" style="margin-right: 30px;">
                                    <input type="checkbox" id="${value.invoiceItemId}" class="tgl tgl-flip" ${checkboxChecked}>
                                    <label for="${value.invoiceItemId}" data-tg-on="Done!" data-tg-off="Pending" class="tgl-btn"></label>
                                </div>

                            </td>
                        </tr>
    `
}

function updateCheckboxStatus(lstBookingTicket) {
    lstBookingTicket.forEach(ticket => {
        const checkbox = document.getElementById(ticket.invoiceItemId);
        const label = document.querySelector(`label[for="${ticket.invoiceItemId}"]`);

        if (ticket.status === "Confirm") {
            checkbox.checked = true;
            label.setAttribute('data-tg-on', 'Done!');
        } else {
            checkbox.checked = false;
            label.setAttribute('data-tg-off', 'Pending');
        }
    });
}

// Khi tài liệu được tải, cập nhật trạng thái các checkbox
document.addEventListener('DOMContentLoaded', () => {
    // Giả sử responseJson là dữ liệu bạn nhận được từ server
    const responseJson = {
        // ... dữ liệu JSON bạn cung cấp
    };

    updateCheckboxStatus(responseJson.data.lstBookingTicket);
});


function formatDateString(dateString){
    // Parse the string into a Date object
    var date = new Date(dateString);

    // Extract the parts of the date
    var day = date.getDate().toString().padStart(2, '0'); // Day (with leading zeros)
    var month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month (with leading zeros, January is 0!)
    var year = date.getFullYear(); // Year
    var hour = date.getHours().toString().padStart(2, '0'); // Hour (with leading zeros)
    var minute = date.getMinutes().toString().padStart(2, '0'); // Minute (with leading zeros)

    // Format the date as "dd/mm/yyyy hh:mm"
    return day + '/' + month + '/' + year + ' - ' + hour + ':' + minute;
}
function renderPagination(pageNumber, totalPage) {
    let paginationRoot = $('.pagination');
    paginationRoot.empty();
    let html = '<li class="page-item" data-page-number="' + (pageNumber === 0 ? pageNumber : pageNumber - 1) + '"><span class="page-link">Previous</span></li>';

    for (var i = 0; i < totalPage; i++) {
        if (i === pageNumber) {
            html += '<li class="page-item" data-page-number="' + i + '"><span class="page-link active">' + (i + 1) + '</span></li>';
        } else {
            html += '<li class="page-item" data-page-number="' + i + '"><span class="page-link">' + (i + 1) + '</span></li>';
        }
    }

    html += '<li class="page-item" data-page-number="' + (pageNumber === totalPage - 1 ? pageNumber : pageNumber + 1) + '"><span class="page-link">Next</span></li>';

    paginationRoot.html(html);
    changePagination();
}

function changePagination() {
    let paginationRoot = $('.pagination');
    paginationRoot.off('click', '.page-item');
    paginationRoot.on('click', '.page-item', function () {
        pageNumber = $(this).data('page-number');
        loadData(pageNumber, pageSize,searchByInvoiceId );
    })
}

//Change Page Size
function changePageSize(){
    let pageSizeButton = $('#pageSize');
    pageSizeButton.off('change');
    pageSizeButton.on('change',function (){
        pageSize = $(this).val();
        pageNumber = 0;
        loadData(pageNumber,pageSize,searchByInvoiceId);
    })
}

function searchByBookingIdFunction(){
    let searchMovieButton = $('#search-booking');
    searchMovieButton.off('click');
    searchMovieButton.on('click',function (){
        searchByInvoiceId = $('#movie-id').val();
            loadData(pageNumber,pageSize,searchByInvoiceId);
    })


}