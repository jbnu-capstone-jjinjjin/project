package com.jbnu.capstone.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import lombok.*;

import java.util.UUID;

@Getter
@Setter
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Machine {
    @Id
    @GeneratedValue
    private Long id;

    private String machineName;

    @Column(nullable = false, unique = true)
    private UUID uuid;
}
