package com.zixo.order_service.repo;

import com.zixo.order_service.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepo extends JpaRepository<Order, Long> {
    List<Order> findByUsername(String username);

    @Query("SELECT DISTINCT o FROM Order o JOIN o.items i WHERE i.sellerUsername = :username")
    List<Order> findOrdersBySeller(@Param("username") String username);

}
