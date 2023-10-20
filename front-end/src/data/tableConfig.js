import { format } from "date-fns";
import { capitalize } from "lodash";

export const getReservationsDataSchema = () => [
  {
    name: "Date",
    render: ({ reservation_date }) =>
      format(new Date(reservation_date), "MMM dd, yyyy"),
  },
  {
    name: "Name",
    render: ({ first_name, last_name }) => `${first_name} ${last_name}`,
  },
  {
    name: "Phone",
    render: ({ mobile_number }) => mobile_number,
  },
  {
    name: "Status",
    render: ({ status, reservation_id }) => (
      <span data-reservation-id-status={reservation_id}>
        {capitalize(status)}
      </span>
    ),
  },
  {
    name: "People",
    render: ({ people }) => people,
  },
];

export const getReservationsActions = (handleStateUpdate) => {
  const handleVisibility = (activeReservation) =>
    activeReservation.status === "finished" ||
    activeReservation.status === "seated";

  return [
    {
      label: "Edit reservation",
      onClick: (activeReservation) =>
        handleStateUpdate({
          activeReservation,
          openModal: true,
          modalType: "edit",
        }),
      handleVisibility,
    },
    {
      label: "Update status",
      onClick: (activeReservation) =>
        handleStateUpdate({
          activeReservation,
          openModal: true,
          modalType: "status",
        }),
      handleVisibility: (activeReservation) =>
        activeReservation.status === "finished",
    },
    {
      label: "Assign seat",
      onClick: (activeReservation) =>
        handleStateUpdate({
          activeReservation,
          openModal: true,
          modalType: "assign-seat",
        }),
      handleVisibility,
    },
    {
      label: "Cancel reservation",
      onClick: (activeReservation) =>
        handleStateUpdate({
          activeReservation,
          openModal: true,
          modalType: "cancel",
        }),
      handleVisibility,
      addTestId: (activeReservation) => ({
        "data-reservation-id-cancel": activeReservation.reservation_id,
      }),
    },
  ];
};

export const getTableDataSchema = (handleStateUpdate) => [
  {
    name: "Table name",
    render: ({ table_name }) => table_name,
  },
  {
    name: "Capacity",
    render: ({ capacity }) => capacity,
  },
  {
    name: "Status",
    render: ({ status, table_id }) => (
      <span data-table-id-status={table_id}>{capitalize(status)}</span>
    ),
  },
  {
    name: "",
    render: ({ table_id, status }) => {
      return status !== "free" ? (
        <button
          className="finished"
          data-table-id-finish={table_id}
          onClick={() =>
            handleStateUpdate({
              activeTableId: table_id,
              openModal: true,
              modalType: "finished",
            })
          }
        >
          Finished
        </button>
      ) : null;
    },
  },
];
