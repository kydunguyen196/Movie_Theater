package com.movie_theater.dto;

import com.movie_theater.entity.MovieSchedule;
import com.movie_theater.entity.Promotion;
import com.movie_theater.entity.TypeMovie;
import jakarta.persistence.*;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.hibernate.annotations.Nationalized;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class MovieDTO {

    private Integer movieId;

    @NotNull(message = "Actor is required")
    private String actor;

    @NotNull(message = "Content is required")
    private String content;

    @NotNull(message = "Director is required")
    private String director;

    @Min(0)
    @NotNull(message = "Duration is required")
    private Integer duration;

    @FutureOrPresent
    @NotNull(message = "From date is required")
    private LocalDate fromDate;

    @NotNull(message = "Production is required")
    private String movieProductionCompany;

    @NotNull(message = "To date is required")
    private LocalDate toDate;

    @NotNull(message = "Movie English name is required")
    private String movieNameEnglish;

    @NotNull(message = "Movie Vietnamese mame is required")
    private String movieNameVietnamese;

    @NotNull(message = "Large image is required")
    private String largeImage;

    @NotNull(message = "Large image is required")
    private String smallImage;

    private Boolean deleted;

    @NotNull(message = "Movie Schedule is required")
    private List<LocalDateTime> movieSchedules;

    @NotNull(message = "Type movie is required")
    private List<Integer> typeMovies;

    private Integer promotion;
}
