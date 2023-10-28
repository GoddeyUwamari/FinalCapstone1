import { format } from "date-fns";
import { capitalize } from "lodash";
import { reservationPagePath } from "./pageRoutes";

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
      <span data-reservation-id-status={reservation_id} className={status}>
        {capitalize(status)}
      </span>
    ),
  },
  {
    name: "People",
    render: ({ people }) => people,
  },
];

export const getReservationsActions = (handleStateUpdate) => [
  {
    render: (activeReservation) => (
      <a
        href={`${reservationPagePath}/${activeReservation.reservation_id}/edit`}
      >
        Edit
      </a>
    ),
    handleVisibility: (activeReservation) =>
      activeReservation.status === "booked",
  },
  {
    render: (activeReservation) => (
      <a
        href={`${reservationPagePath}/${activeReservation.reservation_id}/seat`}
        data-reservation-id-status={activeReservation.reservation_id}
      >
        Seat
      </a>
    ),
    handleVisibility: (activeReservation) =>
      activeReservation.status === "booked",
  },
  {
    render: (activeReservation) => (
      <span
        onClick={() =>
          handleStateUpdate({
            activeReservation,
            openModal: true,
            modalType: "cancel",
          })
        }
        data-reservation-id-cancel={activeReservation.reservation_id}
      >
        Cancel
      </span>
    ),
    handleVisibility: (activeReservation) =>
      activeReservation.status === "booked",
  },
];

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
          className="table-finished"
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
