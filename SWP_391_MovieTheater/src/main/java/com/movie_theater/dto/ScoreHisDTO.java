package com.movie_theater.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ScoreHisDTO {
    private LocalDateTime bookingDate;
    private Integer addScore;
    private Integer usedScore;
    private Integer invoiceId;


}
