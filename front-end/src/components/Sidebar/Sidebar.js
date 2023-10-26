import React from "react";
import { PAGE_CONFIG } from "../../data/pageConfig";
import { uniqueId } from "lodash";
import { NavLink } from "react-router-dom";
import cx from "classnames";

import styles from "./Sidebar.module.css";

const Sidebar = () => {
  return (
    <div className={styles.Sidebar}>
      <div className={styles.Sidebar_brand}>
        <h1 className={styles.Sidebar_brand_title}>Capstone</h1>
        <p className={styles.Sidebar_brand_text}>Restaurant reservations</p>
      </div>

      <ul className={styles.Sidebar_links}>
        {PAGE_CONFIG.map(({ label, icon, routes }) => (
          <li key={uniqueId("page-config")}>
            <NavLink
              to={routes}
              className={({ isActive }) =>
                cx(styles.Sidebar_links_item, {
                  [styles.Sidebar_links_item_active]: isActive,
                })
              }
            >
              {icon}
              <span>{label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
