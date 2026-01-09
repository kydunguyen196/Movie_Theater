package com.movie_theater.repository;

import com.movie_theater.dto.BookingListDTO;
import com.movie_theater.dto.InvoiceItemDTO;
import com.movie_theater.entity.Account;
import com.movie_theater.entity.InvoiceItem;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface InvoiceItemRepository extends JpaRepository<InvoiceItem, Integer> {
    @Query("SELECT new com.movie_theater.dto.InvoiceItemDTO(sch.movieNameEnglish, sch.price, promo.discountLevel, sch.scheduleTime, CONCAT(sch.seatRow, '-', sch.seatColumn), sch.seatType) " +
            "FROM InvoiceItem ii " +
            "JOIN ii.invoice i " +
            "JOIN ii.scheduleSeatHis sch " +
            "LEFT JOIN ii.promotion promo " +
            "WHERE i.account = :account AND i.invoiceId = :invoiceId")
    List<InvoiceItemDTO> findInvoiceItemByAccountAndInvoiceId(Account account, Integer invoiceId);

    @Query("SELECT new com.movie_theater.dto.InvoiceItemDTO(sch.movieNameEnglish, sch.price, promo.discountLevel, sch.scheduleTime, CONCAT(sch.seatRow, '-', sch.seatColumn), sch.seatType,i.bookingDate,i.status) " +
            "FROM InvoiceItem ii " +
            "JOIN ii.invoice i " +
            "JOIN ii.scheduleSeatHis sch " +
            "LEFT JOIN ii.promotion promo " +
            "WHERE i.account = :account AND sch.movieNameEnglish LIKE %:movieName%")
    Page<InvoiceItemDTO> findInvoiceItemByAccountAndMovieName(Account account, String movieName, Pageable pageable);


    @Query("SELECT new com.movie_theater.dto.BookingListDTO(i.invoiceId,m.memberId,a.fullName,a.identityCard,a.phoneNumber,sch.movieNameVn,sch.scheduleTime,CONCAT(sch.seatRow, '-', sch.seatColumn) ,i.status,ii.invoiceItemId ) " +
            "FROM InvoiceItem ii " +
            "JOIN ii.invoice i " +
            "JOIN ii.scheduleSeatHis sch " +
            "JOIN i.account a " +
            "JOIN a.member m " +
            "LEFT JOIN ii.promotion promo " +
            "WHERE CONCAT(i.invoiceId,'') LIKE %:invoiceId%")
    Page<BookingListDTO> findByInvoiceID(String invoiceId, Pageable pageable);
    @Transactional
    @Modifying
    @Query("UPDATE Invoice i SET i.status = :status WHERE i.invoiceId = (SELECT ii.invoice.invoiceId FROM InvoiceItem ii WHERE ii.invoiceItemId = :invoiceItemId)")
    int updateInvoiceStatusByInvoiceItemId(@Param("invoiceItemId") Integer invoiceItemId, @Param("status") String status);


}

