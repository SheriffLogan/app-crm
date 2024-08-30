import React, { lazy, Suspense, useEffect, useRef, useState } from "react";

import { useList } from "@refinedev/core";

import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { Button, Card, Grid, Radio } from "antd";
import dayjs from "dayjs";

import { Text } from "@/components";

import styles from "./index.module.css";
import { CALENDAR_EVENTS_QUERY } from "./queries";

const FullCalendarWrapper = lazy(() => import("./full-calendar"));

export const Calendar = ({ categoryId, onClickEvent }) => {
  const [calendarView, setCalendarView] = useState("dayGridMonth");
  const calendarRef = useRef(null);
  const [title, setTitle] = useState("");
  const { md } = Grid.useBreakpoint();

  useEffect(() => {
    if (calendarRef.current) {
      setTitle(calendarRef.current.getApi().view.title);
    }
  }, [calendarView]);

  useEffect(() => {
    if (calendarRef.current) {
      calendarRef.current.getApi().changeView(calendarView);
    }
  }, [calendarView]);

  useEffect(() => {
    if (md) {
      setCalendarView("dayGridMonth");
    } else {
      setCalendarView("listMonth");
    }
  }, [md]);

  const { data } = useList({
    pagination: {
      mode: "off",
    },
    filters: [
      {
        field: "category.id",
        operator: "in",
        value: categoryId.length ? categoryId : undefined,
      },
    ],
    meta: {
      gqlQuery: CALENDAR_EVENTS_QUERY,
    },
  });

  const events = (data?.data ?? []).map(
    ({ id, title, startDate, endDate, color }) => ({
      id,
      title,
      start: startDate,
      end: endDate,
      color,
      allDay: dayjs(endDate).utc().diff(dayjs(startDate).utc(), "hours") >= 23,
    }),
  );

  return (
    <Card>
      <div className={styles.calendar_header}>
        <div className={styles.actions}>
          <Button
            onClick={() => {
              if (calendarRef.current) {
                calendarRef.current.getApi().prev();
                setTitle(calendarRef.current.getApi().view.title);
              }
            }}
            shape="circle"
            icon={<LeftOutlined />}
          />
          <Button
            onClick={() => {
              if (calendarRef.current) {
                calendarRef.current.getApi().next();
                setTitle(calendarRef.current.getApi().view.title);
              }
            }}
            shape="circle"
            icon={<RightOutlined />}
          />
          <Text className={styles.title} size="lg">
            {title}
          </Text>
        </div>

        <Radio.Group value={calendarView}>
          {[
            {
              label: "Month",
              desktopView: "dayGridMonth",
              mobileView: "listMonth",
            },
            {
              label: "Week",
              desktopView: "timeGridWeek",
              mobileView: "listWeek",
            },
            {
              label: "Day",
              desktopView: "timeGridDay",
              mobileView: "listDay",
            },
          ].map(({ label, desktopView, mobileView }) => {
            const view = md ? desktopView : mobileView;
            return (
              <Radio.Button
                key={label}
                value={view}
                onClick={() => {
                  setCalendarView(view);
                }}
              >
                {label}
              </Radio.Button>
            );
          })}
          {md && (
            <Radio.Button
              value="listMonth"
              onClick={() => {
                setCalendarView("listMonth");
              }}
            >
              List
            </Radio.Button>
          )}
        </Radio.Group>
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <FullCalendarWrapper
          {...{ calendarRef, events, onClickEvent, setTitle }}
        />
      </Suspense>
    </Card>
  );
};
