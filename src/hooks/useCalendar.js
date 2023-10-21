import {
  GET_CALENDAR,
  GET_DELIVERIES,
  GET_ORDERS,
  GET_ORDER_SHIPMENTS,
} from "../utils/apollo/apolloQueries";
import { useMutation, useQuery } from "@apollo/client";
import { ADD_CALENDAR, DELETE_CALENDAR } from "../utils/apollo/apolloMutations";
import { useState } from "react";
import { useEffect } from "react";

export function useCalendar() {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  const {
    data: calendar,
    refetch: refetchCalendar,
    loading: loadingCalendar,
  } = useQuery(GET_CALENDAR, {
    onError: (error) => setError(error),
    onCompleted: () => setError(false),
  });
  const {
    data: orders,
    refetch: refetchOrders,
    loading: loadingOrders,
  } = useQuery(GET_ORDERS, {
    onError: (error) => setError(error),
    onCompleted: () => setError(false),
  });
  const {
    data: deliveries,
    refetch: refetchDeliveries,
    loading: loadingDeliveries,
  } = useQuery(GET_DELIVERIES, {
    onError: (error) => setError(error),
    onCompleted: () => setError(false),
  });
  const {
    data: shipments,
    refetch: refetchShipments,
    loading: loadingShipments,
  } = useQuery(GET_ORDER_SHIPMENTS, {
    onError: (error) => setError(error),
    onCompleted: () => setError(false),
  });

  const [addEvent] = useMutation(ADD_CALENDAR, {
    onError: (error) => setError(error),
    onCompleted: () => setError(false),
  });
  const [deleteEvent] = useMutation(DELETE_CALENDAR, {
    onError: (error) => setError(error),
    onCompleted: () => setError(false),
  });

  useEffect(() => {
    if (
      loadingCalendar ||
      loadingOrders ||
      loadingDeliveries ||
      loadingShipments
    ) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [loadingCalendar, loadingOrders, loadingDeliveries, loadingShipments]);

  useEffect(() => {
    if (calendar && orders && deliveries && shipments) {
      const mergedData = {
        calendar: calendar.calendar,
        orders: orders.orders,
        deliveries: deliveries.deliveries,
        shipments: shipments.orderShipments,
      };
      setData(mergedData);
    } else {
      setData(null);
    }
  }, [calendar, orders, deliveries, shipments]);

  const refetchAll = () => {
    refetchCalendar();
    refetchOrders();
    refetchDeliveries();
    refetchShipments();
  };

  return {
    error,
    loading,
    data,
    addEvent,
    deleteEvent,
    refetch: refetchAll,
  };
}
