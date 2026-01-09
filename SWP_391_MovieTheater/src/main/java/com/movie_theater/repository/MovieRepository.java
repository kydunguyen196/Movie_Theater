package com.movie_theater.repository;

import com.movie_theater.entity.Account;
import com.movie_theater.entity.CinemaRoom;
import com.movie_theater.entity.Invoice;
import com.movie_theater.entity.Movie;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.NoRepositoryBean;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface MovieRepository extends JpaRepository<Movie, Integer> {
    @Override
    @Modifying
    @Query("SELECT m FROM Movie m WHERE m.deleted = false")
    List<Movie> findAll();

    @Query("SELECT m FROM Movie m WHERE " +
            "(LOWER(m.movieNameEnglish) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "OR LOWER(m.movieNameVietnamese) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
            "AND m.deleted = false")
    Page<Movie> findByKeywordAndNotDeleted(String keyword, Pageable pageable);
    @Override
    @Query("SELECT m FROM Movie m WHERE m.movieId = :id AND m.deleted = false")
    Optional<Movie> findById(@Param("id") Integer id);

    Page<Movie> getMovieByDeletedIsFalse(Pageable pageable);


}
