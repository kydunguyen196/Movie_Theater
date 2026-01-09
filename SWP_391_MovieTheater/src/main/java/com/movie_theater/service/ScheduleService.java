package com.movie_theater.service;

import com.movie_theater.dto.PromotionDTO;
import com.movie_theater.dto.ScheduleDTO;
import com.movie_theater.entity.Promotion;
import com.movie_theater.entity.Schedule;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface ScheduleService {
    List<Schedule> getAll();

    Optional<Schedule> getOne(Integer id);

    Schedule save(Schedule schedule);

    Schedule parseDtoToEntity(ScheduleDTO scheduleDTO);

    ScheduleDTO parseScheduleToDto(Schedule schedule);

    Boolean delete(Integer id);

    Optional<Schedule> getScheduleByTime(LocalDateTime localDateTime);
}
