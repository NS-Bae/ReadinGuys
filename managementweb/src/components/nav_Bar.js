import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";

import styles from "./navbarStyle.ts";

const MyNavbar = ({ onButtonClick }) => {
  return (
    <AppBar sx={styles.appBar} position="static">
      <Toolbar sx={styles.toolBar}>
        <Button id="management_academy" sx={styles.button} onClick={onButtonClick}>학원 관리</Button>
        <Button id="management_student" sx={styles.button} onClick={onButtonClick}>회원 관리</Button>
        <Button id="management_workbook" sx={styles.button} onClick={onButtonClick}>문제집 관리</Button>
      </Toolbar>
    </AppBar>
  );
};

export default MyNavbar;
