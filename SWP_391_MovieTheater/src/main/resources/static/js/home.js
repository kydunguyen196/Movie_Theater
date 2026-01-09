$(document).ready(function () {
    $('#nav-content').find('.view-score').addClass('active');
    loadData(pageNumber, pageSize);
    bookTicket();
})

let lsdRing = $('.lsd-ring-container');
let pageSize = 2;
let pageNumber = 0;

function loadData(pageNumber, pageSize) {
    $.ajax({
        url: '/get-all-movie-for-member',
        type: 'GET',
        data: {
            pageNumber: pageNumber,
            pageSize: pageSize,
        },
        beforeSend: function () {
            lsdRing.removeClass('d-none');
        },
        success: function (response) {
            const table = $('#movie-items');
            const data = response.data;
            if (data == null) {
                Swal.fire({
                    title: "No Data",
                    icon: "error",
                    text: "Please try later.",
                    confirmButtonText: "Oke Bro :)",
                });
                return;
            }
            const lstMovieHomeDTO = data.lstMovieHomeDTO;
            if (lstMovieHomeDTO === null || lstMovieHomeDTO.length === 0 || data.pageNumber === null || data.pageSize === null || data.totalPage === null) {    //No Data
                table.empty();
                renderPagination(1, 1);
            } else {                          //Has Data
                table.empty();
                $.each(lstMovieHomeDTO, function (index, value) {
                    table.append(rowTemplate(index, value));
                });
                renderPagination(data.pageNumber, data.totalPage);
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
            loadMovieSchedule();
        }
    });
}

// Render Data

function rowTemplate(index, rowData) {
    // Tạo một biến để giữ chuỗi HTML của các nút loại phim
    var movieTypesHtml = '';

    // Duyệt qua mảng typeMovies và thêm mỗi loại vào chuỗi HTML
    $.each(rowData.typeMovies, function (i, value) {
        movieTypesHtml += `<button type="button" class="btn btn-outline-success me-2 mb-2 fw-bold">${value}</button>`;
    });

    // Trả về chuỗi template của bạn với movieTypesHtml đã được nối vào
    return `
    <div class="col-xl-3 col-lg-4 col-6 p-3">
        <div class="card border-dark rounded bg-dark" style="width: 100%;">
            <img src="${rowData.smallImage}" class="rounded bg-dark movie-small-img" style="width: 100%;" alt="">
            <div class="card-body bg-dark text-light px-0">
                <h3 class="card-title  fw-bold movie-name">${rowData.movieNameEnglish}</h3>
                <div class="pb-3 d-flex flex-wrap movie-attribute">
                    ${movieTypesHtml}                     
                </div>
                <button class="button-63 rounded fw-bold text-light w-75 buy-ticket" role="button" data-movie-id="${rowData.movieId}" data-bs-target="#select-movie" data-bs-toggle="modal">Buy Ticket</button>
            </div>
        </div>
    </div>
    `;
}


//Render Số trang
function renderPagination(pageNumber, totalPage) {
    let paginationRoot = $('.pagination');
    paginationRoot.empty();
    let html = '<li class="page-item" data-page-number="' + (pageNumber === 0 ? pageNumber : pageNumber - 1) + '"><span class="page-link text-dark">Previous</span></li>';

    for (var i = 0; i < totalPage; i++) {
        if (i === pageNumber) {
            html += '<li class="page-item" data-page-number="' + i + '"><span class="page-link text-white bg-dark  border-dark">' + (i + 1) + '</span></li>';
        } else {
            html += '<li class="page-item" data-page-number="' + i + '"><span class="page-link text-dark">' + (i + 1) + '</span></li>';
        }
    }

    html += '<li class="page-item" data-page-number="' + (pageNumber === totalPage - 1 ? pageNumber : pageNumber + 1) + '"><span class="page-link text-dark">Next</span></li>';

    paginationRoot.html(html);
    changePagination();
}

function changePagination() {
    let paginationRoot = $('.pagination');
    paginationRoot.off('click', '.page-item');
    paginationRoot.on('click', '.page-item', function () {
        pageNumber = $(this).data('page-number');
        loadData(pageNumber, pageSize);
    })
}

let scheduleTime = '';
let schedule = [];
let movieId = '';

//Load movie Schedule
function loadMovieSchedule() {
    $('.buy-ticket').off('click');
    $('.buy-ticket').on('click', function () {
        movieId = $(this).data('movie-id');

        $.ajax({
            url: '/get-movie-schedule-by-movie-id',
            type: 'GET',
            data: {
                movieId: movieId
            },
            beforeSend: function () {
                lsdRing.removeClass('d-none');
            },
            success: function (response) {
                if (response.data !== null && response.data.length > 0) {
                    schedule = response.data;
                    scheduleTime = schedule[0].scheduleTime;
                    renderDate();
                } else {
                    Swal.fire({
                        title: "No Data",
                        icon: "error",
                        text: "Please try later.",
                        confirmButtonText: "Oke Bro :)",
                    });
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

    })
}

function renderDate() {
    let dateContainer = $('#container-date');
    dateContainer.empty();

    // Đối tượng để lưu trữ các ngày duy nhất
    let uniqueDates = {};

    $.each(schedule, function (index, value) {
        // Định dạng ngày từ thời gian lịch trình
        let formattedDate = formatDateString(value.scheduleTime);

        // Kiểm tra xem ngày đã được thêm vào chưa
        if (!uniqueDates[formattedDate]) {
            // Nếu chưa, thêm vào uniqueDates và dateContainer
            uniqueDates[formattedDate] = true;

            if (index === 0) {
                dateContainer.append(`
                    <label class="me-3 date" data-schedule-time="` + value.scheduleTime + `">
                        <input type="radio" name="movieDate" checked="">
                        <span>` + formattedDate + `</span>
                    </label>
                `);
            } else {
                dateContainer.append(`
                    <label class="me-3 date" data-schedule-time="` + value.scheduleTime + `">
                        <input type="radio" name="movieDate">
                        <span>` + formattedDate + `</span>
                    </label>
                `);
            }
        }
    });

    changeDate();
    // Gọi hàm renderTime với ngày đầu tiên (nếu có)
    renderTime();
    $('#money').text('00.0');
}

function changeDate() {
    $('.date').off('click')
    $('.date').on('click', function () {
        scheduleTime = $(this).data('schedule-time');
        renderTime();
        $('#money').text('00.0');
    })
}

function formatDateString(dateString) {
    // Parse the string into a Date object
    var date = new Date(dateString);

    // Extract the parts of the date
    var day = date.getDate().toString().padStart(2, '0'); // Day (with leading zeros)
    var month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month (with leading zeros, January is 0!)
    var year = date.getFullYear(); // Year

    // Format the date as "dd/mm/yyyy hh:mm"
    return day + '/' + month + '/' + year;
}

function renderTime() {
    let timeContainer = $('#container-time');
    timeContainer.empty();
    let isFirstDate = true;
    $.each(schedule, function (index, value) {
        if (formatDateString(value.scheduleTime) === formatDateString(scheduleTime)) {
            if (isFirstDate) {
                timeContainer.append(`
                    <label class="me-3 time" data-schedule-time="` + value.scheduleTime + `">
                        <input type="radio" name="radio" checked="">
                            <span>${formatDateTimeString(value.scheduleTime)}</span>
                    </label>
                `)
                isFirstDate = false;
            } else {
                timeContainer.append(`
                    <label class="me-3 time" data-schedule-time="` + value.scheduleTime + `">
                        <input type="radio" name="radio">
                        <span>${formatDateTimeString(value.scheduleTime)}</span>
                    </label>
                `)
            }
        }
    })
    onchangeTime();
    // renderSeat();
    renderSeat();
    $('#money').text('00.0');
}

function formatDateTimeString(dateString) {
    // Parse the string into a Date object
    var date = new Date(dateString);

    // Extract the parts of the date
    var hour = date.getHours().toString().padStart(2, '0'); // Hour (with leading zeros)
    var minute = date.getMinutes().toString().padStart(2, '0'); // Minute (with leading zeros)

    // Format the date as "dd/mm/yyyy hh:mm"
    return hour + ':' + minute;
}

function onchangeTime() {
    $('.time').off('click')
    $('.time').on('click', function () {
        scheduleTime = $(this).data('schedule-time');
        renderSeat();
        $('#money').text('00.0');
    })
}

function renderSeat() {
    $.ajax({
        url: '/get-seat-by-movie-id-and-schedule',
        type: 'GET',
        data: {
            movieId: movieId,
            scheduleTime: scheduleTime
        },
        beforeSend: function () {
            lsdRing.removeClass('d-none');
        },
        success: function (response) {
            let data = response.data;
            let html = '';

            // Duyệt mảng data
            let row = 1;
            let startRow = true;
            let endRow = false;
            data.forEach(function (item) {
                if (startRow){
                    html += `<div class="d-flex">`;
                    startRow = false;
                }
                if (item.seatRow === row){
                    // Mỗi item tạo ra 1 thẻ div
                    html += `
                    <div class="checkbox-wrapper-10 mb-2 me-2">
                         <input type="checkbox" id="${item.scheduleSeatId}"  class="tgl tgl-flip seat" ${item.selected ? 'disabled' : ''} data-schedule-seat-id="${item.scheduleSeatId}" data-schedule-seat-price="${item.price}">
                        <label for="${item.scheduleSeatId}" data-tg-on="${item.seatRow}${item.seatColumn}" data-tg-off="${item.seatRow}${item.seatColumn}" class="tgl-btn seat-label ${item.selected ? 'seat-selected' : ''}"></label>  
                    </div>

                `;
                }else{
                    startRow = true;
                    endRow = true;
                    row++;
                }
                if (endRow){
                    html += `</div>`;
                    endRow = false;
                }

            });

            // Thêm chuỗi html vào #seat-item
            $('#seat-item').empty();
            $('#seat-item').html(html);
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
            selectSeat();
        }
    });
}

function selectSeat(){
    $('.seat-label').off('click');
    $('.seat-label').on('click',function (){
        const inputId = $(this).attr('for');
        const inputChecked = $('#' + inputId).is(':checked');
        const seatPrice = $('#' + inputId).data('schedule-seat-price');

        var currentMoney = parseFloat($('#money').text().replace(/[^\d]/g, ''));


        if (!inputChecked) {
            $('#money').text((currentMoney + seatPrice).toLocaleString('vi-VN'));
        }else{
            $('#money').text((currentMoney - seatPrice).toLocaleString('vi-VN'));
        }
    })
}

function bookTicket(){
    $('#booking-ticket').on('click', function() {
        var checkedSeats = []; // Mảng để lưu thông tin các ghế được chọn

        $('.seat:checked').each(function() {
            // Thu thập thông tin của mỗi ghế được chọn
            checkedSeats.push($(this).data('schedule-seat-id'));
        });

        if (checkedSeats.length < 0){
            Swal.fire({
                title: "Please Select Seat Before",
                icon: "error",
                text: "Please try later.",
                confirmButtonText: "Oke Bro :)",
            });
            return;
        }

        $.ajax({
            url: '/book-ticket', // URL của endpoint trong Spring Boot
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(checkedSeats), // Chuyển mảng thành JSON
            success: function(response) {
                Swal.fire({
                    title: "Buy Success",
                    icon: "success",
                    confirmButtonText: "Oke Bro :)",
                });
            },
            error: function(error) {
                Swal.fire({
                    title: "Buy Fail",
                    icon: "error",
                    confirmButtonText: "Oke Bro :)",
                });
            }
        });
    });

}
