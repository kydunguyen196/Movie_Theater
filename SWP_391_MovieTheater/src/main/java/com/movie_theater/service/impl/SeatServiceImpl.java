package com.movie_theater.service.impl;

import com.movie_theater.entity.CinemaRoom;
import com.movie_theater.entity.ScheduleSeat;
import com.movie_theater.entity.Seat;
import com.movie_theater.repository.SeatRepository;
import com.movie_theater.service.SeatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class SeatServiceImpl implements SeatService {
    private SeatRepository seatRepository;

    @Autowired
    public SeatServiceImpl(SeatRepository seatRepository) {
        this.seatRepository = seatRepository;
    }

    @Override
    @Transactional
    public Seat save(Seat seat) {
        return seatRepository.save(seat);
    }

    @Override
    public List<Seat> getSeatByCinemaRoom(CinemaRoom cinemaRoom) {
        return seatRepository.getSeatByCinemaRoom(cinemaRoom);
    }

    @Override
    public List<Seat> pagingSeatByDeletedIsFalse(int pageNumber, int pageSize) {
        Pageable pageable = PageRequest.of(pageNumber, pageSize);
        Page<Seat> seats = seatRepository.findByDeletedIsFalse(pageable);
        return seats.getContent();
    }

    @Override
    public List<Seat> getSeatByDeletedIsFalseAndCinemaRoom(CinemaRoom cinemaRoom) {
        return seatRepository.getSeatByDeletedIsFalseAndCinemaRoom(cinemaRoom);
    }

    @Override
    public int updateDeletedBySeatId(boolean deleted, int seatId) {
        return seatRepository.updateDeletedBySeatId(deleted, seatId);
    }

    @Override
    public int updateDeletedBySeatRowAndSeatColumnAndCinemaRoom(boolean deleted, int seatRow, String seatColumn, CinemaRoom cinemaRoom) {
        return seatRepository.updateDeletedBySeatRowAndSeatColumnAndCinemaRoom(deleted, seatRow, seatColumn, cinemaRoom);
    }

    @Override
    public int updateSeatStatus(int seatStatus, int seatId) {
        return seatRepository.updateSeatStatus(seatStatus, seatId);
    }

    @Override
    public int updateSeatType(int seatType, int seatId) {
        return seatRepository.updateSeatType(seatType, seatId);
    }

}
