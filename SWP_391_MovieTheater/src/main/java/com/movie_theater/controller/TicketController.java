package com.movie_theater.controller;

import com.movie_theater.dto.BookingListDTO;
import com.movie_theater.dto.InvoiceItemDTO;
import com.movie_theater.dto.ResponseDTO;
import com.movie_theater.entity.Account;
import com.movie_theater.security.CustomAccount;
import com.movie_theater.service.AccountService;
import com.movie_theater.service.InvoiceItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;

@RestController
public class TicketController {

    InvoiceItemService invoiceItemService;

    AccountService accountService;
    @Autowired
    public TicketController(InvoiceItemService invoiceItemService, AccountService accountService) {
        this.invoiceItemService = invoiceItemService;
        this.accountService = accountService;
    }

    @GetMapping("/get-booked-ticket")
    public ResponseEntity<ResponseDTO> getBookedTicket(@RequestParam Integer pageNumber,
                                                       @RequestParam Integer pageSize,
                                                       @RequestParam String searchByMovieName,
                                                       Authentication authentication) {

        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ResponseDTO.builder().message("Login Before").build());
        }
        Account account = accountService.getByUsername(((CustomAccount) authentication.getPrincipal()).getUsername());

        Pageable pageable = PageRequest.of(pageNumber, pageSize);

        Page<InvoiceItemDTO> invoicePage = invoiceItemService.findInvoiceItemByAccount(account, searchByMovieName, pageable);

        List<InvoiceItemDTO> lstBookedTicketDTO = invoicePage.getContent();

        HashMap<String, Object> mapBookedTicketDTO = new HashMap<>();
        mapBookedTicketDTO.put("lstBookedTicket", lstBookedTicketDTO);
        mapBookedTicketDTO.put("pageNumber", invoicePage.getNumber());
        mapBookedTicketDTO.put("pageSize", invoicePage.getSize());
        mapBookedTicketDTO.put("totalPage", invoicePage.getTotalPages());

        return ResponseEntity.ok().body(ResponseDTO.builder().data(mapBookedTicketDTO).build());
    }

    @GetMapping("/get-booking-ticket")
    public ResponseEntity<ResponseDTO> getBookingList(Authentication authentication,
                                                      @RequestParam Integer pageNumber,
                                                      @RequestParam Integer pageSize,
                                                      @RequestParam String searchByInvoiceId) {

        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ResponseDTO.builder().message("Login Before").build());
        }

        Pageable pageable = PageRequest.of(pageNumber,pageSize);

        Page<BookingListDTO> bl = invoiceItemService.findInvoiceById(searchByInvoiceId, pageable);

        List<BookingListDTO> lstBookingListDTO = bl.getContent();

        HashMap<String, Object> mapBookListDTo = new HashMap<>();
        mapBookListDTo.put("lstBookingTicket", lstBookingListDTO);
        mapBookListDTo.put("pageNumber", bl.getNumber());
        mapBookListDTo.put("pageSize", bl.getSize());
        mapBookListDTo.put("totalPage", bl.getTotalPages());

        return ResponseEntity.ok().body(ResponseDTO.builder().data(mapBookListDTo).build());
    }

    @PostMapping("/update-status")
    public ResponseEntity<String> updateInvoiceStatusByInvoiceItemId(@RequestParam("invoiceItemId") Integer invoiceItemId,
                                                                @RequestParam("status") String status) {
        try {
            int updateResult = invoiceItemService.updateInvoiceStatusByInvoiceItemId(invoiceItemId, status);
            return ResponseEntity.ok().body("Update result: " + updateResult);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error updating status: " + e.getMessage());
        }
    }

}