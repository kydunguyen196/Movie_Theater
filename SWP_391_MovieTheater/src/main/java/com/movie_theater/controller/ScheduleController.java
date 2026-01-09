package com.movie_theater.controller;

import com.movie_theater.dto.MovieScheduleRoomDTO;
import com.movie_theater.dto.ResponseDTO;
import com.movie_theater.dto.ScheduleDTO;
import com.movie_theater.entity.*;
import com.movie_theater.entity.key.KeyMovieSchedule;
import com.movie_theater.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Controller
public class ScheduleController {
    private MovieService movieService;
    private ScheduleService scheduleService;
    private MovieScheduleService movieScheduleService;
    private ScheduleSeatService scheduleSeatService;
    private CinemaRoomService cinemaRoomService;
    private SeatService seatService;

    @Autowired
    public ScheduleController(MovieService movieService
            , ScheduleService scheduleService
            , MovieScheduleService movieScheduleService
            , ScheduleSeatService scheduleSeatService
            , CinemaRoomService cinemaRoomService
            , SeatService seatService) {
        this.movieService = movieService;
        this.scheduleService = scheduleService;
        this.movieScheduleService = movieScheduleService;
        this.scheduleSeatService = scheduleSeatService;
        this.cinemaRoomService = cinemaRoomService;
        this.seatService = seatService;
    }

    @GetMapping("/get-all-schedule")
    private ResponseEntity<ResponseDTO> getAllSchedule() {
        ResponseDTO responseDTO = new ResponseDTO();
        List<ScheduleDTO> scheduleDTOS = new ArrayList<>();
        for (Schedule schedule : scheduleService.getAll()) {
            scheduleDTOS.add(scheduleService.parseScheduleToDto(schedule));
        }
        responseDTO.setData(scheduleDTOS);
        responseDTO.setMessage("Get all schedule successful");
        return ResponseEntity.ok().body(responseDTO);
    }

    @GetMapping("/get-schedule-by-id")
    private ResponseEntity<ResponseDTO> getScheduleById(@RequestParam Integer id) {
        ResponseDTO responseDTO = new ResponseDTO();
        Optional<Schedule> schedule = scheduleService.getOne(id);
        if (schedule.isPresent()) {
            responseDTO.setData(scheduleService.parseScheduleToDto(schedule.get()));
            responseDTO.setMessage("Get schedule by id successful");
        } else {
            responseDTO.setMessage("Schedule not found");
        }
        return ResponseEntity.ok().body(responseDTO);
    }

//    @GetMapping("/get-schedule-by-movie")
//    private ResponseEntity<ResponseDTO> getScheduleByMovie(@RequestParam Integer id) {
//        ResponseDTO responseDTO = new ResponseDTO();
//        Optional<Movie> schedule = movieService.getById(id);
//        if (schedule.isPresent()) {
//            responseDTO.setData(scheduleService.parseScheduleToDto(schedule.get()));
//            responseDTO.setMessage("Get schedule by id successful");
//        } else {
//            responseDTO.setMessage("Schedule not found");
//        }
//        return ResponseEntity.ok().body(responseDTO);
//    }

    @GetMapping("/get-movie-schedule-room-by-room-id-and-day")
    private ResponseEntity<ResponseDTO> getScheduleByDayAndRoomId(@RequestParam String roomId, @RequestParam String day) {
        ResponseDTO responseDTO = new ResponseDTO();

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        List<MovieScheduleRoomDTO> movieScheduleRoomDTOS = scheduleSeatService
                .getAllMovieScheduleRoomDTOByRoomIdAndDay(Integer.parseInt(roomId), LocalDate.parse(day, formatter));
        responseDTO.setData(movieScheduleRoomDTOS);
        responseDTO.setMessage("Get list success");
        return ResponseEntity.ok().body(responseDTO);
    }

    @PostMapping("/admin/schedule-management/add-new-movie-schedule-room")
    private ResponseEntity<ResponseDTO> addNewMovieScheduleRoom(@RequestBody MovieScheduleRoomDTO movieScheduleRoomDTO) {
        Optional<Movie> movieOptional = movieService.getById(movieScheduleRoomDTO.getMovieId());
        Optional<Schedule> scheduleOptional = scheduleService.getScheduleByTime(movieScheduleRoomDTO.getScheduleTime());

        Schedule schedule;
        Movie movie;

        if (scheduleOptional.isPresent()) {
            schedule = scheduleOptional.get();
        } else {
            schedule = scheduleService.save(Schedule.builder()
                    .scheduleTime(movieScheduleRoomDTO.getScheduleTime())
                    .deleted(false)
                    .movieSchedules(new ArrayList<>())
                    .build());
        }

        movie = movieOptional.orElseThrow(() -> new RuntimeException("Movie not found"));

        MovieSchedule movieSchedule = MovieSchedule.builder()
                .keyMovieSchedule(new KeyMovieSchedule(movie.getMovieId(), schedule.getScheduleId()))
                .deleted(false)
                .scheduleSeats(new ArrayList<>())
                .movie(movie)
                .schedule(schedule)
                .build();

        movieScheduleService.save(movieSchedule);
        schedule.getMovieSchedules().add(movieSchedule);
        movie.getMovieSchedules().add(movieSchedule);

        Optional<CinemaRoom> cinemaRoomOptional = cinemaRoomService.getCinemaRoomByCinemaRoomIdAndDeletedIsFalse(movieScheduleRoomDTO.getCinemaRoomId());

        if (cinemaRoomOptional.isPresent()) {
            List<Seat> seatList = cinemaRoomOptional.get().getSeats();

            for (Seat seat : seatList) {
                ScheduleSeat scheduleSeat = ScheduleSeat.builder()
                        .seat(seat)
                        .movieSchedule(movieSchedule)
                        .deleted(false)
                        .price(100000.0)
                        .build();
                scheduleSeatService.save(scheduleSeat);
                movieSchedule.getScheduleSeats().add(scheduleSeat);
            }

            return ResponseEntity.ok().body(ResponseDTO.builder().message("Success").build());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ResponseDTO.builder().message("Cinema Room not found").build());
        }
    }


//    private ResponseEntity<ResponseDTO> addNewMovieScheduleRoom(@RequestBody MovieScheduleRoomDTO movieScheduleRoomDTO) {
//
//        Optional<Movie> movieOptional = movieService.getById(movieScheduleRoomDTO.getMovieId());
//        Optional<Schedule> scheduleOptional = scheduleService.getScheduleByTime(movieScheduleRoomDTO.getScheduleTime());
//        Schedule schedule;
//        Movie movie;
//
//        if (scheduleOptional.isPresent()) {
//            schedule = scheduleOptional.get();
//        } else {
//            schedule = scheduleService.save(Schedule.builder()
//                    .scheduleTime(movieScheduleRoomDTO.getScheduleTime())
//                    .deleted(false)
//                    .movieSchedules(new ArrayList<>())
//                    .build());
//        }
//
//        movie = movieOptional.get();
//
//        MovieSchedule movieSchedule = MovieSchedule.builder()
//                .keyMovieSchedule(new KeyMovieSchedule(movie.getMovieId(), schedule.getScheduleId()))
//                .deleted(false)
//                .scheduleSeats(new ArrayList<>())
//                .movie(movie)
//                .schedule(schedule)
//                .build();
//
//        movieScheduleService.save(movieSchedule);
//        schedule.getMovieSchedules().add(movieSchedule);
//        movie.getMovieSchedules().add(movieSchedule);
//
//        Optional<CinemaRoom> cinemaRoomOptional = cinemaRoomService.getCinemaRoomByCinemaRoomIdAndDeletedIsFalse(movieScheduleRoomDTO.getCinemaRoomId());
//
//        List<Seat> seatList = cinemaRoomOptional.get().getSeats();
//
//        for (Seat seat : seatList) {
//            ScheduleSeat scheduleSeat = ScheduleSeat.builder()
//                    .seat(seat)
//                    .movieSchedule(movieSchedule)
//                    .deleted(false)
//                    .price(100000.0)
//                    .build();
//            scheduleSeatService.save(scheduleSeat);
//            movieSchedule.getScheduleSeats().add(scheduleSeat);
//        }
//
//        return ResponseEntity.ok().body(ResponseDTO.builder().message("Success").build());
//    }

}
