package com.movie_theater.dto;

import lombok.*;

import java.time.LocalDateTime;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
public class MovieScheduleRoomDTO {
    private Integer movieId;
    private String movieNameEnglish;
    private String movieSmallImage;
    private Integer movieDuration;
    private Integer cinemaRoomId;
    private String cinemaRoomName;
    private Integer scheduleId;
    private LocalDateTime scheduleTime;
}
