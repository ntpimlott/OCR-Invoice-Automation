import React from "react";

export type Invoice = {
  date: string;
  vendor: string;
  amount: number;
  status: string;
};

type InvoiceFeedProps = {
  invoices: Invoice[];
};

const InvoiceFeed: React.FC<InvoiceFeedProps> = ({ invoices }) => {
  return (
    <div
      style={{
        height: "100vh",
        width: "100%",
        padding: "1rem",
        boxSizing: "border-box",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        paddingBottom: "2rem",
      }}
    >
      {invoices.map((invoice: Invoice, key: number) => (
        <div
          key={key}
          style={{
            width: "100%",
            maxWidth: "800px",
            margin: "0 auto",
            padding: "1rem",
            border: "1px solid #ccc",
            borderRadius: "8px",
            backgroundColor: "#fff",
            boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
          }}
        >
          <p>Date: {invoice.date}</p>
          <p>Vendor: {invoice.vendor}</p>
          <p>Amount: ${invoice.amount}</p>
          <p>Status: {invoice.status}</p>
        </div>
      ))}
    </div>
  );
};

export default InvoiceFeed;
