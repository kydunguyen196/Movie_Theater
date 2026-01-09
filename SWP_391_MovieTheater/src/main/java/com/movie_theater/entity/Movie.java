package com.movie_theater.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.FutureOrPresent;
import lombok.*;
import org.hibernate.annotations.Check;
import org.hibernate.annotations.Checks;
import org.hibernate.annotations.Nationalized;

import java.time.LocalDate;
import java.util.List;

@Entity
@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Table(name = "MOVIE", schema = "MOVIETHEATER")
@Checks(@Check(constraints = "FROM_DATE < TO_DATE"))
public class Movie {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "MOVIE_ID")
    private Integer movieId;

    @Nationalized
    @Column(name = "ACTOR", nullable = false)
    private String actor;

    @Nationalized
    @Column(name = "CONTENT", nullable = false, length = 2000)
    private String content;

    @Nationalized
    @Column(name = "DIRECTOR", nullable = false)
    private String director;

    @Column(name = "DURATION", nullable = false)
    private Integer duration;

    @FutureOrPresent
    @Column(name = "FROM_DATE", nullable = false)
    private LocalDate fromDate;

    @Nationalized
    @Column(name = "MOVIE_PRODUCTION_COMPANY", nullable = false)
    private String movieProductionCompany;

    @Column(name = "TO_DATE", nullable = false)
    private LocalDate toDate;

    @Nationalized
    @Column(name = "MOVIE_NAME_ENGLISH", nullable = false)
    private String movieNameEnglish;

    @Nationalized
    @Column(name = "MOVIE_NAME_VN", nullable = false)
    private String movieNameVietnamese;

    @Nationalized
    @Column(name = "LARGE_IMAGE", nullable = false)
    private String largeImage;

    @Nationalized
    @Column(name = "SMALL_IMAGE", nullable = false)
    private String smallImage;

    @Column(name = "DELETED", nullable = false)
    private Boolean deleted;

    @JsonManagedReference
    @ToString.Exclude
    @OneToMany(mappedBy = "movie", fetch = FetchType.LAZY)
    private List<MovieSchedule> movieSchedules;

    @JsonManagedReference
    @ToString.Exclude
    @OneToMany(mappedBy = "movie", fetch = FetchType.LAZY)
    private List<TypeMovie> typeMovies;

    @JsonBackReference
    @ToString.Exclude
    @ManyToOne(optional = true, fetch = FetchType.LAZY)
    @JoinColumn(name = "PROMOTION_ID")
    private Promotion promotion;
}