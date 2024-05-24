package com.jbnu.capstone.repository;

import com.jbnu.capstone.entity.Machine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface MachineRepository extends JpaRepository<Machine, Long> {
    Machine findByUuid(UUID uuid);
}
