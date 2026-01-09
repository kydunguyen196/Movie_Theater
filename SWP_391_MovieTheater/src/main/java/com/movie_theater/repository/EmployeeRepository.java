package com.movie_theater.repository;

import com.movie_theater.entity.Account;
import com.movie_theater.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.NoRepositoryBean;

public interface EmployeeRepository extends JpaRepository<Employee, Integer> {
    
}
