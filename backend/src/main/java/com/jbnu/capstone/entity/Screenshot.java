package com.jbnu.capstone.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;


@Entity
@Builder
@Getter @Setter
@AllArgsConstructor
@NoArgsConstructor
public class Screenshot {

    @Id
    @GeneratedValue
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "machine_id")
    private Machine machine;

    private String imageName;

    @Lob
    private byte[] imageData;

    private LocalDateTime createdAt;
}
