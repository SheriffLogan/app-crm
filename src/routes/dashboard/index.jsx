import React from "react";

import { useCustom } from "@refinedev/core";

import { Col, Row } from "antd";

import { CalendarUpcomingEvents } from "@/components";

import {
  CompaniesMap,
  DashboardDealsChart,
  DashboardLatestActivities,
  DashboardTasksChart,
  DashboardTotalCountCard,
  DashboardTotalRevenueChart,
} from "./components";
import { DASHBOARD_TOTAL_COUNTS_QUERY } from "./queries";

export const DashboardPage = () => {
  const { data, isLoading } = useCustom({
    url: "",
    method: "get",
    meta: { gqlQuery: DASHBOARD_TOTAL_COUNTS_QUERY },
  });

  // Check if data exists and is structured correctly
  const companiesCount = data?.data?.companies?.totalCount ?? 0;
  const contactsCount = data?.data?.contacts?.totalCount ?? 0;
  const dealsCount = data?.data?.deals?.totalCount ?? 0;

  return (
    <div className="page-container">
      <Row gutter={[32, 32]}>
        <Col xs={24} sm={24} xl={8}>
          <DashboardTotalCountCard
            resource="companies"
            isLoading={isLoading}
            totalCount={companiesCount}
          />
        </Col>
        <Col xs={24} sm={24} xl={8}>
          <DashboardTotalCountCard
            resource="contacts"
            isLoading={isLoading}
            totalCount={contactsCount}
          />
        </Col>
        <Col xs={24} sm={24} xl={8}>
          <DashboardTotalCountCard
            resource="deals"
            isLoading={isLoading}
            totalCount={dealsCount}
          />
        </Col>
      </Row>

      <Row
        gutter={[32, 32]}
        style={{
          marginTop: "32px",
        }}
      >
        <Col
          xs={24}
          sm={24}
          xl={8}
          style={{
            height: "432px",
          }}
        >
          <DashboardTotalRevenueChart />
        </Col>
        <Col
          xs={24}
          sm={24}
          xl={16}
          style={{
            height: "432px",
          }}
        >
          <DashboardDealsChart />
        </Col>
      </Row>

      <Row
        gutter={[32, 32]}
        style={{
          marginTop: "32px",
        }}
      >
        <Col xs={24} sm={24} xl={14} xxl={16}>
          <DashboardLatestActivities />
        </Col>
        <Col xs={24} sm={24} xl={10} xxl={8}>
          <CalendarUpcomingEvents showGoToListButton />
        </Col>
      </Row>

      <Row
        gutter={[32, 32]}
        style={{
          marginTop: "32px",
        }}
      >
        <Col
          xs={24}
          sm={24}
          xl={8}
          style={{
            height: "448px",
          }}
        >
          <DashboardTasksChart />
        </Col>
        <Col
          xs={24}
          sm={24}
          xl={16}
          style={{
            height: "448px",
          }}
        >
          <CompaniesMap />
        </Col>
      </Row>
    </div>
  );
};
