import React from "react";
import { Card } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import Paper from "../../components/Mui/surfaces/Paper/Paper";

const EmptyState = () => {
  return (
    <Card elevation={0} component={Paper} style={{ padding: "16px" }}>
      <Alert severity="info">
        No cards available, Click on <strong>Edit</strong> button to add new
        cards
      </Alert>
    </Card>
  );
};

export default EmptyState;
