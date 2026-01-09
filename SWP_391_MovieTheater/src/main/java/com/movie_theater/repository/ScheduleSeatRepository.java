package com.movie_theater.repository;

import com.movie_theater.dto.MovieScheduleRoomDTO;
import com.movie_theater.entity.MovieSchedule;
import com.movie_theater.entity.Promotion;
import com.movie_theater.entity.ScheduleSeat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.NoRepositoryBean;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface ScheduleSeatRepository extends JpaRepository<ScheduleSeat, Integer> {

    @Transactional
    @Query("SELECT new com.movie_theater.dto.MovieScheduleRoomDTO (" +
            "m.movieId" +
            ", m.movieNameEnglish" +
            ", m.smallImage" +
            ", m.duration" +
            ", cr.cinemaRoomId" +
            ", cr.cinemaRoomName" +
            ", sh.scheduleId" +
            ", sh.scheduleTime) " +
            "FROM Schedule sh " +
            "JOIN sh.movieSchedules ms " +
            "JOIN ms.movie m " +
            "JOIN ms.scheduleSeats ss " +
            "JOIN ss.seat s " +
            "JOIN s.cinemaRoom cr " +
            "WHERE m.deleted = false " +
            "GROUP BY m.movieId, m.movieNameEnglish, m.smallImage, m.duration, cr.cinemaRoomId, cr.cinemaRoomName, sh.scheduleId, sh.scheduleTime, m.deleted")
    public List<MovieScheduleRoomDTO> getAllMovieScheduleRoom();


    @Modifying
    @Transactional
    @Query("UPDATE CinemaRoom c SET c.seatQuantity = :seatQuantity where c.cinemaRoomId = :cinemaRoomId")
    int updateSeatQuantity(@Param("seatQuantity") int seatQuantity, @Param("cinemaRoomId") int cinemaRoomId);

    @Modifying
    @Transactional
    @Query("UPDATE CinemaRoom c SET c.deleted = :deleted where c.cinemaRoomId = :cinemaRoomId")
    int updateDeleted(@Param("deleted") boolean deleted, @Param("cinemaRoomId") int cinemaRoomId);

    List<ScheduleSeat> getByMovieSchedule(MovieSchedule movieSchedule);
}
