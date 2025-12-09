import { useEffect, useState, type ChangeEvent } from "react";
import Button from "./components/Button";
import InvoiceFeed, { type Invoice } from "./components/InvoiceFeed";

const expressPort = import.meta.env.VITE_EXPRESS_PORT || 3000;
const n8nPort = import.meta.env.VITE_N8N_PORT || 5678;

function App() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState<string>("");

  //Initially fetch invoices to display
  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    const response = await fetch(
      `http://localhost:${expressPort}/api/invoices`
    );
    const data = await response.json();
    setInvoices(data);
  };

  //Handle changes to inputs
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      setUrl(e.target.value);
    }
  };

  //Helper function
  const isValidUrl = (input: string) => {
    try {
      new URL(input);
      return true;
    } catch (err) {
      return false;
    }
  };

  //Handle Uploading Invoice Url
  const handleInvoiceUrl = async () => {
    if (!isValidUrl(url)) return;

    const response = await fetch(
      `http://localhost:${n8nPort}/webhook-test/invoice`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageUrl: url,
        }),
      }
    );

    //Update List if Upload Successful
    if (response.ok) {
      fetchInvoices();
    }
  };

  //Handle File Upload
  const handleInvoiceFile = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(
      `http://localhost:${n8nPort}/webhook-test/invoice`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (response.ok) {
      fetchInvoices();
    }
  };

  //Downloading CSV
  const handleDownloadCSV = async () => {
    const response = await fetch(
      `http://localhost:${expressPort}/api/csv-export`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const contentDisposition = response.headers.get("Content-Disposition");

    let filename = "invoices.csv";
    if (contentDisposition && contentDisposition.includes("filename=")) {
      filename = contentDisposition.split("filename=")[1].replace(/"/g, "");
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  };

  return (
    <>
      <div
        style={{ width: "100%", height: "100%", backgroundColor: "#f5f5f5" }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "1rem",
            width: "100%",
            marginBottom: "1rem",
            marginTop: "1rem",
          }}
        >
          <input type="text" onChange={handleUrlChange} />
          <Button label={"Upload Invoice Url"} onClick={handleInvoiceUrl} />
          <label
            style={{
              display: "inline-block",
              background: "#eee",
              padding: "4px 10px",
              fontSize: "12px",
              borderRadius: "4px",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#555")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#eee")}
          >
            {file ? file.name : "Choose File"}
            <input
              type="file"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
          </label>
          <Button label={"Upload Invoice File"} onClick={handleInvoiceFile} />
          <Button label={"Download CSV"} onClick={handleDownloadCSV} />
        </div>
        <InvoiceFeed invoices={invoices} />
      </div>
    </>
  );
}

export default App;
