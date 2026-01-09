package com.movie_theater.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InvoiceItemDTO {
    private String movieName;
    private Double price;
    private Integer discount;
    private LocalDateTime scheduleTime;
    private String seat;
    private String seatType;
    private LocalDateTime bookingDate;
    private String status;

    public InvoiceItemDTO(String movieName, Double price, Integer discount, LocalDateTime scheduleTime, String seat, String seatType) {
        this.movieName = movieName;
        this.price = price;
        this.discount = discount;
        this.scheduleTime = scheduleTime;
        this.seat = seat;
        this.seatType = seatType;
    }

}
