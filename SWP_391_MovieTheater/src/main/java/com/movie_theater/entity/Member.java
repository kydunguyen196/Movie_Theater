package com.movie_theater.entity;


import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import lombok.*;

@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Table(name = "MEMBER", schema = "MOVIETHEATER")
public class Member {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "MEMBER_ID")
    private Integer memberId;

    @Min(0)
    @Column(name = "SCORE", nullable = false)
    private Integer score;

    @OneToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "ACCOUNT_ID", foreignKey = @ForeignKey(name = "FK_MEMBER_ACCOUNT"))
    private Account account;

    @Column(name = "DELETED", nullable = false)
    private Boolean deleted;
}
