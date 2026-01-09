package com.movie_theater.service;

import com.movie_theater.dto.BookingListDTO;
import com.movie_theater.dto.InvoiceItemDTO;
import com.movie_theater.entity.Account;
import com.movie_theater.entity.InvoiceItem;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface InvoiceItemService {
    List<InvoiceItemDTO> findInvoiceItemByAccountAndInvoiceId(Account account, Integer invoiceId);

    Page<InvoiceItemDTO> findInvoiceItemByAccount(Account account, String movieName, Pageable pageable);

    Page<BookingListDTO> findInvoiceById(String id, Pageable pageable);

    InvoiceItem save(InvoiceItem invoiceItem);
    int updateInvoiceStatusByInvoiceItemId(int invoiceItemId, String status);
}