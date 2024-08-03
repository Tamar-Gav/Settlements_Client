import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { InputText } from "primereact/inputtext";
import { Dialog } from "primereact/dialog";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { StyledEngineProvider } from "@mui/material/styles";
import rtlPlugin from "stylis-plugin-rtl";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { prefixer } from "stylis";
import "./SettlementsDemo.css";
// יצירת הקאש עבור RTL
const cacheRtl = createCache({
  key: "muirtl",
  stylisPlugins: [prefixer, rtlPlugin],
});

// יצירת ה-Theme עם RTL
const theme = createTheme({
  direction: "rtl",
  typography: {
    fontFamily: "Arial",
  },
  palette: {
    primary: {
      main: "#1976d2",
    },
  },
});

export default function SettlementsDemo() {
  let emptySettlement = {
    id: null,
    name: "",
  };
  const lettersDictionary = {
    a: "ש",
    b: "נ",
    c: "ב",
    d: "ג",
    e: "ק",
    f: "כ",
    g: "ע",
    h: "י",
    i: "ן",
    j: "ח",
    k: "ל",
    l: "ך",
    m: "צ",
    n: "מ",
    o: "ם",
    p: "פ",
    q: "/",
    r: "ר",
    s: "ד",
    t: "א",
    u: "ו",
    v: "ה",
    w: "'",
    x: "ס",
    y: "ט",
    z: "ז",
    A: "ש",
    B: "נ",
    C: "ב",
    D: "ג",
    E: "ק",
    F: "כ",
    G: "ע",
    H: "י",
    I: "ן",
    J: "ח",
    K: "ל",
    L: "ך",
    M: "צ",
    N: "מ",
    O: "ם",
    P: "פ",
    Q: "/",
    R: "ר",
    S: "ד",
    T: "א",
    U: "ו",
    V: "ה",
    W: "'",
    X: "ס",
    Y: "ט",
    Z: "ז",
  };
  const [settlements, setSettlements] = useState(null);
  const [loading, setLoading] = useState(false);
  const [settlementDialog, setSettlementDialog] = useState(false);
  const [deleteSettlementDialog, setDeleteSettlementDialog] = useState(false);
  const [settlement, setSettlement] = useState(emptySettlement);
  const [selectedSettlements, setSelectedSettlements] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const toast = useRef(null);
  const dt = useRef(null);

  const loadSettlements = () => {
    fetch("https://localhost:44382/api/Settlement")
      .then((response) => response.json())
      .then((data) => {
        const formattedData = data.map((item) => ({
          id: item.settlementId,
          name: item.settlementName,
        }));
        setSettlements(formattedData);
      })
      .then(() => setLoading(false))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    loadSettlements();
  }, [loading]);

  const openNew = () => {
    setSettlement(emptySettlement);
    setSubmitted(false);
    setSettlementDialog(true);
  };

  const hideDialog = () => {
    setSubmitted(false);
    setSettlementDialog(false);
  };

  const hideDeleteSettlementDialog = () => {
    setDeleteSettlementDialog(false);
  };

  const saveSettlement = () => {
    setSubmitted(true);
    if (settlement.name.trim()) {
      let settlementToSend = {
        SettlementName: settlement.name,
        SettlementId: settlement.id,
      };
      if (settlement.id) {
        fetch("https://localhost:44382/api/Settlement", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(settlementToSend),
        })
          .then((response) => {
            if (response.ok) {
              toast.current.show({
                severity: "success",
                summary: "הבקשה אושרה",
                detail: "שם הישוב השתנה בהצלחה",
                life: 3000,
              });
              setLoading(true);
            } else if (response.status == 409) {
              toast.current.show({
                severity: "info",
                summary: "הבקשה נדחתה",
                detail: "שם זה כבר קיים במערכת",
                life: 3000,
              });
            } else {
              toast.current.show({
                severity: "info",
                summary: "נכשל בשינוי",
                detail: "אובייקט שגוי",
                life: 3000,
              });
            }
          })
          .catch((err) => console.log(err));
      } else {
        let settlementToSend = {
          SettlementName: settlement.name,
        };
        fetch("https://localhost:44382/api/Settlement", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(settlementToSend),
        })
          .then((response) => {
            if (response.ok) {
              toast.current.show({
                severity: "success",
                summary: "הבקשה התקבלה",
                detail: "הישוב נוסף בהצלחה",
                life: 3000,
              });
              setLoading(true);
            } else if (response.status == 409) {
              toast.current.show({
                severity: "info",
                summary: "הבקשה נדחתה",
                detail: "ישוב זה כבר קיים במערכת",
                life: 3000,
              });
            } else {
              toast.current.show({
                severity: "info",
                summary: "נכשל בשינוי",
                detail: "אובייקט שגוי",
                life: 3000,
              });
            }
          })
          .catch((err) => console.log(err));
      }
      setSettlementDialog(false);
      setSettlement(emptySettlement);
    }
  };

  const editSettlement = (settlement) => {
    setSettlement({ ...settlement });
    setSettlementDialog(true);
  };

  const confirmDeleteSettlement = (settlement) => {
    setSettlement(settlement);
    setDeleteSettlementDialog(true);
  };

  const deleteSettlement = () => {
    fetch(`https://localhost:44382/api/Settlement/${settlement.id}`, {
      method: "DELETE",
    })
      .then((response) =>
        response.ok
          ? toast.current.show({
              severity: "success",
              summary: "הבקשה אושרה",
              detail: "הישוב נמחק בהצלחה",
              life: 3000,
            })
          : toast.current.show({
              severity: "info",
              summary: "הבקשה נכשלה",
              detail: "לא ניתן למחוק את הישוב",
              life: 3000,
            })
      )
      .then(() => setLoading(true))
      .catch((err) => console.log(err));
    setDeleteSettlementDialog(false);
  };

  const exportCSV = () => {
    dt.current.exportCSV();
  };

  const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || "";
    let _settlement = { ...settlement };
    _settlement[`${name}`] = val;
    setSettlement(_settlement);
  };

  const leftToolbarTemplate = () => {
    return (
      <div className="toolbar-container">
        <Button
          label="הוסף ישוב"
          icon="pi pi-plus"
          severity="success"
          onClick={openNew}
        />
      </div>
    );
  };

  const rightToolbarTemplate = () => {
    return (
      <Button
        label="יצא"
        icon="pi pi-upload"
        className="p-button-help"
        onClick={exportCSV}
      />
    );
  };

  const header = (
    <div className="header-container">
      <h4 className="header-title">ניהול ישובים</h4>
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText
          dir="rtl"
          type="search"
          onInput={(e) => {
            let sinit = "";
            let searching = e.target.value;
            for (let index = 0; index < searching.length; index++) {
              const letter = searching[index];
              if (letter >= "A" && letter <= "z") {
                sinit += lettersDictionary[letter];
              } else {
                setGlobalFilter(e.target.value);
                return;
              }
            }
            setGlobalFilter(sinit);
          }}
          placeholder="חיפוש"
        />
      </span>
    </div>
  );

  const settlementDialogFooter = (
    <React.Fragment>
      <Button label="בטל" icon="pi pi-times" outlined onClick={hideDialog} />
      <Button label="שמור" icon="pi pi-check" onClick={saveSettlement} />
    </React.Fragment>
  );

  const deleteSettlementDialogFooter = (
    <React.Fragment>
      <Button
        label="לא"
        icon="pi pi-times"
        outlined
        onClick={hideDeleteSettlementDialog}
      />
      <Button
        label="כן"
        icon="pi pi-check"
        severity="danger"
        onClick={deleteSettlement}
      />
    </React.Fragment>
  );

  return (
    <CacheProvider value={cacheRtl}>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <div className="table-container" dir="rtl">
            <Toast ref={toast} />
            <div className="card">
              <Toolbar
                className="mb-4"
                left={leftToolbarTemplate}
                right={rightToolbarTemplate}
              ></Toolbar>

              <DataTable
                ref={dt}
                value={settlements}
                selection={selectedSettlements}
                onSelectionChange={(e) => setSelectedSettlements(e.value)}
                dataKey="id"
                paginator
                rows={5}
                rowsPerPageOptions={[5, 10, 25]}
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                currentPageReportTemplate="מראה {first} עד {last} מתוך {totalRecords} ישובים"
                globalFilter={globalFilter}
                header={header}
                className="custom-table" // הוסף את המחלקה המותאמת אישית
              >
                <Column field="name" header="שם" sortable></Column>
                <Column
                  body={(rowData) => (
                    <div className="actions">
                      <Button
                        icon="pi pi-pencil"
                        rounded
                        outlined
                        className="mr-2"
                        onClick={() => editSettlement(rowData)}
                      />
                      <Button
                        icon="pi pi-trash"
                        rounded
                        outlined
                        severity="danger"
                        onClick={() => confirmDeleteSettlement(rowData)}
                      />
                    </div>
                  )}
                ></Column>
              </DataTable>
            </div>

            <Dialog
              visible={settlementDialog}
              dir="rtl"
              style={{ width: "32rem" }}
              breakpoints={{ "960px": "75vw", "641px": "90vw" }}
              header="פרטי הישוב"
              modal
              className="p-fluid"
              footer={settlementDialogFooter}
              onHide={hideDialog}
            >
              <div className="field">
                <label htmlFor="name" className="font-bold">
                  שם
                </label>
                <InputText
                  id="name"
                  value={settlement.name}
                  onChange={(e) => onInputChange(e, "name")}
                  required
                  autoFocus
                />
                {submitted && !settlement.name && (
                  <small className="p-error">שם נדרש.</small>
                )}
              </div>
            </Dialog>

            <Dialog
              visible={deleteSettlementDialog}
              dir="rtl"
              style={{ width: "32rem" }}
              breakpoints={{ "960px": "75vw", "641px": "90vw" }}
              header="אישור"
              modal
              footer={deleteSettlementDialogFooter}
              onHide={hideDeleteSettlementDialog}
            >
              <div className="confirmation-content">
                <i
                  className="pi pi-exclamation-triangle mr-3"
                  style={{ fontSize: "2rem" }}
                />
                {settlement && (
                  <span>
                    <b>{settlement.name}</b> האם אתה בטוח שברצונך למחוק את ?
                  </span>
                )}
              </div>
            </Dialog>
          </div>
        </ThemeProvider>
      </StyledEngineProvider>
    </CacheProvider>
  );
}
