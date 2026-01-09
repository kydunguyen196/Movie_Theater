package com.movie_theater.dto;

import lombok.*;

import java.time.LocalDateTime;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class BookingListDTO {
    private Integer invoiceId;
    private Integer memberId;
    private String fullName;
    private String identityCard;
    private String phoneNumber;
    private String movieNameVn;
    private LocalDateTime scheduleTime; // Changed from String to LocalDateTime
    private String seat; // Kept as Integer if that's correct
    private String status; // Added this field as it was mentioned in the error message
    private Integer invoiceItemId;
}
