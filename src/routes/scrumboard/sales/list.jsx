import React, { useMemo } from "react";

import {
  useDelete,
  useList,
  useNavigation,
  useUpdate,
  useUpdateMany,
} from "@refinedev/core";

import { ClearOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";

import { Text } from "@/components";
import { currencyNumber } from "@/utilities";

import {
  DealKanbanCardMemo,
  DealKanbanCardSkeleton,
  DealKanbanWonLostDrop,
  KanbanAddCardButton,
  KanbanAddStageButton,
  KanbanBoard,
  KanbanBoardSkeleton,
  KanbanColumn,
  KanbanColumnSkeleton,
  KanbanItem,
} from "../components";
import { SALES_DEAL_STAGES_QUERY, SALES_DEALS_QUERY } from "./queries";

const lastMonth = new Date(new Date().setMonth(new Date().getMonth() - 1));

export const SalesPage = ({ children }) => {
  const { replace, edit, create } = useNavigation();

  const { data: stages, isLoading: isLoadingStages } = useList({
    resource: "dealStages",
    pagination: {
      mode: "off",
    },
    sorters: [
      {
        field: "createdAt",
        order: "asc",
      },
    ],
    meta: {
      gqlQuery: SALES_DEAL_STAGES_QUERY,
    },
  });

  const { data: deals, isLoading: isLoadingDeals } = useList({
    resource: "deals",
    sorters: [
      {
        field: "createdAt",
        order: "asc",
      },
    ],
    filters: [
      {
        field: "createdAt",
        operator: "gte",
        value: lastMonth,
      },
    ],
    queryOptions: {
      enabled: !!stages,
    },
    pagination: {
      mode: "off",
    },
    meta: {
      gqlQuery: SALES_DEALS_QUERY,
    },
  });

  const stageGrouped = useMemo(() => {
    if (!stages?.data || !deals?.data)
      return {
        stageUnassigned: null,
        stageAll: [],
        stageWon: null,
        stageLost: null,
      };
    const stagesData = stages.data;
    const dealsData = deals.data;

    const stageUnassigned = dealsData.filter((deal) => deal.stageId === null);
    const grouped = stagesData.map((stage) => {
      return {
        ...stage,
        deals: dealsData
          .filter((deal) => deal.stageId === stage.id)
          .sort((a, b) => {
            return (
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            );
          }),
      };
    });

    const stageWon = grouped.find((stage) => stage.title === "WON");
    const stageLost = grouped.find((stage) => stage.title === "LOST");
    const stageAll = grouped.filter(
      (stage) => stage.title !== "WON" && stage.title !== "LOST"
    );

    return {
      stageUnassigned,
      stageAll,
      stageWon,
      stageLost,
    };
  }, [stages, deals]);

  const { mutate: updateDeal } = useUpdate({
    resource: "deals",
    successNotification: false,
    mutationMode: "optimistic",
  });
  const { mutate: updateManyDeal } = useUpdateMany({
    resource: "deals",
    successNotification: false,
  });
  const { mutate: deleteStage } = useDelete();

  const { unassignedStageTotalValue } = useMemo(() => {
    let unassignedStageTotalValue = 0;

    if (Array.isArray(stageGrouped?.stageUnassigned)) {
      stageGrouped.stageUnassigned.forEach((deal) => {
        unassignedStageTotalValue += deal.value || 0;
      });
    }

    return {
      unassignedStageTotalValue,
    };
  }, [stageGrouped.stageUnassigned]);

  const handleOnDragEnd = (event) => {
    let stageId = event.over.id || null;
    const dealId = event.active.id;
    const dealStageId = event.active.data.current.stageId;

    if (dealStageId === stageId) {
      return;
    }

    if (stageId === "won") {
      stageId = stageGrouped.stageWon.id;
    }

    if (stageId === "lost") {
      stageId = stageGrouped.stageLost.id;
    }

    if (stageId === "unassigned") {
      stageId = null;
    }

    updateDeal(
      {
        id: dealId,
        values: {
          stageId: stageId,
        },
      },
      {
        onSuccess: () => {
          const stage = event.over.id || null;
          if (stage === "won" || stage === "lost") {
            edit("finalize-deals", dealId, "replace");
          }
        },
      }
    );
  };

  const handleAddStage = () => {
    create("dealStages", "replace");
  };

  const handleEditStage = ({ stageId }) => {
    edit("dealStages", stageId);
  };

  const handleDeleteStage = ({ stageId }) => {
    deleteStage({
      resource: "dealStage",
      id: stageId,
      successNotification: () => ({
        key: "delete-stage",
        type: "success",
        message: "Successfully deleted stage",
        description: "Successful",
      }),
    });
  };

  const handleAddCard = ({ stageId }) => {
    const path =
      stageId === "unassigned"
        ? "create"
        : `create?stageId=${stageId}`;
    replace(path);
  };

  const handleClearCards = ({ dealsIds }) => {
    updateManyDeal({
      ids: dealsIds,
      values: {
        stageId: null,
      },
    });
  };

  const getContextMenuItems = (column) => {
    const hasItems = column.deals.length > 0;

    const items = [
      {
        label: "Edit status",
        key: "1",
        icon: <EditOutlined />,
        onClick: () => handleEditStage({ stageId: column.id }),
      },
      {
        label: "Clear all cards",
        key: "2",
        icon: <ClearOutlined />,
        disabled: !hasItems,
        onClick: () =>
          handleClearCards({
            dealsIds: column.deals.map((deal) => deal.id),
          }),
      },
      {
        danger: true,
        label: "Delete status",
        key: "3",
        icon: <DeleteOutlined />,
        disabled: hasItems,
        onClick: () => handleDeleteStage({ stageId: column.id }),
      },
    ];

    return items;
  };

  const loading = isLoadingStages || isLoadingDeals;

  if (loading) {
    return <PageSkeleton />;
  }

  return (
    <>
      <KanbanBoard onDragEnd={handleOnDragEnd}>
        <KanbanColumn
          id={"unassigned"}
          title={"unassigned"}
          count={stageGrouped.stageUnassigned.length || 0}
          description={
            <Text size="md" disabled={unassignedStageTotalValue === 0}>
              {currencyNumber(unassignedStageTotalValue)}
            </Text>
          }
          onAddClick={() => handleAddCard({ stageId: "unassigned" })}
        >
          {stageGrouped.stageUnassigned.map((deal) => {
            return (
              <KanbanItem
                key={deal.id}
                id={deal.id}
                data={{ ...deal, stageId: "unassigned" }}
              >
                <DealKanbanCardMemo
                  id={deal.id}
                  key={deal.id}
                  title={deal.title}
                  company={{
                    name: deal.company.name,
                    avatarUrl: deal.company.avatarUrl,
                  }}
                  user={{ name: deal.dealOwner.name }}
                  date={deal.createdAt}
                  price={currencyNumber(deal.value || 0)}
                />
              </KanbanItem>
            );
          })}
          {!stageGrouped.stageUnassigned.length && (
            <KanbanAddCardButton
              onClick={() => handleAddCard({ stageId: "unassigned" })}
            />
          )}
        </KanbanColumn>
        {stageGrouped.stageAll.map((column) => {
          const sum = column.dealsAggregate?.[0]?.sum?.value || 0;
          const contextMenuItems = getContextMenuItems(column);

          return (
            <KanbanColumn
              key={column.id}
              id={column.id}
              title={column.title}
              description={
                <Text size="md" disabled={sum === 0}>
                  {currencyNumber(sum)}
                </Text>
              }
              count={column.deals.length}
              contextMenuItems={contextMenuItems}
              onAddClick={() => handleAddCard({ stageId: column.id })}
            >
              {column.deals.map((deal) => {
                return (
                  <KanbanItem
                    key={deal.id}
                    id={deal.id}
                    data={{ ...deal, stageId: column.id }}
                  >
                    <DealKanbanCardMemo
                      id={deal.id}
                      key={deal.id}
                      title={deal.title}
                      company={{
                        name: deal.company.name,
                        avatarUrl: deal.company.avatarUrl,
                      }}
                      user={{
                        name: deal.dealOwner.name,
                        avatarUrl: deal.dealOwner.avatarUrl,
                      }}
                      date={deal.createdAt}
                      price={currencyNumber(deal.value || 0)}
                    />
                  </KanbanItem>
                );
              })}
              {!column.deals.length && (
                <KanbanAddCardButton
                  onClick={() => handleAddCard({ stageId: column.id })}
                />
              )}
            </KanbanColumn>
          );
        })}
        <KanbanAddStageButton onClick={handleAddStage} />
        {stageGrouped.stageWon && (
          <KanbanColumn
            key={stageGrouped.stageWon.id}
            id={stageGrouped.stageWon.id}
            title={stageGrouped.stageWon.title}
            description={
              <Text
                size="md"
                disabled={
                  stageGrouped.stageWon.dealsAggregate?.[0]?.sum?.value === 0
                }
              >
                {currencyNumber(
                  stageGrouped.stageWon.dealsAggregate?.[0]?.sum?.value || 0
                )}
              </Text>
            }
            count={stageGrouped.stageWon.deals.length}
            variant="solid"
          >
            {stageGrouped.stageWon.deals.map((deal) => {
              return (
                <KanbanItem
                  key={deal.id}
                  id={deal.id}
                  data={{
                    ...deal,
                    stageId: stageGrouped.stageWon.id,
                  }}
                >
                  <DealKanbanCardMemo
                    id={deal.id}
                    key={deal.id}
                    title={deal.title}
                    company={{
                      name: deal.company.name,
                      avatarUrl: deal.company.avatarUrl,
                    }}
                    user={{
                      name: deal.dealOwner.name,
                      avatarUrl: deal.dealOwner.avatarUrl,
                    }}
                    date={deal.createdAt}
                    price={currencyNumber(deal.value || 0)}
                    variant="won"
                  />
                </KanbanItem>
              );
            })}
          </KanbanColumn>
        )}
        {stageGrouped.stageLost && (
          <KanbanColumn
            key={stageGrouped.stageLost.id}
            id={stageGrouped.stageLost.id}
            title={stageGrouped.stageLost.title}
            description={
              <Text
                size="md"
                disabled={
                  stageGrouped.stageLost.dealsAggregate?.[0]?.sum?.value === 0
                }
              >
                {currencyNumber(
                  stageGrouped.stageLost.dealsAggregate?.[0]?.sum?.value || 0
                )}
              </Text>
            }
            count={stageGrouped.stageLost.deals.length}
            variant="solid"
          >
            {stageGrouped.stageLost.deals.map((deal) => {
              return (
                <KanbanItem
                  key={deal.id}
                  id={deal.id}
                  data={{
                    ...deal,
                    stageId: stageGrouped.stageLost.id,
                  }}
                >
                  <DealKanbanCardMemo
                    id={deal.id}
                    key={deal.id}
                    title={deal.title}
                    company={{
                      name: deal.company.name,
                      avatarUrl: deal.company.avatarUrl,
                    }}
                    user={{
                      name: deal.dealOwner.name,
                      avatarUrl: deal.dealOwner.avatarUrl,
                    }}
                    date={deal.createdAt}
                    price={currencyNumber(deal.value || 0)}
                    variant="lost"
                  />
                </KanbanItem>
              );
            })}
          </KanbanColumn>
        )}
        <DealKanbanWonLostDrop />
      </KanbanBoard>
      {children}
    </>
  );
};

const PageSkeleton = () => {
  const columnCount = 5; // Number of columns in the Kanban board
  const itemCount = 4; // Number of items (cards) in each column

  return (
    <KanbanBoardSkeleton>
      {Array.from({ length: columnCount }).map((_, columnIndex) => (
        <KanbanColumnSkeleton key={columnIndex} type="deal">
          {Array.from({ length: itemCount }).map((_, itemIndex) => (
            <DealKanbanCardSkeleton key={itemIndex} />
          ))}
        </KanbanColumnSkeleton>
      ))}
      <KanbanAddStageButton disabled />
      <KanbanColumnSkeleton type="deal" variant="solid">
        {Array.from({ length: itemCount }).map((_, itemIndex) => (
          <DealKanbanCardSkeleton key={itemIndex} />
        ))}
      </KanbanColumnSkeleton>
      <KanbanColumnSkeleton type="deal" variant="solid">
        {Array.from({ length: itemCount }).map((_, itemIndex) => (
          <DealKanbanCardSkeleton key={itemIndex} />
        ))}
      </KanbanColumnSkeleton>
    </KanbanBoardSkeleton>
  );
};
