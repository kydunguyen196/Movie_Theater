package com.movie_theater.repository;

import com.movie_theater.entity.Movie;
import com.movie_theater.entity.MovieSchedule;
import com.movie_theater.entity.Schedule;
import com.movie_theater.entity.key.KeyMovieSchedule;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MovieScheduleRepository extends JpaRepository<MovieSchedule, KeyMovieSchedule> {
    List<MovieSchedule> getMovieScheduleByMovie(Movie movie);

    MovieSchedule getByMovieAndAndSchedule(Movie movie, Schedule schedule);
}
