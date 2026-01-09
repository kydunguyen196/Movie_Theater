package com.movie_theater.repository;

import com.movie_theater.entity.ScheduleSeatHis;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ScheduleSeatHisRepository extends JpaRepository<ScheduleSeatHis,Integer> {
}
