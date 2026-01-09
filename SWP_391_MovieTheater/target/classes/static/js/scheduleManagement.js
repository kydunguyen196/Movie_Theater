const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]')
const popoverList = [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl))

// const popover = new bootstrap.Popover('.popover-dismiss', {
//     trigger: 'focus'
// })

let lsdRing = $('.lsd-ring-container');
var movieChosenId;
var movieChosenLong;
var movieChosenName;
var imgSrc;
var movieTimeChosen;
var roomId;
var roomName;
var currentDate = parseDateDMYToYMD(new Date().toLocaleDateString('en-GB').replace(/\//g, '-'));
var status = 'load';

$(document).ready(function () {
    loadAllMovie();
    searchMovie();
    confirmTimeAndMovie();
    popOver();
    loadAllRoom();
    changeDate();
})


function getScheduleByRoomIdAndDay() {
    $('.schedule').each(function () {
        $.ajax({
            url: '/get-movie-schedule-room-by-room-id-and-day',
            type: 'GET',
            data: {
                roomId: '' + $(this).data('room-id'),
                day: '' + currentDate
            },
            beforeSend: function () {
                lsdRing.removeClass('d-none');
            },
            success: function (response) {
                let scheduleList = response.data;
                console.log(scheduleList)
                scheduleList.forEach(function (value) {
                    loadScheduleByRoomAndDay(value.scheduleTime, value.movieId, value.movieNameEnglish,
                        value.movieDuration, value.movieSmallImage, value.cinemaRoomId, value.cinemaRoomName)
                })
            }, error: function (xhr, status, error) {
                console.log('Error:', error);
            }, complete: function (xhr, status) {
                lsdRing.addClass('d-none');
            }
        });
    })
}

function loadAllRoom() {
    $.ajax({
        url: '/get-all-cinema-room',
        type: 'GET',
        beforeSend: function () {
            lsdRing.removeClass('d-none');
        },
        success: function (response) {
            let cinemaRoomLists = response.data;

            cinemaRoomLists.forEach(function (value) {
                var htmlCinema = `
                <div class="row mt-4 schedule" data-room-id="` + value.id + `">
                    <div class="col-12">
                        <div class="d-flex align-items-center justify-content-center" style="height: 100%">
                            <h4 class="fw-bold room-name">` + value.cinemaRoomName + `</h4>
                        </div>
                    </div>
                    <div class="col-12 px-0 time-movie-detail">
                        <div class="container">
                            <div class="row">
                                <div class="fw-bold text-center detail-time col p-0"; style="overflow: hidden">00:00</div>
                                <div class="fw-bold text-center detail-time col p-0"; style="overflow: hidden">01:00</div>
                                <div class="fw-bold text-center detail-time col p-0"; style="overflow: hidden">02:00</div>
                                <div class="fw-bold text-center detail-time col p-0"; style="overflow: hidden">03:00</div>
                                <div class="fw-bold text-center detail-time col p-0"; style="overflow: hidden">04:00</div>
                                <div class="fw-bold text-center detail-time col p-0"; style="overflow: hidden">05:00</div>
                                <div class="fw-bold text-center detail-time col p-0"; style="overflow: hidden">06:00</div>
                                <div class="fw-bold text-center detail-time col p-0"; style="overflow: hidden">07:00</div>
                                <div class="fw-bold text-center detail-time col p-0"; style="overflow: hidden">08:00</div>
                                <div class="fw-bold text-center detail-time col p-0"; style="overflow: hidden">09:00</div>
                                <div class="fw-bold text-center detail-time col p-0"; style="overflow: hidden">10:00</div>
                                <div class="fw-bold text-center detail-time col p-0"; style="overflow: hidden">11:00</div>
                                <div class="fw-bold text-center detail-time col p-0"; style="overflow: hidden">12:00</div>
                                <div class="fw-bold text-center detail-time col p-0"; style="overflow: hidden">13:00</div>
                                <div class="fw-bold text-center detail-time col p-0"; style="overflow: hidden">14:00</div>
                                <div class="fw-bold text-center detail-time col p-0"; style="overflow: hidden">15:00</div>
                                <div class="fw-bold text-center detail-time col p-0"; style="overflow: hidden">16:00</div>
                                <div class="fw-bold text-center detail-time col p-0"; style="overflow: hidden">17:00</div>
                                <div class="fw-bold text-center detail-time col p-0"; style="overflow: hidden">18:00</div>
                                <div class="fw-bold text-center detail-time col p-0"; style="overflow: hidden">19:00</div>
                                <div class="fw-bold text-center detail-time col p-0"; style="overflow: hidden">20:00</div>
                                <div class="fw-bold text-center detail-time col p-0"; style="overflow: hidden">21:00</div>
                                <div class="fw-bold text-center detail-time col p-0"; style="overflow: hidden">22:00</div>
                                <div class="fw-bold text-center detail-time col p-0"; style="overflow: hidden; border-right: 2px solid black">23:00</div>
                            </div>
                        </div>
                    </div>
                    <div class="col-12 px-0">
                        <div class="progress-stacked bg bg-dark" style="border: 2px solid black; height: 65px;
                            border-top-left-radius: 0; border-top-right-radius: 0">

                            <div class="progress empty-schedule" role="progressbar" aria-label="Segment one"
                                 aria-valuenow="0"
                                 aria-valuemin="0" aria-valuemax="1440"
                                 data-movie-id="">
                                <div class="progress-bar bg bg-dark">
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-12 mt-1">
                        <button type="button" class="btn btn-danger open-modal-add-schedule" data-dismiss="modal">
                            + Add Movie
                        </button>
                    </div>
                </div>
            `
                $('#scheduleRoomContent').append(htmlCinema);
            })
            getScheduleByRoomIdAndDay();
            openModal();
        }, error: function (xhr, status, error) {
            console.log('Error:', error);
        }, complete: function (xhr, status) {
            lsdRing.addClass('d-none');
        }
    });
}

function changeDate() {
    $('#selectDay').on('click', function () {
        let date = $('#inputScheduleDate');
        if (date.val() !== '') {
            Swal.fire({
                title: "Confirm to select '" + currentDate + "'?",
                showDenyButton: true,
                icon: 'question',
                confirmButtonText: "Confirm",
                denyButtonText: `No`
            }).then((result) => {
                /* Read more about isConfirmed, isDenied below */
                if (result.isConfirmed) {
                    $('#scheduleRoomContent').html('')
                    status = 'load'
                    loadAllRoom();
                } else if (result.isDenied) {
                    Swal.fire("Changes are not saved", "", "info");
                }
            });
            currentDate = date.val();
        } else {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Haven't chosen a movie or time yet!",
            });
        }
        console.log(currentDate)
    })
}

function popOver() {
    // const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]')
    // const popoverList = [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl))
    var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
    var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl)
    });
}

function loadAllMovie() {
    $.ajax({
        url: '/get-all-movie',
        type: 'GET',
        beforeSend: function () {
            lsdRing.removeClass('d-none');
        },
        success: function (response) {
            var movieList = response.data;
            $('.movie-list-content').html('')
            $.each(movieList, function (index, value) {
                var html = `
                <div class="col-12 col-sm-6 col-md-4 col-lg-3 movie-display" onclick="chooseMovieAnimation(this)" data-movie-id="` + value.movieId + `">
                    <div class="card bg bg-dark fw-danger my-2">
                        <div class="container-img-small">
                              <img src="` + value.smallImage + `" class=""  alt="..." >
                        </div>
                        <div class="card-body p-0">
                            <h5 class="card-title product-title py-1 px-3">
                                <a class="text-lgiht-emphasis text-decoration-none text" style="color: white; font-size: 14px">
                                    <span class="movie-name">` + value.movieNameEnglish + `</span>
                                </a>
                            </h5>
                             <div class="mt-1 border-top border-secondary py-1 px-3 d-flex justify-content-end">
                                  <span class="movie-long text-white-50 fst-italic" style="font-size: 13px">Duration: ` + value.duration + `</span>
                             </div>
                                
                        </div>
                    </div>
                </div>
            `
                $('.movie-list-content').append(html);

            });
        }, error: function (xhr, status, error) {
            console.log('Error:', error);
        }, complete: function (xhr, status) {
            lsdRing.addClass('d-none');
        }
    });
}

function chooseMovieAnimation(element) {
    movieChosenId = $(element).data('movie-id');
    let movieDu = $(element).find('.movie-long').text();

// Sử dụng regular expression để trích xuất con số từ chuỗi
    var durationMatch = movieDu.match(/\d+/);
    movieChosenLong = parseInt(durationMatch[0]);
    movieChosenName = $(element).find('.movie-name').text();
    imgSrc = $(element).find('img').attr('src');
    $('#movieChosenName').text(movieChosenName);
    $('#movieChosenLong').text(movieChosenLong);
    $(element).addClass('clicked');
    setTimeout(function () {
        $(element).removeClass('clicked');
    }, 300);
}

function searchMovie() {
    $('#searchMovie').on('input', function () {
        var keyword = $(this).val().toLowerCase().trim();
        $('.movie-list-content .movie-display').removeClass('d-none').each(function () {
            var typeText = $(this).find('.movie-name').text().toLowerCase();
            if (keyword !== '' && !typeText.includes(keyword)) {
                $(this).addClass('d-none');
            }
        });
    });
}

function confirmTimeAndMovie() {
    $('#confirm-time-and-movie-chosen').on('click', function () {
        let timeChosen = $('#timeChosen').val();
        movieChosenName = $('#movieChosenName').text();
        if (timeChosen === '' || movieChosenId === undefined || movieChosenName === undefined || movieChosenLong === undefined) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Haven't chosen a movie or time yet!",
            });
        } else {

            Swal.fire({
                title: "Add '" + movieChosenName + "' to '" + roomName + "'?",
                showDenyButton: true,
                icon: 'question',
                confirmButtonText: "Confirm",
                denyButtonText: `No`
            }).then((result) => {
                /* Read more about isConfirmed, isDenied below */
                if (result.isConfirmed) {
                    movieTimeChosen = timeChosen;
                    addMovieToSchedule(movieTimeChosen, movieChosenId, movieChosenName, movieChosenLong, imgSrc)
                } else if (result.isDenied) {
                    Swal.fire("Changes are not saved", "", "info");
                }
            });

        }
    })
}

function loadScheduleByRoomAndDay(timeChosenRaw, movieId, movieName, movieLong, imgSrc, roomIdRaw, roomName) {
    // Chuỗi ngày và giờ
    var dateTimeObject = new Date(timeChosenRaw);
    var gio = dateTimeObject.getHours();
    var phut = dateTimeObject.getMinutes();
    var gioPhutFormatted = (gio < 10 ? '0' : '') + gio + ':' + (phut < 10 ? '0' : '') + phut;
    roomId = roomIdRaw;
    addMovieToSchedule(gioPhutFormatted, movieId, movieName, movieLong, imgSrc)
}

function addMovieToSchedule(timeChosen, movieId, movieName, movieLong, imgSrc) {
    let timeStart = convertTimeStringToMinutes(timeChosen);
    let scaleNum = movieLong / 14.4
    if (parseInt(timeStart) + parseInt(movieLong) > 1440) {
        scaleNum = (1440 - parseInt(timeStart)) / 14.4
    }
    console.log('scale num: ',scaleNum)
    console.log(timeChosen, movieId, movieName, movieLong, imgSrc)

    let valueMin = parseInt(timeStart) + parseInt(movieLong);

    var html = `
    <div class="progress movie-in-schedule" role="progressbar" aria-label="Segment one"
                                 aria-valuenow="` + movieLong + `"
                                 aria-valuemin="` + timeStart + `" aria-valuemax="` + valueMin + `" 
                                 style="width: ` + scaleNum + `%; height: 100%"
                                 data-movie-id="` + movieId + `">
                                <div class="progress-bar bg bg-danger">
                                    <a tabindex="0" class="btn movie-time-in-schedule fw-bold" role="button" 
                                    style="height: 100%; width: 100%; font-size: 13px"
                                       data-bs-custom-class="custom-popover" 
                                       data-bs-html="true"
                                       data-bs-toggle="popover" data-bs-trigger="focus"
                                       data-bs-title="` + movieName + `"
                                       data-bs-content="<div class='container-img-small'>
                                           <img src='` + imgSrc + `' class=''  alt='...' >
                                        </div> <div class='d-flex justify-content-center' style='background-color: red'>
                                <a href='#' class='btn-dark btn text-decoration-none'>Delete</a> </div> ">` + timeChosen + `</a>
                                </div>
                            </div>
    `;
    divideLayoutSchedule(timeStart, movieLong, scaleNum, html);
    popOver();
}

function openModal() {
    $('.open-modal-add-schedule').on('click', function () {
        status = 'save';
        roomId = $(this).parent().parent().data('room-id')
        var myModal = $('#modalChooseMovie');
        roomName = $(this).parent().parent().find('.room-name').text()
        myModal.modal('show');
    });
}

function divideLayoutSchedule(timeStart, movieLong, scaleNum, html) {
    let areaValueMin;
    let areaValueMax;
    let roomIdToFind = roomId; // Đặt giá trị room id bạn muốn tìm
    console.log(roomIdToFind)

    let schedule = $('.schedule[data-room-id="' + roomIdToFind + '"]')

    let emptySchedule = $(schedule).find('.empty-schedule').filter(function () {
            areaValueMin = parseInt($(this).attr('aria-valuemin'));
            areaValueMax = parseInt($(this).attr('aria-valuemax'));
            console.log(timeStart + scaleNum * 14.4);
            console.log();
            return ((scaleNum * 14.4) <= (areaValueMax - areaValueMin)) && (timeStart >= areaValueMin) && (timeStart + (scaleNum * 14.4) <= areaValueMax);
        }
    )
    areaValueMin = parseInt($(emptySchedule).attr('aria-valuemin'));
    areaValueMax = parseInt($(emptySchedule).attr('aria-valuemax'));

    if (emptySchedule.length === 0 || emptySchedule.length > 1) {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong!",
        });
    } else {
        let areaValueMax = emptySchedule.attr('aria-valuemax');

        let emptySchedule1 = emptySchedule.clone();
        let emptySchedule2 = emptySchedule.clone();

        let areaValueMin1 = $(emptySchedule1).attr('aria-valuemin', areaValueMin)
        let areaValueMax1 = $(emptySchedule1).attr('aria-valuemax', timeStart)

        let o = parseInt(timeStart) + parseInt(movieLong);
        if (o > 1440) {
            o = 1440
        }
        let areaValueMin2 = $(emptySchedule2).attr('aria-valuemin', o)
        let areaValueMax2 = $(emptySchedule2).attr('aria-valuemax', areaValueMax)

        let width1 = (areaValueMax1.attr('aria-valuemax') - areaValueMin1.attr('aria-valuemin')) / 14.4 + '%';
        let width2 = (areaValueMax2.attr('aria-valuemax') - areaValueMin2.attr('aria-valuemin')) / 14.4 + '%';

        $(emptySchedule).after(emptySchedule2).after(html).after(emptySchedule1)
        $(emptySchedule1).width(width1)
        $(emptySchedule2).width(width2)
        $(emptySchedule).remove();

        if (status === 'save') {
            saveMovieScheduleRoom()
            Swal.fire({
                icon: "success",
                title: "Saved schedule to " + roomName + " success!",
                showConfirmButton: false,
                timer: 1500
            });
        }
    }
}

function saveMovieScheduleRoom() {
    let movieScheduleRoomDTO = {
        movieId: movieChosenId,
        movieNameEnglish: movieChosenName,
        movieSmallImage: imgSrc,
        movieDuration: movieChosenLong,
        cinemaRoomId: roomId,
        cinemaRoomName: roomName,
        scheduleId: 0,
        scheduleTime: currentDate + 'T' + movieTimeChosen + ':00',
    }


    $.ajax({
        url: '/admin/schedule-management/add-new-movie-schedule-room',
        type: 'POST',
        contentType: 'application/json',
        dataType: "json",
        data: JSON.stringify(movieScheduleRoomDTO),
        beforeSend: function () {
            lsdRing.removeClass('d-none');
        },
        success: function (response) {
            console.log(response.message)
        }, error: function (xhr, status, error) {
            console.log('Error:', error);
        }, complete: function (xhr, status) {
            lsdRing.addClass('d-none');
        }
    });

    console.log(movieScheduleRoomDTO)
}

function parseDateDMYToYMD(ngayString) {
    var parts = ngayString.split("-");
    var ngay = parts[0];
    var thang = parts[1];
    var nam = parts[2];

// Tạo đối tượng Date mới với định dạng mới 'yyyy-MM-dd'
    var dateObject = new Date(nam, thang - 1, ngay); // Lưu ý: Tháng trong JavaScript bắt đầu từ 0

// Lấy ngày, tháng và năm từ đối tượng Date
    var ngayMoi = dateObject.getDate();
    var thangMoi = dateObject.getMonth() + 1; // Bổ sung 1 vì tháng bắt đầu từ 0
    var namMoi = dateObject.getFullYear();

// Tạo chuỗi mới trong định dạng 'yyyy-MM-dd'
    return namMoi + "-" + (thangMoi < 10 ? '0' : '') + thangMoi + "-" + (ngayMoi < 10 ? '0' : '') + ngayMoi;
}

function convertTimeStringToMinutes(timeString) {
    // Tách giờ và phút từ chuỗi thời gian
    var parts = timeString.split(':');
    var hours = parseInt(parts[0], 10);
    var minutes = parseInt(parts[1], 10);

    // Chuyển đổi thành tổng số phút
    return hours * 60 + minutes;
}