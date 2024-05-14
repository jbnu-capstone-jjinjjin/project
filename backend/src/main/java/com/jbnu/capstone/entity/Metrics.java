package com.jbnu.capstone.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;
import java.util.Map;

@Getter
@Setter
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Metrics {
    @Id
    @GeneratedValue
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "machine_id")
    private Machine machine;

    private LocalDateTime createdAt;

    @Enumerated(EnumType.STRING)
    private MetricsType metricType;

    @JdbcTypeCode(SqlTypes.JSON)
    private Map<String, Object> data;
}
