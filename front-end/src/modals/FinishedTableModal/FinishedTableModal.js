import React from "react";
import { toast } from "react-toastify";
import { Modal } from "../../components";
import {
  fetchTableById,
  finishTable,
  updateReservationStatus,
} from "../../utils/api";

import styles from "./FinishedTableModal.module.css";

const FinishedTableModal = ({ table_id, show, handleClose, refresh }) => {
  const [table, setTable] = React.useState(null);

  const handleFinish = React.useCallback(async () => {
    const controller = new AbortController();
    try {
      if (table_id && table.reservation_id) {
        return await finishTable(
          table_id,
          async (isSuccessfull) => {
            if (isSuccessfull) {
              return await updateReservationStatus(
                "finished",
                table.reservation_id,
                (isUpdated) => {
                  if (isUpdated) {
                    refresh();
                    toast.success("Table finished successfully");
                    handleClose();
                  } else {
                    throw new Error("Failed to updated status");
                  }
                },
                controller.signal
              );
            } else {
              throw new Error("Unable to finish table");
            }
          },
          controller.signal
        );
      }
    } catch (error) {
      toast.error(error.message);
    }
    return () => controller.abort();
  }, [table, table_id, handleClose, refresh]);

  const handleFetchTable = React.useCallback(
    async (signal) => {
      try {
        if (table_id) {
          const res = await fetchTableById(table_id, signal);

          if (!res) throw new Error(res.error);

          setTable(res);
        }
      } catch (error) {
        toast.error(error);
      }
    },
    [table_id]
  );

  React.useEffect(() => {
    const controller = new AbortController();
    handleFetchTable(controller.signal);

    return () => controller.abort();
  }, [table_id, handleFetchTable]);

  return (
    <Modal show={show} handleClose={handleClose} action={handleFinish}>
      <h3 className={styles.FinishedTableModal_title}>Checkout</h3>
      <p className={styles.FinishedTableModal_text}>
        Is this table ready to seat new guests? This cannot be undone.
      </p>
    </Modal>
  );
};

export default FinishedTableModal;
