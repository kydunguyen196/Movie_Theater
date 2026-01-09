package com.movie_theater.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Table(name = "EMPLOYEE", schema = "MOVIETHEATER")
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "EMPLOYEE_ID")
    private Integer employeeId;

    @OneToOne(optional = false,
    fetch = FetchType.LAZY)
    @JoinColumn(name = "ACCOUNT_ID", foreignKey = @ForeignKey(name = "FK_EMPLOYEE_ACCOUNT"))
    private Account account;

    @Column(name = "DELETED", nullable = false)
    private Boolean deleted;
}
