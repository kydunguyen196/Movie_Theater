package com.movie_theater.repository;

import com.movie_theater.entity.Promotion;
import com.movie_theater.entity.Schedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.NoRepositoryBean;

import java.time.LocalDateTime;
import java.util.Optional;

public interface ScheduleRepository extends JpaRepository<Schedule, Integer> {
    Optional<Schedule> getSchedulesByScheduleTime(LocalDateTime scheduleTime);

}
