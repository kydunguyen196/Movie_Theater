package com.movie_theater.service;

import com.movie_theater.dto.MovieScheduleRoomDTO;
import com.movie_theater.entity.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface ScheduleSeatService {

    List<ScheduleSeat> getAll();

    Optional<ScheduleSeat> getOne(Integer id);

    ScheduleSeat save(ScheduleSeat scheduleSeat);

    CinemaRoom getCinemaRoom(ScheduleSeat scheduleSeat);

    MovieSchedule getMovieSchedule(ScheduleSeat scheduleSeat);

    List<MovieScheduleRoomDTO> getAllMovieScheduleRoomDTO();

    public List<MovieScheduleRoomDTO> getAllMovieScheduleRoomDTOByRoomIdAndDay(Integer roomId, LocalDate day);

    List<ScheduleSeat> getScheduleSeatByMovieSchedule(MovieSchedule movieSchedule);
}
