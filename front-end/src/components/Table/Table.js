import React from "react";
import { uniqueId } from "lodash";
import { VscBook } from "react-icons/vsc";
import { BiDotsVerticalRounded, BiCheck } from "react-icons/bi";

import styles from "./Table.module.css";

const Table = ({ data, dataSchema, actions }) => {
  const hasActions = actions && actions.length > 0;

  const getActionVisibility = (row) =>
    actions.filter((action) => {
      if (action.handleVisibility) {
        const isVisible = action.handleVisibility(row);
        return !isVisible;
      }

      return true;
    });

  return (
    <>
      {data.length > 0 ? (
        <table className={styles.Table}>
          <thead className={styles.Table_head}>
            <tr>
              {dataSchema?.map((item) => (
                <th key={uniqueId("table-head_")}>{item.name}</th>
              ))}
              {hasActions ? <th>&nbsp;</th> : null}
            </tr>
          </thead>

          <tbody className={styles.Table_body}>
            {data.map((item) => (
              <tr key={uniqueId("table-body_")} id={item.id}>
                {dataSchema?.map((data) => (
                  <td key={uniqueId("table-row_")}>{data.render(item)}</td>
                ))}

                {hasActions ? (
                  <td className={styles.Table_body_option}>
                    {getActionVisibility(item).length > 0 ? (
                      <>
                        <BiDotsVerticalRounded
                          className={styles.Table_body_option_icon}
                        />
                        <ul className={styles.Table_body_dropdown}>
                          {actions.map((action) => {
                            const testId =
                              action.addTestId && action.addTestId(item)
                                ? action.addTestId(item)
                                : "";
                            const isVisible = action.handleVisibility
                              ? !action.handleVisibility(item)
                              : true;
                            return (
                              <React.Fragment key={uniqueId("table-action_")}>
                                {isVisible ? (
                                  <li
                                    onClick={() => action.onClick(item)}
                                    className={styles.Table_body_dropdown_item}
                                    {...testId}
                                  >
                                    {action.label}
                                  </li>
                                ) : null}
                              </React.Fragment>
                            );
                          })}
                        </ul>
                      </>
                    ) : (
                      <BiCheck className={styles.Table_body_option_icon} />
                    )}
                  </td>
                ) : null}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className={styles.Table_empty}>
          <div className={styles.Table_empty_svg}>
            <VscBook />
          </div>
          <p>No current reservation</p>
        </div>
      )}
    </>
  );
};

export default Table;
