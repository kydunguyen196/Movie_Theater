package com.movie_theater.repository;

import com.movie_theater.entity.Account;
import com.movie_theater.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.NoRepositoryBean;

public interface MemberRepository extends JpaRepository<Member, Integer> {
    
}
