package com.movie_theater;

import com.movie_theater.dto.BookingListDTO;
import com.movie_theater.dto.InvoiceItemDTO;
import com.movie_theater.entity.Account;
import com.movie_theater.entity.Invoice;
import com.movie_theater.entity.Schedule;
import com.movie_theater.repository.AccountRepository;
import com.movie_theater.repository.InvoiceItemRepository;
import com.movie_theater.repository.InvoiceRepository;
import com.movie_theater.repository.ScheduleSeatRepository;
import com.movie_theater.service.ScheduleService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@SpringBootTest
class MovieTheaterApplicationTests {

    @Autowired
    AccountRepository accountRepository;
    @Autowired
    InvoiceRepository invoiceRepository;
    @Autowired
    InvoiceItemRepository invoiceItemRepository;
    @Autowired
    ScheduleSeatRepository scheduleSeatRepository;
    @Autowired
    ScheduleService scheduleService;

    @Test
    @Transactional
    void contextLoads() {
        System.out.println(scheduleService.getScheduleByTime(scheduleService.getOne(4).get().getScheduleTime()));

        Schedule schedule = scheduleService.save(Schedule.builder()
                .scheduleTime(LocalDateTime.now())
                .deleted(false)
                .build());
        System.out.println(schedule.getScheduleId());
    }

    private String generateAlphabetCharacter(int i) {
        StringBuilder result = new StringBuilder();
        while (i >= 0) {
            result.insert(0, (char)('A' + i % 26));
            i = i / 26 - 1;
        }
        return result.toString();
    }
}